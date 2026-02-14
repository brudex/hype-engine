(function () {
    'use strict';
    angular
        .module('app')
        .controller('OauthConnectController', OauthConnectController);

    OauthConnectController.$inject = ['$scope', '$http', 'brudexutils'];

    function OauthConnectController($scope, $http, utils) {
        var vm = this;

        vm.services = [];
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

        vm.init = init;
        vm.loadServices = loadServices;
        vm.configureService = configureService;
        vm.getServiceStatus = getServiceStatus;
        vm.capitalize = capitalize;

        function init() {
            loadServices();
        }

        function loadServices() {
            vm.loading = true;
            $http.get('/dashboard/api/oauth-connect').then(function (response) {
                vm.loading = false;
                if (response.data.success) {
                    var allServices = response.data.data || [];
                    vm.services = vm.availableServices.map(function (availableService) {
                        var configuredService = allServices.find(function (s) {
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
                    vm.services = vm.availableServices.map(function (s) {
                        return {
                            name: s.name,
                            displayName: s.displayName,
                            configured: false,
                            active: false
                        };
                    });
                }
            }).catch(function () {
                vm.loading = false;
                vm.services = vm.availableServices.map(function (s) {
                    return {
                        name: s.name,
                        displayName: s.displayName,
                        configured: false,
                        active: false
                    };
                });
            });
        }

        function configureService(serviceName) {
            window.location.href = '/dashboard/oauth-connect/configure/' + serviceName;
        }

        function getServiceStatus(service) {
            return service.configured ? 'bg-success' : 'bg-secondary';
        }

        function capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
})();
