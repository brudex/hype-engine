(function () {
    'use strict';

    angular
        .module('app')
        .controller('ApiDocController', ApiDocController);

    ApiDocController.$inject = ['$scope', '$http', '$timeout', 'brudexutils', '$window'];

    function ApiDocController($scope, $http, $timeout, brudexutils, $window) {
        var vm = this;
        var apiBaseUrl = '/api/v1';
        var SESSION_STORAGE_KEY = 'apiDocTestAuth';
        var spinner = null;
        var spinnerTarget = null;

        // ============================================
        // State Management
        // ============================================
        vm.activeSection = 'getting-started';
        vm.sections = {
            intro: true,
            auth: true,
            projects: true,
            accounts: true,
            posts: true,
            media: true,
            tags: true
        };

        // Test sidebar state
        vm.testSidebarCollapsed = false;
        vm.currentEndpoint = null;
        vm.apiKeys = [];
        vm.loadingApiKeys = false;
        vm.testAuth = {
            selectedKeyUuid: '',
            apiKey: '',
            showKey: false
        };
        vm.testQueryParams = [{ key: '', value: '' }];
        vm.testPathParams = {};
        vm.testRequestBody = '';
        vm.testFile = null;
        vm.testCustomHeaders = [];
        vm.testing = false;
        vm.testResponse = null;
        vm.testError = null;

        // ============================================
        // Endpoint Definitions
        // ============================================
        vm.endpointMap = createEndpointMap(apiBaseUrl);

        // ============================================
        // Public Methods
        // ============================================
        vm.init = init;
        vm.navigateTo = navigateTo;
        vm.toggleSection = toggleSection;
        vm.toggleTestSidebar = toggleTestSidebar;
        vm.copyToClipboard = copyToClipboard;
        vm.sendTestRequest = sendTestRequest;
        vm.canSendRequest = canSendRequest;
        vm.addQueryParam = addQueryParam;
        vm.removeQueryParam = removeQueryParam;
        vm.addCustomHeader = addCustomHeader;
        vm.removeCustomHeader = removeCustomHeader;
        vm.toggleApiKeyVisibility = toggleApiKeyVisibility;
        vm.copyTestResponse = copyTestResponse;
        vm.handleFileSelect = handleFileSelect;
        vm.fetchApiKeys = fetchApiKeys;
        vm.onApiKeySelected = onApiKeySelected;
        vm.getCurlCommand = getCurlCommand;
        vm.copyCurlCommand = copyCurlCommand;

        // Watch for section changes to update endpoint
        $scope.$watch('vm.activeSection', updateCurrentEndpoint);

        // Initialize
        init();

        // ============================================
        // Initialization
        // ============================================
        function init() {
            vm.activeSection = 'getting-started';
            vm.sections = {
                intro: true,
                auth: true,
                projects: true,
                accounts: true,
                posts: true,
                media: true,
                tags: true
            };

            loadSavedAuth();
            fetchApiKeys();
            updateCurrentEndpoint(vm.activeSection);
        }

        function loadSavedAuth() {
            try {
                var savedAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
                if (savedAuth) {
                    var auth = JSON.parse(savedAuth);
                    vm.testAuth.apiKey = auth.apiKey || '';
                    vm.testAuth.selectedKeyUuid = auth.selectedKeyUuid || '';
                }
            } catch (e) {
                // Ignore parse errors
            }
        }

        function saveAuth() {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
                apiKey: vm.testAuth.apiKey,
                selectedKeyUuid: vm.testAuth.selectedKeyUuid
            }));
        }

        // ============================================
        // Navigation
        // ============================================
        function navigateTo(section) {
            vm.activeSection = section;
            var contentPane = document.querySelector('.api-doc-content');
            if (contentPane) {
                contentPane.scrollTop = 0;
            }
        }

        function toggleSection(sectionName) {
            vm.sections[sectionName] = !vm.sections[sectionName];
        }

        function toggleTestSidebar() {
            vm.testSidebarCollapsed = !vm.testSidebarCollapsed;
        }

        // ============================================
        // Endpoint Management
        // ============================================
        function updateCurrentEndpoint(section) {
            if (!vm.endpointMap[section]) {
                vm.currentEndpoint = null;
                return;
            }

            vm.currentEndpoint = angular.copy(vm.endpointMap[section]);
            resetTestData();

            // Pre-fill example payload for POST/PUT requests
            if (vm.currentEndpoint.hasBody && !vm.currentEndpoint.hasFileUpload) {
                var examplePayload = getExamplePayload(section);
                if (examplePayload) {
                    vm.testRequestBody = JSON.stringify(examplePayload, null, 2);
                }
            }
        }

        function resetTestData() {
            vm.testPathParams = {};
            vm.currentEndpoint.pathParams.forEach(function(param) {
                vm.testPathParams[param] = '';
            });
            vm.testQueryParams = [{ key: '', value: '' }];
            vm.testRequestBody = '';
            vm.testFile = null;
            vm.testCustomHeaders = [];
            vm.testResponse = null;
            vm.testError = null;
        }

        function createEndpointMap(baseUrl) {
            return {
                'list-projects': createEndpoint('GET', 'List Projects', baseUrl + '/projects', []),
                'get-project': createEndpoint('GET', 'Get Project', baseUrl + '/projects/{projectUuid}', ['projectUuid']),
                'list-accounts': createEndpoint('GET', 'List Accounts', baseUrl + '/{projectUuid}/accounts', ['projectUuid']),
                'get-account': createEndpoint('GET', 'Get Account', baseUrl + '/{projectUuid}/accounts/{accountUuid}', ['projectUuid', 'accountUuid']),
                'list-media': createEndpoint('GET', 'List Media', baseUrl + '/media', [], { hasQueryParams: true }),
                'get-media': createEndpoint('GET', 'Get Media', baseUrl + '/media/{mediaUuid}', ['mediaUuid']),
                'upload-media': createEndpoint('POST', 'Upload Media', baseUrl + '/media', [], { hasFileUpload: true }),
                'update-media': createEndpoint('PUT', 'Update Media', baseUrl + '/media/{mediaUuid}', ['mediaUuid'], { hasBody: true }),
                'delete-media': createEndpoint('DELETE', 'Delete Media', baseUrl + '/media/{mediaUuid}', ['mediaUuid']),
                'list-tags': createEndpoint('GET', 'List Tags', baseUrl + '/{projectUuid}/tags', ['projectUuid'], { hasQueryParams: true }),
                'get-tag': createEndpoint('GET', 'Get Tag', baseUrl + '/{projectUuid}/tags/{tagUuid}', ['projectUuid', 'tagUuid']),
                'create-tag': createEndpoint('POST', 'Create Tag', baseUrl + '/{projectUuid}/tags', ['projectUuid'], { hasBody: true }),
                'update-tag': createEndpoint('PUT', 'Update Tag', baseUrl + '/{projectUuid}/tags/{tagUuid}', ['projectUuid', 'tagUuid'], { hasBody: true }),
                'delete-tag': createEndpoint('DELETE', 'Delete Tag', baseUrl + '/{projectUuid}/tags/{tagUuid}', ['projectUuid', 'tagUuid']),
                'list-posts': createEndpoint('GET', 'List Posts', baseUrl + '/{projectUuid}/posts', ['projectUuid'], { hasQueryParams: true }),
                'get-post': createEndpoint('GET', 'Get Post', baseUrl + '/{projectUuid}/posts/{postUuid}', ['projectUuid', 'postUuid']),
                'create-post': createEndpoint('POST', 'Create Post', baseUrl + '/{projectUuid}/posts', ['projectUuid'], { hasBody: true }),
                'update-post': createEndpoint('PUT', 'Update Post', baseUrl + '/{projectUuid}/posts/{postUuid}', ['projectUuid', 'postUuid'], { hasBody: true }),
                'delete-post': createEndpoint('DELETE', 'Delete Post', baseUrl + '/{projectUuid}/posts/{postUuid}', ['projectUuid', 'postUuid']),
                'delete-posts': createEndpoint('DELETE', 'Delete Multiple Posts', baseUrl + '/{projectUuid}/posts', ['projectUuid'], { hasBody: true }),
                'schedule-post': createEndpoint('POST', 'Schedule Post', baseUrl + '/{projectUuid}/posts/{postUuid}/schedule', ['projectUuid', 'postUuid'], { hasBody: true })
            };
        }

        function createEndpoint(method, name, url, pathParams, options) {
            options = options || {};
            return {
                method: method,
                name: name,
                url: url,
                pathParams: pathParams,
                hasQueryParams: options.hasQueryParams || false,
                hasBody: options.hasBody || false,
                hasFileUpload: options.hasFileUpload || false
            };
        }

        function getExamplePayload(section) {
            var examples = {
                'create-post': {
                    versions: [
                        { accountUuid: "", original: true, content: [{ body: "Base content for all accounts", media: ["media-uuid-1"] }] },
                        { accountUuid: "account-uuid-1", original: false, content: [{ body: "Custom content for Twitter", media: ["media-uuid-1", "media-uuid-2"] }] }
                    ],
                    accountUuids: ["account-uuid-1", "account-uuid-2"],
                    tags: ["tag-uuid-1"],
                    date: "2024-12-25",
                    time: "14:30"
                },
                'update-post': {
                    versions: [{ accountUuid: "", original: true, content: [{ body: "Updated base content", media: [] }] }],
                    accountUuids: ["account-uuid-1"],
                    tags: [],
                    date: null,
                    time: null
                },
                'create-tag': { name: "My Tag" , hex_color: "3B82F6" },
                'update-tag': { name: "Updated Tag Name"},
                'update-media': { name: "Updated Media Name" },
                'delete-posts': { uuids: ["post-uuid-1", "post-uuid-2"] },
                'schedule-post': { scheduled_at: "2026-01-13T14:30:00Z" }
            };
            return examples[section] || null;
        }
        // ============================================
        // Request Validation & Building
        // ============================================
        function canSendRequest() {
            if (!vm.currentEndpoint || !vm.testAuth.apiKey) return false;

            // Check required path parameters
            for (var i = 0; i < vm.currentEndpoint.pathParams.length; i++) {
                var param = vm.currentEndpoint.pathParams[i];
                if (!vm.testPathParams[param] || vm.testPathParams[param].trim() === '') {
                    return false;
                }
            }

            // Check required body for POST/PUT
            if (vm.currentEndpoint.hasBody && !vm.currentEndpoint.hasFileUpload) {
                if (!vm.testRequestBody || vm.testRequestBody.trim() === '') {
                    return false;
                }
            }

            // Check file upload
            if (vm.currentEndpoint.hasFileUpload && !vm.testFile) {
                return false;
            }

            return true;
        }

        function sendTestRequest() {
            if (vm.testing || !canSendRequest()) return;

            if (!vm.testAuth.apiKey || vm.testAuth.apiKey.trim() === '') {
                vm.testError = 'Please select an API key';
                brudexutils.toastError('Please select an API key to make requests');
                return;
            }

            saveAuth();
            vm.testing = true;
            vm.testResponse = null;
            vm.testError = null;

            // Start spinner
            startSpinner();

            var startTime = Date.now();
            var url = buildRequestUrl();
            
            // Build headers object - ensure Authorization is always included
            var headers = {};
            
            // Authorization header - MUST be set first
            if (vm.testAuth.apiKey && vm.testAuth.apiKey.trim() !== '') {
                headers['Authorization'] = 'Bearer ' + vm.testAuth.apiKey.trim();
            }
            
            // Build request data
            var data = null;
            var requestConfig = {
                method: vm.currentEndpoint.method,
                url: url,
                headers: headers,
                timeout: 30000
            };

            if (vm.currentEndpoint.hasFileUpload) {
                data = buildFormData();
                // For file uploads, set Content-Type to undefined to let browser set it
                // But keep Authorization header
                requestConfig.headers['Content-Type'] = undefined;
                requestConfig.data = data;
                requestConfig.transformRequest = angular.identity;
            } else {
                // For JSON requests, set Content-Type
                if (vm.currentEndpoint.hasBody && vm.testRequestBody) {
                    try {
                        data = JSON.parse(vm.testRequestBody);
                        requestConfig.headers['Content-Type'] = 'application/json';
                        requestConfig.data = data;
                    } catch (e) {
                        vm.testError = 'Invalid JSON in request body';
                        vm.testing = false;
                        return;
                    }
                }
                
                // Add custom headers
                vm.testCustomHeaders.forEach(function(header) {
                    if (header.key && header.key.trim() !== '') {
                        requestConfig.headers[header.key.trim()] = header.value || '';
                    }
                });
            }

            // Use $http object syntax to ensure headers are properly sent
            $http(requestConfig)
                .then(handleRequestSuccess(startTime))
                .catch(handleRequestError(startTime));
        }

        function buildRequestUrl() {
            var url = vm.currentEndpoint.url;

            // Replace path parameters
            vm.currentEndpoint.pathParams.forEach(function(param) {
                var value = vm.testPathParams[param] || '';
                url = url.replace('{' + param + '}', encodeURIComponent(value));
            });

            // Add query parameters
            var queryParams = vm.testQueryParams
                .filter(function(param) { return param.key && param.key.trim() !== ''; })
                .map(function(param) {
                    return encodeURIComponent(param.key.trim()) + '=' + encodeURIComponent(param.value || '');
                });

            if (queryParams.length > 0) {
                url += '?' + queryParams.join('&');
            }

            return url;
        }

        function buildRequestHeaders() {
            var headers = {};

            // Authorization header - always set if API key exists
            var apiKey = vm.testAuth.apiKey || '';
            if (apiKey && apiKey.trim() !== '') {
                headers['Authorization'] = 'Bearer ' + apiKey.trim();
            }

            // Content-Type for JSON requests
            if (!vm.currentEndpoint.hasFileUpload && vm.currentEndpoint.hasBody) {
                headers['Content-Type'] = 'application/json';
            }

            // Custom headers
            vm.testCustomHeaders.forEach(function(header) {
                if (header.key && header.key.trim() !== '') {
                    var headerKey = header.key.trim();
                    headers[headerKey] = header.value || '';
                }
            });

            return headers;
        }

        function buildFormData() {
            var formData = new FormData();
            if (vm.testFile) {
                formData.append('file', vm.testFile);
            }
            return formData;
        }

        function handleRequestSuccess(startTime) {
            return function(response) {
                vm.testResponse = {
                    status: response.status,
                    time: Date.now() - startTime,
                    body: JSON.stringify(response.data, null, 2)
                };
                vm.testing = false;
                stopSpinner();
                
                // Auto-scroll to response after a short delay
                $timeout(function() {
                    scrollToResponse();
                }, 100);
            };
        }

        function handleRequestError(startTime) {
            return function(error) {
                vm.testResponse = {
                    status: error.status || 0,
                    time: Date.now() - startTime,
                    body: JSON.stringify(error.data || { message: error.message || 'Request failed' }, null, 2)
                };
                vm.testing = false;
                stopSpinner();
                
                // Auto-scroll to response after a short delay
                $timeout(function() {
                    scrollToResponse();
                }, 100);
            };
        }

        // ============================================
        // UI Helpers
        // ============================================
        function addQueryParam() {
            vm.testQueryParams.push({ key: '', value: '' });
        }

        function removeQueryParam(index) {
            if (vm.testQueryParams.length > 1) {
                vm.testQueryParams.splice(index, 1);
            }
        }

        function addCustomHeader() {
            vm.testCustomHeaders.push({ key: '', value: '' });
        }

        function removeCustomHeader(index) {
            vm.testCustomHeaders.splice(index, 1);
        }

        function toggleApiKeyVisibility() {
            vm.testAuth.showKey = !vm.testAuth.showKey;
            var input = document.getElementById('testApiKeyInput');
            if (input) {
                input.type = vm.testAuth.showKey ? 'text' : 'password';
            }
        }

        function handleFileSelect(files) {
            if (files && files.length > 0) {
                vm.testFile = files[0];
                $scope.$apply();
            }
        }

        // ============================================
        // API Key Management
        // ============================================
        function fetchApiKeys() {
            vm.loadingApiKeys = true;
            $http.get('/dashboard/api/access-tokens')
                .then(function(response) {
                    if (response.data && response.data.success) {
                        vm.apiKeys = response.data.data || [];
                        if (vm.testAuth.selectedKeyUuid) {
                            var selectedKey = vm.apiKeys.find(function(k) {
                                return k.uuid === vm.testAuth.selectedKeyUuid;
                            });
                            if (selectedKey) {
                                fetchApiKeyDetails(vm.testAuth.selectedKeyUuid);
                            }
                        }
                    }
                    vm.loadingApiKeys = false;
                })
                .catch(function(error) {
                    console.error('Failed to fetch API keys:', error);
                    vm.loadingApiKeys = false;
                });
        }

        function fetchApiKeyDetails(uuid) {
            $http.get('/dashboard/api/access-tokens/' + uuid)
                .then(function(response) {
                    if (response.data && response.data.success) {
                        vm.testAuth.apiKey = response.data.data.key || response.data.data.fullKey || '';
                        saveAuth();
                    }
                })
                .catch(function(error) {
                    console.error('Failed to fetch API key details:', error);
                });
        }

        function onApiKeySelected() {
            if (vm.testAuth.selectedKeyUuid) {
                fetchApiKeyDetails(vm.testAuth.selectedKeyUuid);
            } else {
                vm.testAuth.apiKey = '';
            }
        }

        // ============================================
        // cURL Command Generation
        // ============================================
        function getCurlCommand() {
            if (!vm.currentEndpoint || !vm.testAuth.apiKey) {
                return '// Select an endpoint and API key to generate cURL command';
            }

            var url = buildRequestUrl();
            var method = vm.currentEndpoint.method;
            var curl = 'curl -X ' + method + ' \\\n';
            curl += '  "' + window.location.origin + url + '" \\\n';
            curl += '  -H "Authorization: Bearer ' + vm.testAuth.apiKey + '"';

            // Add Content-Type for POST/PUT with body
            if (vm.currentEndpoint.hasBody && !vm.currentEndpoint.hasFileUpload) {
                curl += ' \\\n  -H "Content-Type: application/json"';
            }

            // Add custom headers
            vm.testCustomHeaders.forEach(function(header) {
                if (header.key && header.key.trim() !== '') {
                    curl += ' \\\n  -H "' + header.key.trim() + ': ' + (header.value || '') + '"';
                }
            });

            // Add body for POST/PUT
            if (vm.currentEndpoint.hasBody && !vm.currentEndpoint.hasFileUpload && vm.testRequestBody) {
                try {
                    var body = JSON.parse(vm.testRequestBody);
                    var bodyStr = JSON.stringify(body).replace(/'/g, "'\\''");
                    curl += ' \\\n  -d \'' + bodyStr + '\'';
                } catch (e) {
                    curl += ' \\\n  -d \'' + vm.testRequestBody.replace(/'/g, "'\\''") + '\'';
                }
            }

            // Add file upload
            if (vm.currentEndpoint.hasFileUpload && vm.testFile) {
                curl += ' \\\n  -F "file=@' + vm.testFile.name + '"';
            }

            return curl;
        }

        function copyCurlCommand() {
            copyToClipboardText(getCurlCommand(), 'cURL command copied to clipboard');
        }

        // ============================================
        // Clipboard Utilities
        // ============================================
        function copyToClipboard(elementId) {
            var element = document.getElementById(elementId);
            if (!element) return;

            var text = element.textContent || element.innerText;
            copyToClipboardText(text.trim(), 'Copied to clipboard');
        }

        function copyTestResponse() {
            if (!vm.testResponse) return;
            copyToClipboardText(vm.testResponse.body, 'Response copied to clipboard');
        }

        function copyToClipboardText(text, successMessage) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    brudexutils.toastSuccess(successMessage);
                }).catch(function() {
                    fallbackCopyToClipboard(text, successMessage);
                });
            } else {
                fallbackCopyToClipboard(text, successMessage);
            }
        }

        function fallbackCopyToClipboard(text, successMessage) {
            var textArea = document.createElement('textarea');
            textArea.value = text.trim();
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                brudexutils.toastSuccess(successMessage || 'Copied to clipboard');
            } catch (err) {
                brudexutils.toastError('Failed to copy');
            }
            document.body.removeChild(textArea);
        }

        // ============================================
        // Spinner Management
        // ============================================
        function startSpinner() {
            if (!$window.Spinner) {
                console.warn('Spinner library not loaded');
                return;
            }

            var opts = {
                lines: 13,
                length: 42,
                width: 28,
                radius: 80,
                scale: 0.8,
                corners: 1,
                color: '#00EFFF',
                opacity: 0.25,
                fadeColor: 'transparent',
                speed: 1,
                rotate: 0,
                animation: 'spinner-line-fade-quick',
                direction: 1,
                zIndex: 2e9,
                className: 'myspinner',
                shadow: false,
                position: 'relative'
            };

            if (!spinnerTarget) {
                spinnerTarget = $window.document.getElementById('testSidebarSpinnerContainer');
                if (!spinnerTarget) {
                    console.warn('Spinner container not found');
                    return;
                }
            }

            if (!spinner) {
                spinner = new $window.Spinner(opts);
            }

            spinner.spin(spinnerTarget);
        }

        function stopSpinner() {
            if (spinner && spinnerTarget) {
                spinner.stop();
            }
        }

        // ============================================
        // Auto-scroll to Response
        // ============================================
        function scrollToResponse() {
            $timeout(function() {
                var sidebar = $window.document.querySelector('.api-doc-test-sidebar');
                if (!sidebar) return;

                // Find the response section - look for element containing test-response-body
                var responseBody = $window.document.querySelector('.test-response-body');
                if (!responseBody) return;

                // Find the parent test-section
                var responseSection = responseBody.closest('.test-section');
                if (!responseSection) responseSection = responseBody;

                // Calculate scroll position
                var sidebarRect = sidebar.getBoundingClientRect();
                var responseRect = responseSection.getBoundingClientRect();
                var scrollTop = sidebar.scrollTop + (responseRect.top - sidebarRect.top) - 20; // 20px offset

                sidebar.scrollTo({
                    top: Math.max(0, scrollTop),
                    behavior: 'smooth'
                });
            }, 50);
        }

        // Expose to view
        $scope.vm = vm;
    }
})();
