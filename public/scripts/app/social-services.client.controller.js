(function () {
    'use strict';
    angular
        .module('app')
        .controller('SocialServicesController', SocialServicesController);

    SocialServicesController.$inject = ['$scope', '$routeParams', 'brudexservices', 'brudexutils', '$location', '$timeout'];

    function SocialServicesController($scope, services, utils, $location, $timeout) {
        var vm = this;

        // Properties
        vm.projects = [];
        vm.services = [];
        vm.selectedProject = null;
        vm.loading = false;
        vm.groupedServices = {};
        vm.projectUuid = $routeParams.projectUuid || null;
        vm.availableServices = [
            { name: 'twitter', displayName: 'Twitter / X' },
            { name: 'facebook', displayName: 'Facebook / Meta' },
            { name: 'instagram', displayName: 'Instagram' },
            { name: 'linkedin', displayName: 'LinkedIn' },
            { name: 'mastodon', displayName: 'Mastodon' },
            { name: 'unsplash', displayName: 'Unsplash' },
            { name: 'tenor', displayName: 'Tenor' }
        ];

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.loadServices = loadServices;
        vm.onProjectChange = onProjectChange;
        vm.configureService = configureService;
        vm.getServiceStatus = getServiceStatus;
        vm.capitalize = capitalize;

        // Initialize
        function init() {
            loadProjects();
            loadServices();
        }

        // Load all projects
        function loadProjects() {
            vm.loading = true;
            services.getProjects(function(response) {
                vm.loading = false;
                if (response.success) {
                    vm.projects = response.data || [];
                    
                    // If projectUuid is in route, set it as selected
                    if (vm.projectUuid) {
                        var project = vm.projects.find(function(p) {
                            return p.uuid === vm.projectUuid;
                        });
                        if (project) {
                            vm.selectedProject = project;
                        }
                    }
                } else {
                    utils.alertError('Error', response.message || 'Failed to load projects');
                }
            });
        }

        // Load services
        function loadServices() {
            vm.loading = true;
            services.getServices(function(response) {
                vm.loading = false;
                if (response.success) {
                    var allServices = response.data || [];
                    
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
            });
        }

        // Handle project filter change
        function onProjectChange() {
            // Services are already loaded, just filter in the view
            // This function can be used for additional logic if needed
        }

        // Navigate to configure service
        function configureService(serviceName, projectUuid) {
            var url = '/dashboard/services/configure/' + serviceName;
            if (projectUuid) {
                url += '?project=' + projectUuid;
            } else if (vm.selectedProject) {
                url += '?project=' + vm.selectedProject.uuid;
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
    }
})();

