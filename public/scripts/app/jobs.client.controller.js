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
            }, 10000); // Refresh every 10 seconds
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
                    
                    var content = '<div class="row mb-3">' +
                        '<div class="col-md-6"><strong>UUID:</strong><br><small>' + job.uuid + '</small></div>' +
                        '<div class="col-md-6"><strong>Name:</strong><br>' + job.name + '</div>' +
                        '</div>' +
                        '<div class="row mb-3">' +
                        '<div class="col-md-4"><strong>Total Jobs:</strong> ' + job.totalJobs + '</div>' +
                        '<div class="col-md-4"><strong>Pending:</strong> ' + job.pendingJobs + '</div>' +
                        '<div class="col-md-4"><strong>Failed:</strong> ' + (job.failedJobs > 0 ? '<span class="text-danger">' + job.failedJobs + '</span>' : job.failedJobs) + '</div>' +
                        '</div>' +
                        '<div class="row mb-3">' +
                        '<div class="col-md-6"><strong>Created:</strong><br>' + formatDate(job.createdAt) + '</div>' +
                        '<div class="col-md-6"><strong>Finished:</strong><br>' + (job.finishedAt ? formatDate(job.finishedAt) : '-') + '</div>' +
                        '</div>' +
                        '<div class="row mb-3">' +
                        '<div class="col-md-12"><strong>Progress:</strong>' +
                        '<div class="progress mt-2"><div class="progress-bar" role="progressbar" style="width: ' + progress + '%">' + progress + '%</div></div>' +
                        '</div></div>';
                    
                    if (job.failedJobIds && job.failedJobIds.length > 0) {
                        var failedIds = Array.isArray(job.failedJobIds) ? job.failedJobIds : JSON.parse(job.failedJobIds);
                        content += '<div class="row mb-3"><div class="col-md-12"><strong>Failed Job IDs:</strong><ul>';
                        failedIds.forEach(function(id) {
                            content += '<li>' + id + '</li>';
                        });
                        content += '</ul></div></div>';
                    }
                    
                    if (job.options) {
                        var options = typeof job.options === 'string' ? JSON.parse(job.options) : job.options;
                        content += '<div class="row mb-3"><div class="col-md-12"><strong>Options:</strong><pre class="bg-light p-2 rounded">' + JSON.stringify(options, null, 2) + '</pre></div></div>';
                    }
                    
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
