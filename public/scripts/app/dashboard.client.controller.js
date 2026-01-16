(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$http', '$timeout'];

    function DashboardController($scope, $http, $timeout) {
        var vm = this;

        // State
        vm.loading = true;
        vm.currentView = 'global'; // 'global' or 'project'
        vm.selectedProjectUuid = null;
        vm.projects = [];
        vm.globalMetrics = null;
        vm.projectMetrics = null;
        vm.selectedProject = null;

        // Initialize
        vm.init = init;
        vm.selectProject = selectProject;
        vm.selectGlobalView = selectGlobalView;
        vm.getProjectInitials = getProjectInitials;
        vm.getStatusClass = getStatusClass;
        vm.formatDate = formatDate;
        vm.formatTime = formatTime;

        // Initialize on load
        init();

        function init() {
            vm.loading = true;
            loadProjects();
        }

        function loadProjects() {
            $http.get('/dashboard/api/projects')
                .then(function (response) {
                    if (response.data.success) {
                        vm.projects = response.data.data || [];
                        loadGlobalMetrics();
                    } else {
                        console.error('Failed to load projects:', response.data.message);
                        vm.loading = false;
                    }
                })
                .catch(function (error) {
                    console.error('Error loading projects:', error);
                    vm.loading = false;
                });
        }

        function loadGlobalMetrics() {
            $http.get('/dashboard/api/dashboard/global')
                .then(function (response) {
                    if (response.data.success) {
                        vm.globalMetrics = response.data.data;
                        vm.loading = false;
                    } else {
                        console.error('Failed to load global metrics:', response.data.message);
                        vm.loading = false;
                    }
                })
                .catch(function (error) {
                    console.error('Error loading global metrics:', error);
                    vm.loading = false;
                });
        }

        function loadProjectMetrics(projectUuid) {
            vm.loading = true;
            $http.get('/dashboard/api/dashboard/project/' + projectUuid)
                .then(function (response) {
                    if (response.data.success) {
                        vm.projectMetrics = response.data.data;
                        vm.selectedProject = response.data.data.project;
                        vm.loading = false;
                    } else {
                        console.error('Failed to load project metrics:', response.data.message);
                        vm.loading = false;
                    }
                })
                .catch(function (error) {
                    console.error('Error loading project metrics:', error);
                    vm.loading = false;
                });
        }

        function selectProject(project) {
            vm.currentView = 'project';
            vm.selectedProjectUuid = project.uuid;
            vm.selectedProject = project;
            loadProjectMetrics(project.uuid);
        }

        function selectGlobalView() {
            vm.currentView = 'global';
            vm.selectedProjectUuid = null;
            vm.selectedProject = null;
            vm.projectMetrics = null;
            if (!vm.globalMetrics) {
                loadGlobalMetrics();
            }
        }

        function getProjectInitials(name) {
            if (!name) return '';
            var words = name.trim().split(/\s+/);
            if (words.length >= 2) {
                return (words[0][0] + words[1][0]).toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }

        function getStatusClass(status) {
            var classes = {
                0: 'badge-secondary', // DRAFT
                1: 'badge-info',      // SCHEDULED
                2: 'badge-success',   // PUBLISHED
                3: 'badge-danger'     // FAILED
            };
            return classes[status] || 'badge-secondary';
        }

        function formatDate(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        }

        function formatTime(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true
            });
        }

        // Expose to view
        $scope.vm = vm;
    }
})();

