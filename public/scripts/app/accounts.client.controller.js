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
        vm.selectedProjectUuid = null;
        vm.serviceDefinitions = {};
        vm.savingApiKey = {};

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.loadAccounts = loadAccounts;
        vm.onProjectChange = onProjectChange;
        vm.selectProject = selectProject;
        vm.getProjectInitials = getProjectInitials;
        vm.refreshAccount = refreshAccount;
        vm.deleteAccount = deleteAccount;
        vm.setActiveAccount = setActiveAccount;
        vm.connectAccount = connectAccount;
        vm.getPlatformAccounts = getPlatformAccounts;
        vm.hasAuthorizedAccount = hasAuthorizedAccount;
        vm.getFormFields = getFormFields;
        vm.saveApiKeyConfig = saveApiKeyConfig;

        // Initialize
        function init(accounts, isConfiguredService, isServiceActive, projectUuid) {
            vm.accounts = accounts || [];
            vm.isConfiguredService = isConfiguredService || {};
            vm.isServiceActive = isServiceActive || {};
            vm.selectedProjectUuid = projectUuid || null;
            var el = document.getElementById('accounts-service-definitions');
            vm.serviceDefinitions = el ? (function () { try { return JSON.parse(el.textContent); } catch (e) { return {}; } })() : {};
            
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
                            loadAccounts(projectUuid);
                        }
                    });
                }, 500);
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

        // Handle project selection change
        function onProjectChange() {
            if (vm.selectedProject && vm.selectedProject.uuid) {
                loadAccounts(vm.selectedProject.uuid);
            } else {
                vm.accounts = [];
            }
        }

        // Refresh account
        function refreshAccount(uuid) {
            utils.confirmAlert('Confirm', 'Refresh this account?', function() {
                $http.put('/dashboard/api/accounts/' + uuid).then(function(response) {
                    if (response.data.success) {
                        utils.alertSuccess('Success', 'Account refreshed successfully');
                        var pu = (vm.selectedProject && vm.selectedProject.uuid) || vm.selectedProjectUuid;
                        if (pu) loadAccounts(pu);
                    } else {
                        utils.alertError('Error', response.data.message || 'Failed to refresh account');
                    }
                }).catch(function(error) {
                    utils.alertError('Error', 'Failed to refresh account');
                });
            });
        }

        // Delete account (with SweetAlert confirm)
        function deleteAccount(uuid) {
            utils.alertConfirm('Confirm', 'Are you sure you want to delete this account?', function(result) {
                if (result.isConfirmed) {
                    $http.delete('/dashboard/api/accounts/' + uuid).then(function(response) {
                        if (response.data.success) {
                            utils.alertSuccess('Success', 'Account deleted successfully');
                            var pu = (vm.selectedProject && vm.selectedProject.uuid) || vm.selectedProjectUuid;
                            if (pu) loadAccounts(pu);
                        } else {
                            utils.alertError('Error', response.data.message || 'Failed to delete account');
                        }
                    }).catch(function(error) {
                        utils.alertError('Error', (error.data && error.data.message) || 'Failed to delete account');
                    });
                }
            });
        }

        // Activate or deactivate account (PUT active true/false)
        function setActiveAccount(uuid, active) {
            $http.put('/dashboard/api/accounts/' + uuid, { active: !!active }).then(function(response) {
                if (response.data && response.data.success) {
                    utils.alertSuccess('Success', response.data.message || (active ? 'Account activated' : 'Account deactivated'));
                    var pu = (vm.selectedProject && vm.selectedProject.uuid) || vm.selectedProjectUuid;
                    if (pu) loadAccounts(pu);
                } else {
                    utils.alertError('Error', (response.data && response.data.message) || 'Failed to update account');
                }
            }).catch(function(error) {
                utils.alertError('Error', (error.data && error.data.message) || 'Failed to update account');
            });
        }

        // Connect account: open integration connect route in new tab
        function connectAccount(provider) {
            var projectUuid = (vm.selectedProject && vm.selectedProject.uuid) || vm.selectedProjectUuid;
            if (!projectUuid) {
                utils.alertError('Error', 'Please select a project first');
                return;
            }
            var platform = (provider || '').toLowerCase();
            window.open('/dashboard/integrations/' + platform + '/connect/' + projectUuid, '_blank', 'noopener,noreferrer');
        }

        // Get accounts for a specific platform (for selected project)
        function getPlatformAccounts(platform) {
            if (!vm.accounts || !vm.accounts.length) return [];
            return vm.accounts.filter(function(account) {
                return account.provider && account.provider.toLowerCase() === (platform || '').toLowerCase();
            });
        }

        // True if this platform has at least one authorized account
        function hasAuthorizedAccount(platform) {
            var accounts = getPlatformAccounts(platform);
            return accounts.some(function(a) { return a.authorized; });
        }

        // Form fields for API key tab (from serviceDefinitions)
        function getFormFields(platform) {
            var def = vm.serviceDefinitions[platform];
            return (def && def.formFields && Array.isArray(def.formFields)) ? def.formFields : [];
        }

        // Build configuration object from form elements named configuration[fieldName]
        function getConfigurationFromForm(form) {
            var config = {};
            if (!form || !form.elements) return config;
            for (var i = 0; i < form.elements.length; i++) {
                var el = form.elements[i];
                var name = el.name;
                if (name && name.indexOf('configuration[') === 0) {
                    var key = name.slice(14, -1);
                    if (key && el.type !== 'checkbox') {
                        config[key] = el.value;
                    } else if (key && el.type === 'checkbox' && el.checked) {
                        config[key] = el.value;
                    }
                }
            }
            return config;
        }

        // Save API key configuration via API
        function saveApiKeyConfig(platform, event) {
            if (event) event.preventDefault();
            var projectUuid = (vm.selectedProject && vm.selectedProject.uuid) || vm.selectedProjectUuid;
            if (!projectUuid) {
                utils.alertError('Error', 'Please select a project first');
                return;
            }
            var form = event && event.target ? event.target : null;
            if (!form) {
                utils.alertError('Error', 'Form not found');
                return;
            }
            var configuration = getConfigurationFromForm(form);
            var url = '/dashboard/api/accounts/configure-apikey/' + (platform || '').toLowerCase();
            vm.savingApiKey[platform] = true;
            $http.post(url, {
                projectUuid: projectUuid,
                configuration: configuration
            }).then(function(response) {
                vm.savingApiKey[platform] = false;
                if (response.data && response.data.success) {
                    utils.alertSuccess('Saved', response.data.message || 'API key configuration saved');
                    loadAccounts(projectUuid);
                } else {
                    utils.alertError('Error', (response.data && response.data.message) || 'Save failed');
                }
            }).catch(function(err) {
                vm.savingApiKey[platform] = false;
                var msg = (err.data && err.data.message) || err.statusText || 'Failed to save';
                var errors = err.data && err.data.errors;
                if (errors && typeof errors === 'object') {
                    msg = msg + ': ' + Object.keys(errors).map(function(k) { return errors[k]; }).join(', ');
                }
                utils.alertError('Error', msg);
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

