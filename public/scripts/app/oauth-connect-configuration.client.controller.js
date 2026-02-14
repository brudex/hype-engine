(function () {
    'use strict';
    angular
        .module('app')
        .controller('OauthConnectConfigurationController', OauthConnectConfigurationController);

    OauthConnectConfigurationController.$inject = ['$scope', '$http', 'brudexutils', '$timeout'];

    function OauthConnectConfigurationController($scope, $http, utils, $timeout) {
        var vm = this;

        vm.serviceName = '';
        vm.loading = false;
        vm.saving = false;
        vm.testing = false;
        vm.configuration = {};
        vm.testResult = null;

        vm.init = init;
        vm.loadServiceConfiguration = loadServiceConfiguration;
        vm.saveConfiguration = saveConfiguration;
        vm.testCredentials = testCredentials;
        vm.getCancelUrl = getCancelUrl;

        function init(serviceName) {
            vm.serviceName = serviceName || '';
            if (vm.serviceName) {
                loadServiceConfiguration();
            }
        }

        function loadServiceConfiguration() {
            vm.loading = true;
            var apiUrl = '/dashboard/api/oauth-connect/' + vm.serviceName;

            $http.get(apiUrl).then(function (response) {
                vm.loading = false;
                if (response.data.success && response.data.data) {
                    var serviceData = response.data.data;
                    if (serviceData.configuration) {
                        try {
                            vm.configuration = typeof serviceData.configuration === 'string'
                                ? JSON.parse(serviceData.configuration)
                                : serviceData.configuration;
                        } catch (e) {
                            vm.configuration = {};
                        }
                    }
                    $timeout(function () {
                        Object.keys(vm.configuration).forEach(function (key) {
                            var input = document.querySelector('[name="configuration[' + key + ']"]');
                            if (input) {
                                input.value = vm.configuration[key];
                            }
                        });
                        if (serviceData.active) {
                            var activeCheckbox = document.getElementById('active');
                            if (activeCheckbox) {
                                activeCheckbox.checked = true;
                            }
                        }
                    }, 100);
                }
            }).catch(function (error) {
                vm.loading = false;
                console.error('Error loading OAuth service:', error);
            });
        }

        function saveConfiguration() {
            var form = document.getElementById('serviceForm');
            if (!form) {
                utils.alertError('Error', 'Form not found');
                return;
            }

            vm.saving = true;
            var configuration = {};
            var formInputs = form.querySelectorAll('input[name^="configuration["], textarea[name^="configuration["], select[name^="configuration["]');

            for (var i = 0; i < formInputs.length; i++) {
                var input = formInputs[i];
                var name = input.name;
                if (name.startsWith('configuration[') && name.endsWith(']')) {
                    var fieldName = name.substring('configuration['.length, name.length - 1);
                    var value = input.value;
                    if (input.type === 'checkbox') {
                        value = input.checked ? input.value || 'true' : 'false';
                    }
                    if (input.type === 'radio') {
                        if (input.checked) {
                            configuration[fieldName] = value;
                        }
                    } else {
                        configuration[fieldName] = value;
                    }
                }
            }

            var payload = { configuration: configuration };
            var allInputs = form.querySelectorAll('input, textarea, select');
            for (var j = 0; j < allInputs.length; j++) {
                var field = allInputs[j];
                var fieldName = field.name;
                if (!fieldName || !fieldName.startsWith('configuration[')) {
                    if (field.type === 'checkbox') {
                        payload[fieldName] = field.checked ? (field.value || 'true') : 'false';
                    } else if (field.type === 'radio') {
                        if (field.checked) {
                            payload[fieldName] = field.value;
                        }
                    } else {
                        payload[fieldName] = field.value;
                    }
                }
            }

            var url = form.action;
            fetch(url, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(function (data) {
                    $timeout(function () {
                        vm.saving = false;
                    }, 0);
                    if (data.success) {
                        utils.alertConfirm(
                            'Configuration Saved',
                            'OAuth service configuration has been saved successfully.',
                            function (result) {
                                if (result.isDismissed) {
                                    window.location.reload();
                                } else if (result.isConfirmed) {
                                    window.location.href = '/dashboard/oauth-connect';
                                }
                            },
                            {
                                confirmButtonText: 'Configure Other Services',
                                cancelButtonText: 'OK',
                                icon: 'success'
                            }
                        );
                    } else {
                        utils.alertError('Error', data.message || 'Failed to save configuration');
                    }
                })
                .catch(function (error) {
                    $timeout(function () {
                        vm.saving = false;
                    }, 0);
                    console.error('Error saving configuration:', error);
                    utils.alertError('Error', 'Failed to save configuration. Please try again.');
                });
        }

        function testCredentials() {
            var form = document.getElementById('serviceForm');
            if (!form) {
                utils.alertError('Error', 'Form not found');
                return;
            }

            vm.testing = true;
            vm.testResult = null;
            var configuration = {};
            var formInputs = form.querySelectorAll('input[name^="configuration["], textarea[name^="configuration["], select[name^="configuration["]');

            for (var i = 0; i < formInputs.length; i++) {
                var input = formInputs[i];
                var name = input.name;
                if (name.startsWith('configuration[') && name.endsWith(']')) {
                    var fieldName = name.substring('configuration['.length, name.length - 1);
                    var value = input.value;
                    if (input.type === 'checkbox') {
                        value = input.checked ? input.value || 'true' : 'false';
                    }
                    if (input.type === 'radio') {
                        if (input.checked) {
                            configuration[fieldName] = value;
                        }
                    } else {
                        configuration[fieldName] = value;
                    }
                }
            }

            var modalElement = document.getElementById('testCredentialsModal');
            if (modalElement) {
                var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.show();
            }

            var url = '/dashboard/api/oauth-connect/' + vm.serviceName + '/test';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ configuration: configuration })
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    $timeout(function () {
                        vm.testing = false;
                        vm.testResult = data;
                    }, 0);
                })
                .catch(function (error) {
                    $timeout(function () {
                        vm.testing = false;
                        vm.testResult = {
                            success: false,
                            message: 'Failed to test credentials',
                            error: error.message || 'Network error'
                        };
                    }, 0);
                    console.error('Error testing credentials:', error);
                });
        }

        function getCancelUrl() {
            return '/dashboard/oauth-connect';
        }
    }
})();
