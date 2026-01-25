(function () {
    'use strict';
    angular
        .module('app')
        .controller('JobsController', JobsController);

    JobsController.$inject = ['$scope', '$http', '$timeout', '$interval'];

    function JobsController($scope, $http, $timeout, $interval) {
        var vm = this;

        // Properties
        vm.currentPage = 1;
        vm.loading = true;
        vm.jobBatches = [];
        vm.pagination = null;
        vm.filters = {
            status: null
        };

        // Methods
        vm.init = init;
        vm.fetchJobs = fetchJobs;
        vm.goToPage = goToPage;
        vm.getPaginationPages = getPaginationPages;
        vm.getJobStatus = getJobStatus;
        vm.getJobStatusClass = getJobStatusClass;
        vm.getProgress = getProgress;
        vm.viewJobDetails = viewJobDetails;
        vm.formatDate = formatDate;

        // Initialize
        function init() {
            vm.loading = true;
            // Extract filters from URL params
            var urlParams = new URLSearchParams(window.location.search);
            vm.currentPage = parseInt(urlParams.get('page')) || 1;
            vm.filters.status = urlParams.get('status') || null;

            // Fetch initial data
            fetchJobs();

            // Set up auto-refresh for active jobs
            vm.autoRefreshInterval = $interval(function() {
                // Only refresh if there are active jobs
                var hasActiveJobs = vm.jobBatches && vm.jobBatches.some(function(job) {
                    return !job.finishedAt && !job.cancelledAt;
                });
                if (hasActiveJobs) {
                    fetchJobs();
                }
            }, 30000); // Refresh every 10 seconds
        }

        function fetchJobs() {
            vm.loading = true;
            
            var params = new URLSearchParams();
            params.append('page', vm.currentPage);
            params.append('limit', '50');
            
            if (vm.filters.status) {
                params.append('status', vm.filters.status);
            }

            $http.get('/admin/api/jobs?' + params.toString()).then(function(response) {
                if (response.data.success) {
                    vm.jobBatches = response.data.data.jobBatches;
                    vm.pagination = response.data.data.pagination;
                }
                vm.loading = false;
            }).catch(function(error) {
                console.error('Error fetching jobs:', error);
                vm.loading = false;
                alert('Failed to load jobs');
            });
        }

        function goToPage(page) {
            vm.currentPage = page;
            fetchJobs();
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

        function getJobStatus(job) {
            if (job.finishedAt) {
                return 'Completed';
            } else if (job.cancelledAt) {
                return 'Cancelled';
            } else {
                return 'Active';
            }
        }

        function getJobStatusClass(job) {
            if (job.finishedAt) {
                return 'bg-success';
            } else if (job.cancelledAt) {
                return 'bg-secondary';
            } else {
                return 'bg-primary';
            }
        }

        function getProgress(job) {
            if (job.totalJobs === 0) return 0;
            var completed = job.totalJobs - job.pendingJobs;
            return Math.round((completed / job.totalJobs) * 100);
        }

        function viewJobDetails(uuid) {
            $http.get('/admin/api/jobs/' + uuid).then(function(response) {
                if (response.data.success) {
                    var job = response.data.data.jobBatch;
                    var progress = response.data.data.progress;
                    
                    var content = '<div class="job-detail-container">' +
                        // Basic Info Section
                        '<div class="job-detail-section">' +
                        '<div class="job-detail-section-title">Basic Information</div>' +
                        '<div class="job-detail-grid">' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">Name</div>' +
                        '<div class="job-detail-value">' + job.name + '</div>' +
                        '</div>' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">UUID</div>' +
                        '<div class="job-detail-value job-detail-uuid">' + job.uuid + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        
                        // Status & Progress Section
                        '<div class="job-detail-section">' +
                        '<div class="job-detail-section-title">Status & Progress</div>' +
                        '<div class="job-detail-grid">' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">Status</div>' +
                        '<div class="job-detail-value">' +
                        '<span class="job-status-badge ' + getJobStatusClass(job) + '">' + getJobStatus(job) + '</span>' +
                        (job.failedJobs > 0 ? ' <span class="job-status-badge bg-danger ms-2">Has Failures</span>' : '') +
                        '</div>' +
                        '</div>' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">Progress</div>' +
                        '<div class="job-detail-value">' +
                        '<div class="job-progress-detail">' +
                        '<div class="job-progress-bar-detail" style="width: ' + progress + '%">' + progress + '%</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        
                        // Job Counts Section
                        '<div class="job-detail-section">' +
                        '<div class="job-detail-section-title">Job Counts</div>' +
                        '<div class="job-detail-grid job-detail-grid-3">' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">Total Jobs</div>' +
                        '<div class="job-detail-value job-detail-number">' + job.totalJobs + '</div>' +
                        '</div>' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">Pending</div>' +
                        '<div class="job-detail-value job-detail-number">' + job.pendingJobs + '</div>' +
                        '</div>' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">Failed</div>' +
                        '<div class="job-detail-value job-detail-number ' + (job.failedJobs > 0 ? 'job-detail-failed' : '') + '">' + job.failedJobs + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        
                        // Timestamps Section
                        '<div class="job-detail-section">' +
                        '<div class="job-detail-section-title">Timestamps</div>' +
                        '<div class="job-detail-grid">' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">Created</div>' +
                        '<div class="job-detail-value">' + formatDate(job.createdAt) + '</div>' +
                        '</div>' +
                        '<div class="job-detail-item">' +
                        '<div class="job-detail-label">' + (job.finishedAt ? 'Finished' : job.cancelledAt ? 'Cancelled' : 'Status') + '</div>' +
                        '<div class="job-detail-value">' + (job.finishedAt ? formatDate(job.finishedAt) : job.cancelledAt ? formatDate(job.cancelledAt) : 'In Progress') + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    
                    // Failed Job IDs Section
                    if (job.failedJobIds && job.failedJobIds.length > 0) {
                        var failedIds = Array.isArray(job.failedJobIds) ? job.failedJobIds : JSON.parse(job.failedJobIds);
                        content += '<div class="job-detail-section">' +
                            '<div class="job-detail-section-title">Failed Job IDs</div>' +
                            '<div class="job-detail-failed-list">';
                        failedIds.forEach(function(id) {
                            content += '<div class="job-detail-failed-item">' + id + '</div>';
                        });
                        content += '</div></div>';
                    }
                    
                    // Options Section (JSON Code Block)
                    if (job.options) {
                        var options = typeof job.options === 'string' ? JSON.parse(job.options) : job.options;
                        var jsonString = JSON.stringify(options, null, 2);
                        content += '<div class="job-detail-section">' +
                            '<div class="job-detail-section-title">Options</div>' +
                            '<div class="job-detail-json-container">' +
                            '<pre class="job-detail-json"><code>' + escapeHtml(jsonString) + '</code></pre>' +
                            '</div>' +
                            '</div>';
                    }
                    
                    content += '</div>';
                    
                    var modal = new bootstrap.Modal(document.getElementById('jobDetailsModal'));
                    var modalContent = document.getElementById('jobDetailsContent');
                    modalContent.innerHTML = content;
                    modal.show();
                } else {
                    alert('Error loading job details: ' + response.data.message);
                }
            }).catch(function(error) {
                console.error('Error fetching job details:', error);
                alert('Failed to load job details');
            });
        }

        function escapeHtml(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        function formatDate(dateString) {
            if (!dateString) return '-';
            try {
                return new Date(dateString).toLocaleString();
            } catch (e) {
                return dateString;
            }
        }

        // Cleanup on scope destroy
        $scope.$on('$destroy', function() {
            if (vm.autoRefreshInterval) {
                $interval.cancel(vm.autoRefreshInterval);
            }
        });
    }
})();
