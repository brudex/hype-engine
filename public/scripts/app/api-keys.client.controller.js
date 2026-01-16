(function () {
    'use strict';

    angular
        .module('app')
        .controller('ApiKeysController', ApiKeysController);

    ApiKeysController.$inject = ['$scope', '$http', '$timeout', 'brudexutils'];

    function ApiKeysController($scope, $http, $timeout, brudexutils) {
        var vm = this;

        // State
        vm.loading = true;
        vm.creating = false;
        vm.loadingProjects = false;
        vm.loadingKeyDetails = false;
        vm.apiKeys = [];
        vm.projects = [];
        vm.newKey = {
            name: '',
            description: '',
            scopeType: 'all',
            selectedProjects: []
        };
        vm.createdKey = null;
        vm.viewingKey = null;
        // Store full keys temporarily (only available right after creation)
        vm.fullKeys = {};

        // Methods
        vm.init = init;
        vm.loadApiKeys = loadApiKeys;
        vm.loadProjects = loadProjects;
        vm.openCreateModal = openCreateModal;
        vm.onScopeTypeChange = onScopeTypeChange;
        vm.onProjectsSelected = onProjectsSelected;
        vm.canCreateKey = canCreateKey;
        vm.createApiKey = createApiKey;
        vm.deleteApiKey = deleteApiKey;
        vm.copyToClipboard = copyToClipboard;
        vm.formatDate = formatDate;
        vm.viewKeyDetails = viewKeyDetails;

        // Initialize
        init();

        function init() {
            vm.loading = true;
            loadApiKeys();
        }

        function loadApiKeys() {
            $http.get('/dashboard/api/access-tokens')
                .then(function (response) {
                    if (response.data.success) {
                        vm.apiKeys = response.data.data || [];
                    } else {
                        console.error('Failed to load API keys:', response.data.message);
                        vm.apiKeys = [];
                    }
                    vm.loading = false;
                })
                .catch(function (error) {
                    console.error('Error loading API keys:', error);
                    vm.apiKeys = [];
                    vm.loading = false;
                });
        }

        function loadProjects() {
            vm.loadingProjects = true;
            $http.get('/dashboard/api/projects')
                .then(function (response) {
                    if (response.data.success) {
                        vm.projects = (response.data.data || []).map(function(project) {
                            return {
                                uuid: project.uuid,
                                name: project.name,
                                description: project.description
                            };
                        });
                    } else {
                        vm.projects = [];
                    }
                    vm.loadingProjects = false;
                })
                .catch(function (error) {
                    console.error('Error loading projects:', error);
                    vm.projects = [];
                    vm.loadingProjects = false;
                });
        }

        function openCreateModal() {
            vm.newKey = {
                name: '',
                description: '',
                scopeType: 'all',
                selectedProjects: []
            };
            vm.createdKey = null;
            
            // Load projects for selection
            loadProjects();
            
            // Use Bootstrap modal API
            $timeout(function() {
                var modal = new bootstrap.Modal(document.getElementById('createApiKeyModal'));
                modal.show();
            }, 0);
        }

        function onScopeTypeChange() {
            if (vm.newKey.scopeType === 'all') {
                vm.newKey.selectedProjects = [];
            }
        }

        function onProjectsSelected() {
            // This is called when projects are selected via multi-select directive
            // The selectedProjects array is already updated by ng-model binding
        }

        function canCreateKey() {
            if (!vm.newKey.name || !vm.newKey.name.trim()) {
                return false;
            }
            if (vm.newKey.scopeType === 'selected') {
                return vm.newKey.selectedProjects.length > 0;
            }
            return true;
        }

        function viewKeyDetails(key) {
            // Fetch full API key details from server
            vm.loadingKeyDetails = true;
            
            $http.get('/dashboard/api/access-tokens/' + key.uuid)
                .then(function (response) {
                    if (response.data.success) {
                        vm.viewingKey = response.data.data;
                        
                        // Check if we have the full key stored (from creation)
                        if (vm.fullKeys[key.uuid]) {
                            vm.viewingKey.fullKey = vm.fullKeys[key.uuid];
                        }
                        
                        // Show view modal
                        $timeout(function() {
                            var modal = new bootstrap.Modal(document.getElementById('viewApiKeyModal'));
                            modal.show();
                        }, 0);
                    } else {
                        alert('Failed to load API key details: ' + (response.data.message || 'Unknown error'));
                    }
                    vm.loadingKeyDetails = false;
                })
                .catch(function (error) {
                    console.error('Error loading API key details:', error);
                    alert('Failed to load API key details: ' + (error.data?.message || 'Unknown error'));
                    vm.loadingKeyDetails = false;
                });
        }

        function createApiKey() {
            if (!vm.newKey.name || !vm.newKey.name.trim()) {
                alert('Please enter a name for the API key');
                return;
            }

            if (!canCreateKey()) {
                if (vm.newKey.scopeType === 'selected' && vm.newKey.selectedProjects.length === 0) {
                    alert('Please select at least one project');
                }
                return;
            }

            vm.creating = true;

            // Prepare scopes
            var scopes = {
                allProjects: vm.newKey.scopeType === 'all',
                projects: vm.newKey.scopeType === 'all' ? [] : vm.newKey.selectedProjects
            };

            $http.post('/dashboard/api/access-tokens', {
                name: vm.newKey.name.trim(),
                description: vm.newKey.description ? vm.newKey.description.trim() : null,
                scopes: scopes
            }).then(function (response) {
                if (response.data.success) {
                    var createdKey = response.data.data;
                    
                    // Store the full key temporarily (only available right after creation)
                    if (createdKey.key) {
                        vm.fullKeys[createdKey.uuid] = createdKey.key;
                    }
                    
                    // Close create modal
                    var createModal = bootstrap.Modal.getInstance(document.getElementById('createApiKeyModal'));
                    if (createModal) {
                        createModal.hide();
                    }
                    
                    // Reload keys list
                    loadApiKeys();
                } else {
                    alert('Failed to create API key: ' + (response.data.message || 'Unknown error'));
                }
                vm.creating = false;
            }).catch(function (error) {
                console.error('Error creating API key:', error);
                alert('Failed to create API key: ' + (error.data?.message || 'Unknown error'));
                vm.creating = false;
            });
        }

        function deleteApiKey(key) {
            brudexutils.alertConfirm(
                'Delete API Key',
                'Are you sure you want to delete the API key "' + key.name + '"? This action cannot be undone.',
                function(result) {
                    if (result.isConfirmed) {
                        $http.delete('/dashboard/api/access-tokens/' + key.uuid)
                            .then(function (response) {
                                if (response.data.success) {
                                    // Remove from list
                                    var index = vm.apiKeys.findIndex(function(k) {
                                        return k.uuid === key.uuid;
                                    });
                                    if (index > -1) {
                                        vm.apiKeys.splice(index, 1);
                                    }
                                    // Show success toast
                                    brudexutils.toastSuccess('API key deleted successfully');
                                } else {
                                    brudexutils.alertError('Error', 'Failed to delete API key: ' + (response.data.message || 'Unknown error'));
                                }
                            })
                            .catch(function (error) {
                                console.error('Error deleting API key:', error);
                                brudexutils.alertError('Error', 'Failed to delete API key: ' + (error.data?.message || 'Unknown error'));
                            });
                    }
                },
                {
                    icon: 'warning',
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel'
                }
            );
        }

        function copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    // Show success toast
                    brudexutils.toastSuccess('API key copied to clipboard');
                }).catch(function(err) {
                    console.error('Failed to copy:', err);
                    fallbackCopyToClipboard(text);
                });
            } else {
                fallbackCopyToClipboard(text);
            }
        }

        function fallbackCopyToClipboard(text) {
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                // Show success toast
                brudexutils.toastSuccess('API key copied to clipboard');
            } catch (err) {
                console.error('Fallback copy failed:', err);
                brudexutils.toastError('Failed to copy API key');
            }
            
            document.body.removeChild(textArea);
        }

        function formatDate(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Expose to view
        $scope.vm = vm;
    }
})();

