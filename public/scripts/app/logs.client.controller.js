(function () {
    'use strict';
    angular
        .module('app')
        .controller('LogsController', LogsController);

    LogsController.$inject = ['$scope', '$http', '$timeout', '$interval', 'brudexutils'];

    function LogsController($scope, $http, $timeout, $interval, brudexutils) {
        var vm = this;

        // Properties
        vm.currentSearchTerm = '';
        vm.autoRefreshInterval = null;
        vm.relativeTimeInterval = null;
        vm.currentPage = 1;
        vm.drawerVisible = false;
        vm.selectedLog = null;
        vm.logDateInfo = null;
        vm.loading = true;
        vm.logs = [];
        vm.pagination = null;
        vm.summary = null;
        vm.filters = {
            level: null,
            service: null,
            timeRange: null,
            startDate: null,
            endDate: null
        };

        // Methods
        vm.init = init;
        vm.updateRelativeTimes = updateRelativeTimes;
        vm.highlightSearchMatches = highlightSearchMatches;
        vm.removeHighlights = removeHighlights;
        vm.clearSearch = clearSearch;
        vm.toggleMessage = toggleMessage;
        vm.showLogDetail = showLogDetail;
        vm.closeLogDrawer = closeLogDrawer;
        vm.copyToClipboard = copyToClipboard;
        vm.copyLogMessage = copyLogMessage;
        vm.getLevelColor = getLevelColor;
        vm.formatMetadata = formatMetadata;
        vm.getTimestamp = getTimestamp;
        vm.cleanupLogs = cleanupLogs;
        vm.startAutoRefresh = startAutoRefresh;
        vm.stopAutoRefresh = stopAutoRefresh;
        vm.updateLogsTable = updateLogsTable;
        vm.updateSummary = updateSummary;
        vm.handleFilterPillClick = handleFilterPillClick;
        vm.handleKeyboardShortcuts = handleKeyboardShortcuts;
        vm.handleAutoRefreshToggle = handleAutoRefreshToggle;
        vm.handleSearchInput = handleSearchInput;
        vm.clearSearch = clearSearch;
        vm.goToPage = goToPage;
        vm.fetchLogs = fetchLogs;
        vm.getPaginationPages = getPaginationPages;
        vm.applyCustomDateRange = applyCustomDateRange;

        // Initialize
        function init() {
            vm.loading = true;
            // Extract filters from URL params
            var urlParams = new URLSearchParams(window.location.search);
            vm.currentSearchTerm = urlParams.get('search') || '';
            vm.currentPage = parseInt(urlParams.get('page')) || 1;
            vm.filters.level = urlParams.get('level') || null;
            vm.filters.service = urlParams.get('service') || null;
            vm.filters.timeRange = urlParams.get('timeRange') || null;
            vm.filters.startDate = urlParams.get('startDate') || null;
            vm.filters.endDate = urlParams.get('endDate') || null;

            // Fetch initial data
            fetchLogs();
            fetchSummary();

            // Set up relative time updates
            vm.relativeTimeInterval = $interval(function() {
                updateRelativeTimes();
            }, 60000); // Update every minute

            // Set up filter pill handlers
            $timeout(function() {
                var pills = document.querySelectorAll('.filter-pill');
                pills.forEach(function(pill) {
                    pill.addEventListener('click', function() {
                        vm.handleFilterPillClick(this);
                    });
                });
                
                // Set initial active states
                if (vm.filters.level) {
                    var levelPill = document.querySelector('[data-filter="level"][data-value="' + vm.filters.level + '"]');
                    if (levelPill) {
                        levelPill.dataset.active = 'true';
                    }
                }
                if (vm.filters.service) {
                    var servicePill = document.querySelector('[data-filter="service"][data-value="' + vm.filters.service + '"]');
                    if (servicePill) {
                        servicePill.dataset.active = 'true';
                    }
                }
                if (vm.filters.timeRange) {
                    var timePill = document.querySelector('[data-filter="timeRange"][data-value="' + vm.filters.timeRange + '"]');
                    if (timePill) {
                        timePill.dataset.active = 'true';
                    }
                    if (vm.filters.timeRange === 'custom') {
                        var dateRangeContainer = document.getElementById('date-range-container');
                        if (dateRangeContainer) {
                            dateRangeContainer.style.display = 'block';
                        }
                        var startDateInput = document.getElementById('start-date');
                        var endDateInput = document.getElementById('end-date');
                        if (startDateInput && vm.filters.startDate) {
                            startDateInput.value = vm.filters.startDate;
                        }
                        if (endDateInput && vm.filters.endDate) {
                            endDateInput.value = vm.filters.endDate;
                        }
                    }
                }
            }, 100);

            // Set up keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                vm.handleKeyboardShortcuts(e);
            });

            // Set up auto-refresh toggle
            $timeout(function() {
                var toggle = document.getElementById('auto-refresh-toggle');
                if (toggle) {
                    toggle.addEventListener('change', function() {
                        vm.handleAutoRefreshToggle(this.checked);
                    });
                }
            }, 100);

            // Set up search input
            $timeout(function() {
                var searchInput = document.getElementById('search-input');
                if (searchInput) {
                    if (vm.currentSearchTerm) {
                        searchInput.value = vm.currentSearchTerm;
                    }
                    searchInput.addEventListener('input', function() {
                        vm.handleSearchInput(this.value);
                    });
                }
                
                // Set up date range inputs - allow Enter key to trigger search
                var startDateInput = document.getElementById('start-date');
                var endDateInput = document.getElementById('end-date');
                if (startDateInput) {
                    startDateInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            vm.applyCustomDateRange();
                        }
                    });
                }
                if (endDateInput) {
                    endDateInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            vm.applyCustomDateRange();
                        }
                    });
                }
            }, 100);

            // Close drawer on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (vm.drawerVisible) {
                        vm.closeLogDrawer();
                    }
                }
            });
        }

        function fetchLogs() {
            vm.loading = true;
            
            var params = new URLSearchParams();
            params.append('page', vm.currentPage);
            params.append('limit', '1000');
            
            if (vm.currentSearchTerm) {
                params.append('search', vm.currentSearchTerm);
            }
            if (vm.filters.level) {
                params.append('level', vm.filters.level);
            }
            if (vm.filters.service) {
                params.append('service', vm.filters.service);
            }
            if (vm.filters.timeRange) {
                params.append('timeRange', vm.filters.timeRange);
            }
            if (vm.filters.startDate) {
                params.append('startDate', vm.filters.startDate);
            }
            if (vm.filters.endDate) {
                params.append('endDate', vm.filters.endDate);
            }

            $http.get('/admin/api/logs?' + params.toString()).then(function(response) {
                if (response.data.success) {
                    vm.logs = response.data.data.logs;
                    vm.pagination = response.data.data.pagination;
                    
                    $timeout(function() {
                        updateRelativeTimes();
                        if (vm.currentSearchTerm) {
                            highlightSearchMatches(vm.currentSearchTerm);
                        }
                    }, 100);
                }
                vm.loading = false;
            }).catch(function(error) {
                console.error('Error fetching logs:', error);
                vm.loading = false;
                alert('Failed to load logs');
            });
        }

        function fetchSummary() {
            $http.get('/admin/api/logs/summary').then(function(response) {
                if (response.data.success) {
                    vm.summary = response.data.data;
                }
            }).catch(function(error) {
                console.error('Error fetching summary:', error);
            });
        }

        function updateRelativeTimes() {
            var elements = document.querySelectorAll('.relative-time');
            elements.forEach(function(el) {
                var timestamp = parseInt(el.dataset.timestamp);
                if (timestamp) {
                    var date = new Date(timestamp);
                    var now = new Date();
                    var diff = now - date;

                    var text = '';
                    if (diff < 60000) {
                        text = 'Just now';
                    } else if (diff < 3600000) {
                        var mins = Math.floor(diff / 60000);
                        text = mins + 'm ago';
                    } else {
                        // For logs older than 1 hour, show date and time in yyyy-MM-dd format
                        var year = date.getFullYear();
                        var month = String(date.getMonth() + 1).padStart(2, '0');
                        var day = String(date.getDate()).padStart(2, '0');
                        var hours = String(date.getHours()).padStart(2, '0');
                        var minutes = String(date.getMinutes()).padStart(2, '0');
                        text = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
                    }

                    el.textContent = text;
                    el.title = date.toLocaleString();
                }
            });
        }

        function highlightSearchMatches(term) {
            if (!term) return;

            var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            var elements = document.querySelectorAll('.log-message-text');
            elements.forEach(function(el) {
                var text = el.textContent;
                var highlighted = text.replace(regex, '<span class="highlight">$1</span>');
                el.innerHTML = highlighted;
            });
        }

        function removeHighlights() {
            var elements = document.querySelectorAll('.log-message-text');
            elements.forEach(function(el) {
                el.innerHTML = el.textContent;
            });
        }

        function toggleMessage(btn) {
            var row = btn.closest('.log-row');
            var messageDiv = row.querySelector('.log-message');
            var messageText = messageDiv.querySelector('.log-message-text');
            var fullMessage = messageDiv.dataset.full;
            var icon = btn.querySelector('i');

            if (icon.classList.contains('bi-chevron-down')) {
                messageText.textContent = fullMessage;
                icon.classList.remove('bi-chevron-down');
                icon.classList.add('bi-chevron-up');
            } else {
                messageText.textContent = fullMessage.length > 150 ? fullMessage.substring(0, 150) + '...' : fullMessage;
                icon.classList.remove('bi-chevron-up');
                icon.classList.add('bi-chevron-down');
            }

            if (vm.currentSearchTerm) {
                highlightSearchMatches(vm.currentSearchTerm);
            }
        }

        function showLogDetail(uuid) {
            $http.get('/admin/api/logs/' + uuid).then(function(response) {
                if (response.data.success) {
                    var log = response.data.data;
                    vm.selectedLog = log;
                    
                    // Format date info
                    var date = new Date(log.createdAt);
                    var now = new Date();
                    var diff = now - date;
                    
                    var relativeTime = '';
                    if (diff < 60000) {
                        relativeTime = 'Just now';
                    } else if (diff < 3600000) {
                        relativeTime = Math.floor(diff / 60000) + 'm ago';
                    } else {
                        // For logs older than 1 hour, show date and time in yyyy-MM-dd format
                        var year = date.getFullYear();
                        var month = String(date.getMonth() + 1).padStart(2, '0');
                        var day = String(date.getDate()).padStart(2, '0');
                        var hours = String(date.getHours()).padStart(2, '0');
                        var minutes = String(date.getMinutes()).padStart(2, '0');
                        relativeTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
                    }
                    
                    vm.logDateInfo = {
                        absolute: date.toLocaleString(),
                        relative: relativeTime
                    };
                    
                    // Show drawer
                    $timeout(function() {
                        vm.drawerVisible = true;
                        document.body.style.overflow = 'hidden';
                    }, 0);
                }
            }).catch(function(error) {
                console.error('Error fetching log detail:', error);
                alert('Failed to load log details');
            });
        }

        function closeLogDrawer() {
            $timeout(function() {
                vm.drawerVisible = false;
                vm.selectedLog = null;
                vm.logDateInfo = null;
                document.body.style.overflow = '';
            }, 0);
        }
        
        function getLevelColor(level) {
            switch(level) {
                case 'error': return '#dc3545';
                case 'warn': return '#ffc107';
                case 'info': return '#17a2b8';
                default: return '#6c757d';
            }
        }
        
        function formatMetadata(meta) {
            if (!meta) return '';
            try {
                return JSON.stringify(meta, null, 2);
            } catch (e) {
                return String(meta);
            }
        }
        
        function getTimestamp(dateString) {
            if (!dateString) return 0;
            try {
                return new Date(dateString).getTime();
            } catch (e) {
                return 0;
            }
        }

        function copyToClipboard(text, event) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    var btn = event ? event.target.closest('.copy-btn') : null;
                    if (btn) {
                        var originalHTML = btn.innerHTML;
                        btn.innerHTML = '<i class="bi bi-check me-1"></i> Copied';
                        btn.style.background = '#28a745';
                        $timeout(function() {
                            btn.innerHTML = originalHTML;
                            btn.style.background = '';
                        }, 2000);
                    }
                });
            }
        }

        function copyLogMessage(btn) {
            if (!vm.selectedLog) return;
            
            var text = vm.selectedLog.message;
            if (vm.selectedLog.meta) {
                text += '\n\n--- Metadata ---\n' + formatMetadata(vm.selectedLog.meta);
            }
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    var btnEl = btn ? angular.element(btn) : angular.element(event.target.closest('.copy-btn'));
                    if (btnEl.length) {
                        var originalHTML = btnEl[0].innerHTML;
                        btnEl[0].innerHTML = '<i class="bi bi-check me-1"></i> Copied';
                        btnEl[0].style.background = '#28a745';
                        $timeout(function() {
                            btnEl[0].innerHTML = originalHTML;
                            btnEl[0].style.background = '';
                        }, 2000);
                    }
                });
            }
        }

        function cleanupLogs() {
            brudexutils.alertInputModal(
                'Cleanup Old Logs',
                'Enter the number of days to keep. Logs older than this will be deleted.',
                function(result) {
                    if (result.isConfirmed && result.value) {
                        var daysToKeep = parseInt(result.value);
                        
                        if (isNaN(daysToKeep) || daysToKeep < 1) {
                            brudexutils.alertError('Invalid Input', 'Please enter a valid number of days (minimum 1).');
                            return;
                        }

                        $http.post('/admin/api/logs/cleanup', {
                            daysToKeep: daysToKeep
                        }).then(function(response) {
                            if (response.data.success) {
                                brudexutils.alertSuccess('Success', 'Logs cleaned up successfully. ' + response.data.deletedCount + ' logs deleted.');
                                // Refresh logs after cleanup
                                fetchLogs();
                                fetchSummary();
                            } else {
                                brudexutils.alertError('Error', response.data.message || 'Failed to cleanup logs');
                            }
                        }).catch(function(error) {
                            brudexutils.alertError('Error', error.data ? error.data.message : error.message || 'Failed to cleanup logs');
                        });
                    }
                },
                {
                    confirmButtonText: 'Cleanup',
                    cancelButtonText: 'Cancel',
                    icon: 'warning',
                    validator: function(value) {
                        if (!value) {
                            return 'Please enter the number of days to keep';
                        }
                        var days = parseInt(value);
                        if (isNaN(days) || days < 1) {
                            return 'Please enter a valid number of days (minimum 1)';
                        }
                        return null;
                    }
                }
            );
        }

        function startAutoRefresh() {
            if (vm.autoRefreshInterval) return;

            vm.autoRefreshInterval = $interval(function() {
                var form = document.getElementById('logs-filter-form');
                if (!form) return;

                var formData = new FormData(form);
                var params = new URLSearchParams(formData);
                params.append('page', vm.currentPage);

                // Add date range params if custom range is selected
                var timeRange = document.getElementById('filter-timeRange');
                if (timeRange && timeRange.value === 'custom') {
                    var startDate = document.getElementById('start-date');
                    var endDate = document.getElementById('end-date');
                    if (startDate && startDate.value) {
                        params.append('startDate', startDate.value);
                    }
                    if (endDate && endDate.value) {
                        params.append('endDate', endDate.value);
                    }
                }

                $http.get('/admin/api/logs?' + params.toString()).then(function(response) {
                    if (response.data.success) {
                        updateLogsTable(response.data.data.logs, response.data.data.pagination);
                        updateSummary();
                    }
                }).catch(function(error) {
                    console.error('Auto-refresh error:', error);
                });
            }, 10000); // Refresh every 10 seconds
        }

        function stopAutoRefresh() {
            if (vm.autoRefreshInterval) {
                $interval.cancel(vm.autoRefreshInterval);
                vm.autoRefreshInterval = null;
            }
        }

        function updateLogsTable(logs, pagination) {
            var tbody = document.getElementById('logs-tbody');
            var countEl = document.getElementById('logs-count');

            if (countEl) {
                countEl.textContent = pagination.totalItems.toLocaleString();
            }

            if (!tbody) return;

            if (logs.length === 0) {
                tbody.innerHTML = '<tr style="background: #1F1F23; border-bottom: 1px solid #2F2F33;"><td colspan="4" class="text-center" style="padding: 40px 16px; color: #B0B0B0; font-size: 14px; background: inherit;"><i class="bi bi-inbox me-2" style="font-size: 18px; opacity: 0.6;"></i>No logs found</td></tr>';
                return;
            }

            var html = logs.map(function(log, index) {
                var date = new Date(log.createdAt);
                var messageTruncated = log.message.length > 150 ? log.message.substring(0, 150) + '...' : log.message;
                var expandBtn = log.message.length > 150 ?
                    '<button class="btn btn-link p-0 ms-1 expand-message" style="font-size: 11px; color: var(--theme-accent-cyan); text-decoration: none; padding: 0 !important;" onclick="event.stopPropagation(); angular.element(this).scope().$parent.logsCtrl.toggleMessage(this)"><i class="bi bi-chevron-down"></i></button>' : '';

                var levelColor = log.level === 'error' ? '#dc3545' : log.level === 'warn' ? '#ffc107' : log.level === 'info' ? '#17a2b8' : '#6c757d';
                var bgColor = index % 2 === 0 ? 'var(--theme-secondary)' : 'var(--theme-primary)';

                return '<tr class="log-row" ' +
                    'data-uuid="' + log.uuid + '" ' +
                    'data-level="' + log.level + '" ' +
                    'style="cursor: pointer; transition: background 0.2s; background: ' + bgColor + ';" ' +
                    'onclick="angular.element(this).scope().$parent.logsCtrl.showLogDetail(\'' + log.uuid + '\')">' +
                    '<td class="log-timestamp" style="padding: 14px 16px; font-size: 12px; color: var(--theme-text-secondary);">' +
                    '<span class="relative-time" data-timestamp="' + date.getTime() + '"></span>' +
                    '</td>' +
                    '<td style="padding: 14px 16px;">' +
                    '<span class="log-level-badge badge" style="display: inline-block; min-width: 70px; text-align: center; padding: 6px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; background: ' + levelColor + '; color: #fff;">' +
                    log.level.toUpperCase() +
                    '</span>' +
                    '</td>' +
                    '<td style="padding: 14px 16px; font-size: 13px; color: var(--theme-text-primary);">' +
                    (log.service || '<span class="text-theme-secondary">-</span>') +
                    '</td>' +
                    '<td style="padding: 14px 16px;">' +
                    '<div class="log-message" data-full="' + log.message.replace(/"/g, '&quot;') + '" style="font-size: 13px; color: var(--theme-text-primary); line-height: 1.5;">' +
                    '<span class="log-message-text">' + messageTruncated + '</span>' +
                    expandBtn +
                    '</div>' +
                    '</td>' +
                    '</tr>';
            }).join('');

            tbody.innerHTML = html;
            updateRelativeTimes();
            if (vm.currentSearchTerm) {
                highlightSearchMatches(vm.currentSearchTerm);
            }
        }

        function updateSummary() {
            $http.get('/admin/api/logs/summary').then(function(response) {
                if (response.data.success) {
                    var totalEl = document.getElementById('summary-total');
                    var errorsEl = document.getElementById('summary-errors');
                    var warningsEl = document.getElementById('summary-warnings');
                    var lastEl = document.getElementById('summary-last');

                    if (totalEl) {
                        totalEl.textContent = response.data.data.totalLogs.toLocaleString();
                    }
                    if (errorsEl) {
                        errorsEl.textContent = response.data.data.errorsToday.toLocaleString();
                    }
                    if (warningsEl) {
                        warningsEl.textContent = response.data.data.warningsToday.toLocaleString();
                    }
                    if (lastEl && response.data.data.lastLogTimestamp) {
                        var date = new Date(response.data.data.lastLogTimestamp);
                        lastEl.innerHTML = '<span class="relative-time" data-timestamp="' + date.getTime() + '"></span>';
                        updateRelativeTimes();
                    }
                }
            }).catch(function(error) {
                console.error('Error updating summary:', error);
            });
        }

        function handleFilterPillClick(pill) {
            var filterType = pill.dataset.filter;
            var value = pill.dataset.value;

            // Update active state
            var allPills = document.querySelectorAll('[data-filter="' + filterType + '"]');
            allPills.forEach(function(p) {
                p.dataset.active = 'false';
            });
            pill.dataset.active = 'true';

            // Update hidden input
            var hiddenInput = document.getElementById('filter-' + filterType);
            if (hiddenInput) {
                hiddenInput.value = value;
            }

            // Update filter value
            if (filterType === 'level') {
                vm.filters.level = value === '' ? null : value;
            } else if (filterType === 'service') {
                vm.filters.service = value === '' ? null : value;
            } else if (filterType === 'timeRange') {
                vm.filters.timeRange = value === '' ? null : value;
                
                var dateRangeContainer = document.getElementById('date-range-container');
                if (dateRangeContainer) {
                    if (value === 'custom') {
                        dateRangeContainer.style.display = 'block';
                    } else {
                        dateRangeContainer.style.display = 'none';
                        // Clear date inputs when switching away from custom
                        vm.filters.startDate = null;
                        vm.filters.endDate = null;
                        var startDate = document.getElementById('start-date');
                        var endDate = document.getElementById('end-date');
                        if (startDate) startDate.value = '';
                        if (endDate) endDate.value = '';
                    }
                }
            }

            // Reset to first page and fetch logs
            vm.currentPage = 1;
            fetchLogs();
        }

        function handleKeyboardShortcuts(e) {
            // Focus search on '/'
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                var searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Clear filters on Escape
            if (e.key === 'Escape' && e.target.id === 'search-input') {
                clearSearch();
            }
        }

        function handleAutoRefreshToggle(checked) {
            if (checked) {
                startAutoRefresh();
            } else {
                stopAutoRefresh();
            }
        }

        var searchTimeout = null;
        function handleSearchInput(value) {
            var clearBtn = document.getElementById('clear-search');
            if (clearBtn) {
                clearBtn.style.display = value ? 'block' : 'none';
            }
            vm.currentSearchTerm = value;
            
            // Debounce search API call
            if (searchTimeout) {
                $timeout.cancel(searchTimeout);
            }
            searchTimeout = $timeout(function() {
                vm.currentPage = 1;
                fetchLogs();
            }, 500);
        }
        
        function clearSearch() {
            var searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = '';
            }
            var clearBtn = document.getElementById('clear-search');
            if (clearBtn) {
                clearBtn.style.display = 'none';
            }
            vm.currentSearchTerm = '';
            removeHighlights();
            vm.currentPage = 1;
            fetchLogs();
        }
        
        function goToPage(page) {
            vm.currentPage = page;
            fetchLogs();
            // Scroll to top
            window.scrollTo(0, 0);
        }
        
        function getPaginationPages() {
            if (!vm.pagination || !vm.pagination.totalPages) return [];
            
            var pages = [];
            var current = vm.pagination.currentPage;
            var total = vm.pagination.totalPages;
            
            if (total <= 7) {
                for (var i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                
                if (current > 4) {
                    pages.push('...');
                }
                
                var start = Math.max(2, current - 2);
                var end = Math.min(total - 1, current + 2);
                
                for (var i = start; i <= end; i++) {
                    pages.push(i);
                }
                
                if (current < total - 3) {
                    pages.push('...');
                }
                
                pages.push(total);
            }
            
            return pages;
        }

        function applyCustomDateRange() {
            var startDateInput = document.getElementById('start-date');
            var endDateInput = document.getElementById('end-date');
            
            if (!startDateInput || !endDateInput) {
                return;
            }
            
            var startDate = startDateInput.value;
            var endDate = endDateInput.value;
            
            // Validate that at least one date is provided
            if (!startDate && !endDate) {
                brudexutils.alertWarning('Date Range Required', 'Please select at least a start date or end date.');
                return;
            }
            
            // Validate that start date is before end date if both are provided
            if (startDate && endDate) {
                var start = new Date(startDate);
                var end = new Date(endDate);
                if (start > end) {
                    brudexutils.alertError('Invalid Date Range', 'Start date must be before end date.');
                    return;
                }
            }
            
            // Update filters
            vm.filters.startDate = startDate || null;
            vm.filters.endDate = endDate || null;
            
            // Ensure timeRange is set to custom
            vm.filters.timeRange = 'custom';
            
            // Update hidden input
            var timeRangeInput = document.getElementById('filter-timeRange');
            if (timeRangeInput) {
                timeRangeInput.value = 'custom';
            }
            
            // Reset to first page and fetch logs
            vm.currentPage = 1;
            fetchLogs();
        }

        // Cleanup on scope destroy
        $scope.$on('$destroy', function() {
            if (vm.autoRefreshInterval) {
                $interval.cancel(vm.autoRefreshInterval);
            }
            if (vm.relativeTimeInterval) {
                $interval.cancel(vm.relativeTimeInterval);
            }
        });
    }
})();
