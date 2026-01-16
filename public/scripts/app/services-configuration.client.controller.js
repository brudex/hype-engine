(function () {
    'use strict';
    angular
        .module('app')
        .controller('ServicesConfigurationController', ServicesConfigurationController);

    ServicesConfigurationController.$inject = ['$scope', '$http', 'brudexutils', '$timeout'];

    function ServicesConfigurationController($scope, $http, utils, $timeout) {
        var vm = this;

        // Properties
        vm.serviceName = '';
        vm.projectUuid = '';
        vm.loading = false;
        vm.saving = false;
        vm.testing = false;
        vm.configuration = {};
        vm.testResult = null;

        // Methods
        vm.init = init;
        vm.loadServiceConfiguration = loadServiceConfiguration;
        vm.saveConfiguration = saveConfiguration;
        vm.testCredentials = testCredentials;
        vm.getCancelUrl = getCancelUrl;

        // Initialize
        function init(serviceName, projectUuid) {
            vm.serviceName = serviceName || '';
            vm.projectUuid = projectUuid || '';
            
            // Load existing configuration
            if (vm.serviceName) {
                loadServiceConfiguration();
            }
        }

        // Load existing service configuration
        function loadServiceConfiguration() {
            vm.loading = true;
            var apiUrl = '/dashboard/api/services/' + vm.serviceName;
            if (vm.projectUuid) {
                apiUrl += '?projectUuid=' + vm.projectUuid;
            }
            
            $http.get(apiUrl).then(function(response) {
                vm.loading = false;
                if (response.data.success && response.data.data) {
                    var serviceData = response.data.data;
                    
                    // Parse configuration
                    if (serviceData.configuration) {
                        try {
                            vm.configuration = typeof serviceData.configuration === 'string' 
                                ? JSON.parse(serviceData.configuration) 
                                : serviceData.configuration;
                        } catch (e) {
                            vm.configuration = {};
                        }
                    }
                    
                    // Populate form fields
                    $timeout(function() {
                        Object.keys(vm.configuration).forEach(function(key) {
                            var input = document.querySelector('[name="configuration[' + key + ']"]');
                            if (input) {
                                input.value = vm.configuration[key];
                            }
                        });

                        // Set active status
                        if (serviceData.active) {
                            var activeCheckbox = document.getElementById('active');
                            if (activeCheckbox) {
                                activeCheckbox.checked = true;
                            }
                        }
                    }, 100);
                }
            }).catch(function(error) {
                vm.loading = false;
                console.error('Error loading service:', error);
            });
        }

        // Save service configuration
        function saveConfiguration() {
            var form = document.getElementById('serviceForm');
            if (!form) {
                utils.alertError('Error', 'Form not found');
                return;
            }
            
            vm.saving = true;
            
            // Extract configuration fields from form inputs and compose configuration object
            var configuration = {};
            var formInputs = form.querySelectorAll('input[name^="configuration["], textarea[name^="configuration["], select[name^="configuration["]');
            
            // Build configuration object from form inputs
            for (var i = 0; i < formInputs.length; i++) {
                var input = formInputs[i];
                var name = input.name;
                
                // Extract the field name from "configuration[field_name]"
                if (name.startsWith('configuration[') && name.endsWith(']')) {
                    var fieldName = name.substring('configuration['.length, name.length - 1);
                    var value = input.value;
                    
                    // Handle checkbox inputs
                    if (input.type === 'checkbox') {
                        value = input.checked ? input.value || 'true' : 'false';
                    }
                    
                    // Handle radio inputs
                    if (input.type === 'radio') {
                        if (input.checked) {
                            configuration[fieldName] = value;
                        }
                    } else {
                        configuration[fieldName] = value;
                    }
                }
            }
            
            // Build request payload object
            var payload = {
                configuration: configuration
            };
            
            // Add all other form fields except configuration[...] fields
            var allInputs = form.querySelectorAll('input, textarea, select');
            for (var j = 0; j < allInputs.length; j++) {
                var field = allInputs[j];
                var fieldName = field.name;
                
                // Skip configuration[...] fields as we've already added them to configuration object
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
            
            // Send as JSON instead of FormData
            fetch(url, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(data) {
                $timeout(function() {
                    vm.saving = false;
                }, 0);
                
                if (data.success) {
                    // Show alert with two buttons
                    var savedProjectUuid = data.data && data.data.projectUuid 
                        ? data.data.projectUuid 
                        : vm.projectUuid;
                    var servicesUrl = savedProjectUuid 
                        ? '/dashboard/services/project/' + savedProjectUuid 
                        : '/dashboard/services';
                    
                    utils.alertConfirm(
                        'Configuration Saved',
                        'Service configuration has been saved successfully.',
                        function(result) {
                            if (result.isDismissed) {
                                // User clicked "OK" (cancel button) - stay on current page (reload to show updated data)
                                window.location.reload();
                            } else if (result.isConfirmed) {
                                // User clicked "Configure Other Services" (confirm button)
                                window.location.href = servicesUrl;
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
            .catch(function(error) {
                $timeout(function() {
                    vm.saving = false;
                }, 0);
                console.error('Error saving configuration:', error);
                utils.alertError('Error', 'Failed to save configuration. Please try again.');
            });
        }

        // Test service credentials
        function testCredentials() {
            var form = document.getElementById('serviceForm');
            if (!form) {
                utils.alertError('Error', 'Form not found');
                return;
            }
            
            vm.testing = true;
            vm.testResult = null;
            
            // Extract configuration fields from form inputs
            var configuration = {};
            var formInputs = form.querySelectorAll('input[name^="configuration["], textarea[name^="configuration["], select[name^="configuration["]');
            
            // Build configuration object from form inputs
            for (var i = 0; i < formInputs.length; i++) {
                var input = formInputs[i];
                var name = input.name;
                
                // Extract the field name from "configuration[field_name]"
                if (name.startsWith('configuration[') && name.endsWith(']')) {
                    var fieldName = name.substring('configuration['.length, name.length - 1);
                    var value = input.value;
                    
                    // Handle checkbox inputs
                    if (input.type === 'checkbox') {
                        value = input.checked ? input.value || 'true' : 'false';
                    }
                    
                    // Handle radio inputs
                    if (input.type === 'radio') {
                        if (input.checked) {
                            configuration[fieldName] = value;
                        }
                    } else {
                        configuration[fieldName] = value;
                    }
                }
            }
            
            // Show modal first
            var modalElement = document.getElementById('testCredentialsModal');
            if (modalElement) {
                var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.show();
            }
            
            // Build request payload
            var payload = {
                configuration: configuration
            };
            
            if (vm.projectUuid) {
                payload.projectUuid = vm.projectUuid;
            }
            
            var url = '/dashboard/api/services/' + vm.serviceName + '/test';
            
            // Send test request
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                $timeout(function() {
                    vm.testing = false;
                    vm.testResult = data;
                }, 0);
            })
            .catch(function(error) {
                $timeout(function() {
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

        // Get cancel URL based on project
        function getCancelUrl() {
            if (vm.projectUuid) {
                return '/dashboard/services/project/' + vm.projectUuid;
            }
            return '/dashboard/services';
        }
    }
})();

