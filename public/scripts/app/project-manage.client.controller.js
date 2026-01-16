(function () {
    'use strict';
    angular
        .module('app')
        .controller('ProjectManageController', ProjectManageController);

    ProjectManageController.$inject = ['brudexservices', 'brudexutils', '$location'];

    function ProjectManageController(services, utils, $location) {
        var vm = this;

        // Properties
        vm.project = null;
        vm.loading = false;
        vm.projectUuid = null;
        vm.activeTab = 'accounts'; // Default to connect accounts tab
        vm.activePlatform = 'facebook'; // Default platform
        vm.services = [];
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
        vm.capitalize = capitalize;
        vm.getProjectInitials = getProjectInitials;

        // Initialize
        function init(projectUuid) {
            vm.projectUuid = projectUuid;
            loadProject();
            loadServices();
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
            // Navigate to account connection page with project context
            window.location.href = '/dashboard/accounts/connect?provider=' + platform + '&project=' + vm.projectUuid;
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

