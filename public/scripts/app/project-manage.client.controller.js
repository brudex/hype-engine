(function () {
    'use strict';
    angular
        .module('app')
        .controller('ProjectManageController', ProjectManageController);

    ProjectManageController.$inject = ['brudexservices', 'brudexutils', '$location', '$http'];

    function ProjectManageController(services, utils, $location, $http) {
        var vm = this;

        // Properties
        vm.project = null;
        vm.loading = false;
        vm.projectUuid = null;
        vm.activePlatform = 'facebook';
        vm.services = [];
        vm.serviceDefinitions = {};
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
        vm.loadProject = loadProject;
        vm.loadServices = loadServices;
        vm.configureServices = configureServices;
        vm.getPlatformAccounts = getPlatformAccounts;
        vm.connectAccount = connectAccount;
        vm.getFormFields = getFormFields;
        vm.saveApiKeyConfig = saveApiKeyConfig;
        vm.capitalize = capitalize;
        vm.getProjectInitials = getProjectInitials;

        // Initialize (serviceDefinitions are read from #project-service-definitions script tag)
        function init(projectUuid) {
            vm.projectUuid = projectUuid;
            var el = document.getElementById('project-service-definitions');
            vm.serviceDefinitions = el ? (function () { try { return JSON.parse(el.textContent); } catch (e) { return {}; } })() : {};
            loadProject();
            loadServices();
        }

        // Form fields for API key tab (from socialaccount-api-definitions)
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
                    var key = name.slice(14, -1); // 'configuration['.length = 14, then remove ']'
                    if (key && el.type !== 'checkbox') {
                        config[key] = el.value;
                    } else if (key && el.type === 'checkbox' && el.checked) {
                        config[key] = el.value;
                    }
                }
            }
            return config;
        }

        // Save API key configuration via API (each Connect with API keys tab)
        function saveApiKeyConfig(platform, event) {
            if (event) event.preventDefault();
            if (!vm.projectUuid) {
                utils.alertError('Error', 'Project not found');
                return;
            }
            var form = event && event.target ? event.target : null;
            if (!form) {
                utils.alertError('Error', 'Form not found');
                return;
            }
            var configuration = getConfigurationFromForm(form);
            var url = '/dashboard/api/accounts/configure-apikey/' + (platform || '').toLowerCase();
            vm.savingApiKey = vm.savingApiKey || {};
            vm.savingApiKey[platform] = true;
            $http.post(url, {
                projectUuid: vm.projectUuid,
                configuration: configuration
            }).then(function(response) {
                vm.savingApiKey[platform] = false;
                if (response.data && response.data.success) {
                    utils.alertSuccess('Saved', response.data.message || 'API key configuration saved');
                    loadProject();
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

        // Load project
        function loadProject() {
            vm.loading = true;
            services.getProject(vm.projectUuid, function(response) {
                vm.loading = false;
                if (response.success) {
                    vm.project = response.data;
                } else {
                    utils.alertError('Error', response.message || 'Failed to load project');
                    $location.path('/dashboard/projects');
                }
            });
        }

        // Load services
        function loadServices() {
            services.getServices(function(response) {
                if (response.success) {
                    vm.services = response.data || [];
                    
                    // Map available services with their configuration status
                    vm.services = vm.availableServices.map(function(availableService) {
                        var configuredService = vm.services.find(function(s) {
                            return s.name === availableService.name;
                        });
                        return {
                            name: availableService.name,
                            displayName: availableService.displayName,
                            configured: configuredService ? configuredService.configured : false,
                            active: configuredService ? configuredService.active : false
                        };
                    });
                } else {
                    // If API fails, use default services list
                    vm.services = vm.availableServices.map(function(s) {
                        return {
                            name: s.name,
                            displayName: s.displayName,
                            configured: false,
                            active: false
                        };
                    });
                }
            });
        }

        // Navigate to configure service for this project
        function configureServices(serviceName) {
            if (serviceName) {
                window.location.href = '/dashboard/services/configure/' + serviceName + '?project=' + vm.projectUuid;
            } else {
                if (vm.projectUuid) {
                    $location.path('/dashboard/services/project/' + vm.projectUuid);
                }
            }
        }

        // Get accounts for a specific platform
        function getPlatformAccounts(platform) {
            if (!vm.project || !vm.project.accounts) {
                return [];
            }
            return vm.project.accounts.filter(function(account) {
                return account.provider && account.provider.toLowerCase() === platform.toLowerCase();
            });
        }

        // Connect account for a platform
        function connectAccount(platform) {
            if (!vm.projectUuid) {
                utils.alertError('Error', 'Project not found');
                return;
            }
            var p = (platform || '').toLowerCase();
            window.location.href = '/integrations/' + p + '/connect/' + vm.projectUuid;
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

