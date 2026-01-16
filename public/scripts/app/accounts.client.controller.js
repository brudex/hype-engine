(function () {
    'use strict';
    angular
        .module('app')
        .controller('AccountsController', AccountsController);

    AccountsController.$inject = ['$scope', '$http', 'brudexservices', 'brudexutils', '$timeout'];

    function AccountsController($scope, $http, services, utils, $timeout) {
        var vm = this;

        // Properties
        vm.projects = [];
        vm.accounts = [];
        vm.selectedProject = null;
        vm.loading = false;
        vm.isConfiguredService = {};
        vm.isServiceActive = {};
        vm.configuredServices = [];
        vm.selectedProjectUuid = null;

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.loadAccounts = loadAccounts;
        vm.loadServices = loadServices;
        vm.onProjectChange = onProjectChange;
        vm.selectProject = selectProject;
        vm.getProjectInitials = getProjectInitials;
        vm.hasUnconfiguredServices = hasUnconfiguredServices;
        vm.refreshAccount = refreshAccount;
        vm.deleteAccount = deleteAccount;
        vm.openAddAccountModal = openAddAccountModal;
        vm.closeAddAccountModal = closeAddAccountModal;
        vm.connectAccount = connectAccount;
        vm.getServiceIcon = getServiceIcon;
        vm.getServiceName = getServiceName;

        // Initialize
        function init(accounts, isConfiguredService, isServiceActive, projectUuid) {
            vm.accounts = accounts || [];
            vm.isConfiguredService = isConfiguredService || {};
            vm.isServiceActive = isServiceActive || {};
            vm.selectedProjectUuid = projectUuid || null;
            
            loadProjects();
            
            // If projectUuid is provided, set it as selected and load services/accounts for that project
            if (projectUuid) {
                $timeout(function() {
                    loadProjects().then(function() {
                        var project = vm.projects.find(function(p) {
                            return p.uuid === projectUuid;
                        });
                        if (project) {
                            vm.selectedProject = project;
                            loadServices(projectUuid);
                            loadAccounts(projectUuid);
                        } else {
                            loadServices();
                        }
                    });
                }, 500);
            } else {
                loadServices();
            }
        }

        // Load all projects
        function loadProjects() {
            return new Promise(function(resolve, reject) {
                vm.loading = true;
                services.getProjects(function(response) {
                    vm.loading = false;
                    if (response.success) {
                        vm.projects = response.data || [];
                        resolve(vm.projects);
                    } else {
                        utils.alertError('Error', response.message || 'Failed to load projects');
                        reject(response);
                    }
                });
            });
        }

        // Load accounts (can be called when project changes)
        function loadAccounts(projectUuid) {
            if (!projectUuid) {
                vm.accounts = [];
                vm.loading = false;
                return;
            }
            
            var url = '/dashboard/api/accounts/project/' + projectUuid;
            
            vm.loading = true;
            $http.get(url).then(function(response) {
                vm.loading = false;
                if (response.data.success) {
                    vm.accounts = response.data.data || [];
                } else {
                    utils.alertError('Error', response.data.message || 'Failed to load accounts');
                }
            }).catch(function(error) {
                vm.loading = false;
                utils.alertError('Error', 'Failed to load accounts');
            });
        }

        // Load services to determine which are configured (optionally filtered by project)
        function loadServices(projectUuid) {
            var url = '/dashboard/api/services';
            if (projectUuid) {
                url += '?projectUuid=' + projectUuid;
            } else if (vm.selectedProject && vm.selectedProject.uuid) {
                url += '?projectUuid=' + vm.selectedProject.uuid;
            }
            
            $http.get(url).then(function(response) {
                if (response.data.success) {
                    var allServices = response.data.data || [];
                    
                    // Filter to only configured services
                    vm.configuredServices = allServices.filter(function(service) {
                        return service.configured && service.active && 
                               ['twitter', 'facebook', 'instagram', 'linkedin', 'mastodon', 'tiktok'].includes(service.name);
                    });
                }
            }).catch(function(error) {
                vm.configuredServices = [];
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
            
            // Navigate to project-specific accounts page
            onProjectChange();
        }

        // Handle project selection change - navigate to project-specific accounts page
        function onProjectChange() {
            if (vm.selectedProject && vm.selectedProject.uuid) {
                // Load accounts and services for the selected project
                loadAccounts(vm.selectedProject.uuid);
                loadServices(vm.selectedProject.uuid);
            } else {
                // If no project selected, clear accounts and services
                vm.accounts = [];
                vm.configuredServices = [];
            }
        }

        // Check if there are unconfigured services
        function hasUnconfiguredServices() {
            return Object.keys(vm.isConfiguredService).some(function(key) {
                return !['tenor', 'unsplash'].includes(key) && !vm.isConfiguredService[key];
            });
        }

        // Refresh account
        function refreshAccount(uuid) {
            utils.confirmAlert('Confirm', 'Refresh this account?', function() {
                $http.put('/dashboard/api/accounts/' + uuid).then(function(response) {
                    if (response.data.success) {
                        utils.alertSuccess('Success', 'Account refreshed successfully');
                        loadAccounts(vm.selectedProjectUuid);
                    } else {
                        utils.alertError('Error', response.data.message || 'Failed to refresh account');
                    }
                }).catch(function(error) {
                    utils.alertError('Error', 'Failed to refresh account');
                });
            });
        }

        // Delete account
        function deleteAccount(uuid) {
            utils.confirmAlert('Confirm', 'Are you sure you want to delete this account?', function() {
                $http.delete('/dashboard/api/accounts/' + uuid).then(function(response) {
                    if (response.data.success) {
                        utils.alertSuccess('Success', 'Account deleted successfully');
                        loadAccounts(vm.selectedProjectUuid);
                    } else {
                        utils.alertError('Error', response.data.message || 'Failed to delete account');
                    }
                }).catch(function(error) {
                    utils.alertError('Error', 'Failed to delete account');
                });
            });
        }

        // Open add account modal
        function openAddAccountModal() {
            var modalElement = document.getElementById('addAccountModal');
            if (modalElement) {
                // Get or create modal instance
                var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                
                // Add event listener to ensure backdrop is removed when modal is hidden
                modalElement.addEventListener('hidden.bs.modal', function() {
                    // Remove any lingering backdrop
                    var backdrops = document.querySelectorAll('.modal-backdrop');
                    backdrops.forEach(function(backdrop) {
                        backdrop.remove();
                    });
                    // Remove modal-open class from body
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, { once: true });
                
                modal.show();
            }
        }

        // Close add account modal
        function closeAddAccountModal() {
            var modalElement = document.getElementById('addAccountModal');
            if (modalElement) {
                var modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
        }

        // Connect account for selected provider
        function connectAccount(provider) {
            var url = '/dashboard/accounts/connect?provider=' + provider;
            if (vm.selectedProject && vm.selectedProject.uuid) {
                url += '&project=' + vm.selectedProject.uuid;
            } else if (vm.selectedProjectUuid) {
                url += '&project=' + vm.selectedProjectUuid;
            }
            
            // Close modal first and clean up backdrop
            var modalElement = document.getElementById('addAccountModal');
            if (modalElement) {
                var modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
                
                // Ensure backdrop is removed
                $timeout(function() {
                    var backdrops = document.querySelectorAll('.modal-backdrop');
                    backdrops.forEach(function(backdrop) {
                        backdrop.remove();
                    });
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, 300);
            }
            
            window.location.href = url;
        }

        // Get service icon class
        function getServiceIcon(serviceName) {
            var icons = {
                'twitter': 'bi-twitter text-primary',
                'facebook': 'bi-facebook text-primary',
                'instagram': 'bi-instagram text-danger',
                'linkedin': 'bi-linkedin text-primary',
                'mastodon': 'bi-mastodon text-primary',
                'tiktok': 'bi-tiktok'
            };
            return icons[serviceName] || 'bi-share';
        }

        // Get service display name
        function getServiceName(serviceName) {
            var names = {
                'twitter': 'Twitter / X',
                'facebook': 'Facebook',
                'instagram': 'Instagram',
                'linkedin': 'LinkedIn',
                'mastodon': 'Mastodon',
                'tiktok': 'TikTok'
            };
            return names[serviceName] || serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
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

