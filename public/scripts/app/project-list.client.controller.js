(function () {
    'use strict';
    angular
        .module('app')
        .controller('ProjectListController', ProjectListController);

    ProjectListController.$inject = ['$scope', 'brudexservices', 'brudexutils', '$timeout'];

    function ProjectListController($scope, services, utils, $timeout) {
        var vm = this;

        // Properties
        vm.projects = [];
        vm.loading = false;
        vm.editingProject = null;
        vm.showEditModal = false;
        vm.editForm = {
            name: '',
            description: '',
            image: null,
            imagePreview: null
        };

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.deleteProject = deleteProject;
        vm.openEditModal = openEditModal;
        vm.closeEditModal = closeEditModal;
        vm.updateProject = updateProject;
        vm.onImageSelect = onImageSelect;
        vm.getProjectInitials = getProjectInitials;

        // Initialize
        function init() {
            loadProjects();
        }

        // Load projects
        function loadProjects() {
            vm.loading = true;
            services.getProjects(function(response) {
                vm.loading = false;
                if (response.success) {
                    vm.projects = response.data || [];
                } else {
                    utils.alertError('Error', response.message || 'Failed to load projects');
                }
            });
        }

        // Delete project
        function deleteProject(project) {
            var hasPostsOrAccounts = (project.accountCount > 0) || (project.postCount > 0);
            
            if (!hasPostsOrAccounts) {
                // Show confirmation alert (no input) if no posts or accounts
                utils.alertConfirm(
                    'Delete Project',
                    'Are you sure you want to delete "' + project.name + '"? This action cannot be undone.',
                    function(result) {
                        if (result.isConfirmed) {
                            services.deleteProject(project.uuid, function(response) {
                                if (response.success) {
                                    utils.toastSuccess('Project deleted successfully');
                                    loadProjects();
                                } else {
                                    utils.alertError('Error', response.message || 'Failed to delete project');
                                }
                            });
                        }
                    }
                );
            } else {
                // Show confirmation with project name input if it has posts or accounts
                utils.alertInputModal(
                    'Delete Project',
                    'This project has ' + (project.accountCount || 0) + ' account(s) and ' + (project.postCount || 0) + ' post(s). This action cannot be undone. Please type the project name "' + project.name + '" to confirm deletion.',
                    function(result) {
                        if (result.isConfirmed && result.value === project.name) {
                            services.deleteProject(project.uuid, function(response) {
                                if (response.success) {
                                    utils.alertSuccess('Success', 'Project deleted successfully');
                                    loadProjects();
                                } else {
                                    utils.alertError('Error', response.message || 'Failed to delete project');
                                }
                            });
                        } else if (result.isConfirmed) {
                            utils.alertError('Error', 'Project name does not match. Deletion cancelled.');
                        }
                    },
                    {
                        confirmButtonText: 'Delete',
                        icon: 'warning',
                        validator: function(value) {
                            if (!value) {
                                return 'Please enter the project name';
                            }
                            if (value !== project.name) {
                                return 'Project name does not match';
                            }
                            return null;
                        }
                    }
                );
            }
        }

        // Open edit modal
        function openEditModal(project) {
            // Set form data first
            vm.editingProject = Object.assign({}, project);
            
            // Clear and set form values - update existing object to trigger Angular bindings
            vm.editForm.name = project.name || '';
            vm.editForm.description = project.description || '';
            vm.editForm.image = null;
            vm.editForm.imagePreview = project.imageUrl || null;
            
            vm.showEditModal = true;
            
            // Use $timeout to ensure digest cycle runs and bindings are updated before showing modal
            $timeout(function() {
                var modalElement = document.getElementById('editProjectModal');
                if (modalElement) {
                    var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                    
                    // Set up event listeners for modal lifecycle
                    function setupFileInput() {
                        $timeout(function() {
                            var editImageInput = document.getElementById('editProjectImage');
                            if (editImageInput) {
                                // Remove any existing listeners by cloning
                                var newInput = editImageInput.cloneNode(true);
                                editImageInput.parentNode.replaceChild(newInput, editImageInput);
                                
                                // Add event listener (CSP compliant)
                                newInput.addEventListener('change', function(e) {
                                    if (e.target.files && e.target.files.length > 0) {
                                        $timeout(function() {
                                            vm.onImageSelect(e);
                                        }, 0);
                                    }
                                });
                            }
                        }, 50);
                    }
                    
                    // Handle modal shown event
                    modalElement.addEventListener('shown.bs.modal', setupFileInput, { once: true });
                    
                    // Handle modal hidden event to clean up
                    modalElement.addEventListener('hidden.bs.modal', function() {
                        vm.closeEditModal();
                    }, { once: true });
                    
                    // Show modal
                    modal.show();
                }
            }, 100);
        }

        // Close edit modal
        function closeEditModal() {
            // Reset form
            vm.editingProject = null;
            vm.editForm = {
                name: '',
                description: '',
                image: null,
                imagePreview: null
            };
            
            // Hide modal and reset flag
            var modalElement = document.getElementById('editProjectModal');
            if (modalElement) {
                var modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            
            // Reset flag after modal is hidden
            $timeout(function() {
                vm.showEditModal = false;
            }, 300);
        }

        // Handle image selection
        function onImageSelect(event) {
            var file = event.target.files[0];
            if (file) {
                vm.editForm.image = file;
                var reader = new FileReader();
                reader.onload = function(e) {
                    $timeout(function() {
                        vm.editForm.imagePreview = e.target.result;
                    }, 0);
                };
                reader.readAsDataURL(file);
            }
        }

        // Update project
        function updateProject() {
            if (!vm.editForm.name || vm.editForm.name.trim() === '') {
                utils.alertError('Error', 'Project name is required');
                return;
            }

            var formData = new FormData();
            formData.append('name', vm.editForm.name.trim());
            formData.append('description', vm.editForm.description ? vm.editForm.description.trim() : '');
            if (vm.editForm.image) {
                formData.append('image', vm.editForm.image);
            }

            services.updateProject(vm.editingProject.uuid, formData, function(response) {
                if (response.success) {
                    utils.alertSuccess('Success', 'Project updated successfully');
                    closeEditModal();
                    loadProjects();
                } else {
                    utils.alertError('Error', response.message || 'Failed to update project');
                }
            });
        }

        // Get project initials (first 2 letters, best practice)
        function getProjectInitials(name) {
            if (!name || name.trim() === '') {
                return '??';
            }
            
            var trimmed = name.trim();
            var words = trimmed.split(/\s+/);
            
            // If single word, take first 2 characters
            if (words.length === 1) {
                return trimmed.substring(0, 2).toUpperCase();
            }
            
            // If multiple words, take first letter of first two words
            if (words.length >= 2) {
                return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
            }
            
            // Fallback: first 2 characters
            return trimmed.substring(0, 2).toUpperCase();
        }
    }
})();

