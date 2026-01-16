(function () {
    'use strict';
    angular
        .module('app')
        .controller('ServicesController', ServicesController);

    ServicesController.$inject = ['$scope', '$http', 'brudexservices', 'brudexutils', '$location', '$timeout'];

    function ServicesController($scope, $http, services, utils, $location, $timeout) {
        var vm = this;

        // Properties
        vm.projects = [];
        vm.services = [];
        vm.selectedProject = null;
        vm.loading = false;
        vm.availableServices = [
            { name: 'twitter', displayName: 'Twitter / X' },
            { name: 'facebook', displayName: 'Facebook / Meta' },
            { name: 'instagram', displayName: 'Instagram' },
            { name: 'linkedin', displayName: 'LinkedIn' },
            { name: 'mastodon', displayName: 'Mastodon' },
            { name: 'tiktok', displayName: 'TikTok' },
            { name: 'unsplash', displayName: 'Unsplash' },
            { name: 'tenor', displayName: 'Tenor' }
        ];

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.loadServices = loadServices;
        vm.onProjectChange = onProjectChange;
        vm.selectProject = selectProject;
        vm.configureService = configureService;
        vm.getServiceStatus = getServiceStatus;
        vm.capitalize = capitalize;
        vm.getProjectInitials = getProjectInitials;

        // Initialize
        function init(projectUuid) {
            loadProjects();
            
            // If projectUuid is provided, set it as selected and load services for that project
            if (projectUuid) {
                $timeout(function() {
                    var project = vm.projects.find(function(p) {
                        return p.uuid === projectUuid;
                    });
                    if (project) {
                        vm.selectedProject = project;
                        loadServices(projectUuid);
                    }
                }, 500);
            }
            // Don't load services if no project is selected
        }

        // Load all projects
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

        // Load services (optionally filtered by project)
        function loadServices(projectUuid) {
            vm.loading = true;
            var url = '/dashboard/api/services';
            if (projectUuid) {
                url += '?projectUuid=' + projectUuid;
            }
            
            $http.get(url).then(function(response) {
                vm.loading = false;
                if (response.data.success) {
                    var allServices = response.data.data || [];
                    
                    // Map available services with their configuration status
                    vm.services = vm.availableServices.map(function(availableService) {
                        var configuredService = allServices.find(function(s) {
                            return s.name === availableService.name;
                        });
                        return {
                            name: availableService.name,
                            displayName: availableService.displayName,
                            configured: configuredService ? configuredService.configured : false,
                            active: configuredService ? configuredService.active : false,
                            projectUuid: configuredService ? configuredService.projectUuid : null
                        };
                    });
                } else {
                    // If API fails, use default services list
                    vm.services = vm.availableServices.map(function(s) {
                        return {
                            name: s.name,
                            displayName: s.displayName,
                            configured: false,
                            active: false,
                            projectUuid: null
                        };
                    });
                }
            }).catch(function(error) {
                vm.loading = false;
                // If API fails, use default services list
                vm.services = vm.availableServices.map(function(s) {
                    return {
                        name: s.name,
                        displayName: s.displayName,
                        configured: false,
                        active: false,
                        projectUuid: null
                    };
                });
            });
        }

        // Handle project selection from dropdown
        function selectProject(project, event) {
            // Prevent default link behavior
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            vm.selectedProject = project;
            
            // Close the dropdown immediately - do it synchronously first, then with timeout
            var dropdownToggle = document.querySelector('.project-dropdown-toggle');
            if (dropdownToggle) {
                // Find the dropdown menu
                var parent = dropdownToggle.closest('.dropdown');
                var dropdownMenu = parent ? parent.querySelector('.dropdown-menu') : null;
                
                // Immediately remove show classes
                dropdownToggle.classList.remove('show');
                dropdownToggle.setAttribute('aria-expanded', 'false');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
                
                // Also use Bootstrap API
                $timeout(function() {
                    try {
                        var dropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
                        if (dropdown) {
                            dropdown.hide();
                        }
                    } catch (e) {
                        // Fallback: ensure it's closed
                        dropdownToggle.classList.remove('show');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                        if (dropdownMenu) {
                            dropdownMenu.classList.remove('show');
                        }
                    }
                }, 0);
            }
            
            // Load services for the selected project
            onProjectChange();
        }

        // Handle project selection change - navigate to project-specific services page
        function onProjectChange() {
            if (vm.selectedProject && vm.selectedProject.uuid) {
                // Load services for the selected project
                loadServices(vm.selectedProject.uuid);
            } else {
                // If no project selected, clear services
                vm.services = [];
            }
        }

        // Navigate to configure service
        function configureService(serviceName, projectUuid) {
            // Check if project is selected
            if (!vm.selectedProject && !projectUuid) {
                utils.alertWarning('Project Required', 'Please select a project before configuring services.');
                return;
            }

            var url = '/dashboard/services/configure/' + serviceName;
            if (projectUuid) {
                url += '?project=' + projectUuid;
            } else if (vm.selectedProject && vm.selectedProject.uuid) {
                url += '?project=' + vm.selectedProject.uuid;
            } else {
                utils.alertWarning('Project Required', 'Please select a project before configuring services.');
                return;
            }
            window.location.href = url;
        }

        // Get service status badge class
        function getServiceStatus(service) {
            if (service.configured) {
                return 'bg-success';
            }
            return 'bg-secondary';
        }

        // Capitalize first letter
        function capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
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

