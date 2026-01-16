(function () {
    'use strict';
    angular
        .module('app')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', '$http', 'brudexservices', 'brudexutils', '$timeout'];

    function SettingsController($scope, $http, services, utils, $timeout) {
        var vm = this;
        // Properties
        vm.projects = [];
        vm.selectedProject = null;
        vm.loading = false;
        vm.settings = {
            timezone: 'UTC',
            date_format: 'human',
            time_format: 12,
            week_starts_on: 1,
            admin_email: ''
        };
        vm.timezoneList = {};
        vm.saving = false;

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.loadSettings = loadSettings;
        vm.selectProject = selectProject;
        vm.onProjectChange = onProjectChange;
        vm.saveSettings = saveSettings;
        vm.getProjectInitials = getProjectInitials;

        // Initialize
        function init(projectUuid, initialSettings, initialTimezoneList) {
            vm.timezoneList = initialTimezoneList || {};
            
            // Set initial settings from server
            if (initialSettings) {
                vm.settings = {
                    timezone: initialSettings.timezone || 'UTC',
                    date_format: initialSettings.date_format || 'human',
                    time_format: parseInt(initialSettings.time_format) || 12,
                    week_starts_on: parseInt(initialSettings.week_starts_on) || 1,
                    admin_email: initialSettings.admin_email || ''
                };
            }

            loadProjects();
            
            // If projectUuid is provided, set it as selected and load settings for that project
            if (projectUuid) {
                $timeout(function() {
                    var project = vm.projects.find(function(p) {
                        return p.uuid === projectUuid;
                    });
                    if (project) {
                        vm.selectedProject = project;
                        loadSettings(projectUuid);
                    }
                }, 500);
            }
        }

        // Load all projects
        function loadProjects() {
            vm.loading = true;
            services.getProjects(function(response) {
                vm.loading = false;
                if (response.success) {
                    vm.projects = response.data || [];
                } else {
                    utils.alertError('Error', response.message || 'Failed to load projects');
                }
            });
        }

        // Load settings for a project
        function loadSettings(projectUuid) {
            if (!projectUuid) {
                vm.settings = {
                    timezone: 'UTC',
                    date_format: 'human',
                    time_format: 12,
                    week_starts_on: 1,
                    admin_email: ''
                };
                return;
            }

            vm.loading = true;
            $http.get('/dashboard/api/settings?projectUuid=' + projectUuid).then(function(response) {
                vm.loading = false;
                if (response.data.success) {
                    var settingsData = response.data.data || {};
                    vm.settings = {
                        timezone: settingsData.timezone || 'UTC',
                        date_format: settingsData.date_format || 'human',
                        time_format: parseInt(settingsData.time_format) || 12,
                        week_starts_on: parseInt(settingsData.week_starts_on) || 1,
                        admin_email: settingsData.admin_email || ''
                    };
                } else {
                    // Use defaults if API fails
                    vm.settings = {
                        timezone: 'UTC',
                        date_format: 'human',
                        time_format: 12,
                        week_starts_on: 1,
                        admin_email: ''
                    };
                }
            }).catch(function(error) {
                vm.loading = false;
                console.error('Error loading settings:', error);
                // Use defaults on error
                vm.settings = {
                    timezone: 'UTC',
                    date_format: 'human',
                    time_format: 12,
                    week_starts_on: 1,
                    admin_email: ''
                };
            });
        }

        // Handle project selection from dropdown
        function selectProject(project, event) {
            // Prevent default link behavior
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            vm.selectedProject = project;
            
            // Close the dropdown
            var dropdownToggle = document.querySelector('.project-dropdown-toggle');
            if (dropdownToggle) {
                var parent = dropdownToggle.closest('.dropdown');
                var dropdownMenu = parent ? parent.querySelector('.dropdown-menu') : null;
                
                dropdownToggle.classList.remove('show');
                dropdownToggle.setAttribute('aria-expanded', 'false');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            }
            
            // Load settings for selected project
            if (project && project.uuid) {
                onProjectChange(project);
            }
        }

        // Handle project change
        function onProjectChange(project) {
            if (project && project.uuid) {
                // Navigate to project-specific settings page using backend route
                window.location.href = '/dashboard/settings/project/' + project.uuid;
            } else {
                // Navigate to general settings page
                window.location.href = '/dashboard/settings';
            }
        }

        // Get project initials for display
        function getProjectInitials(name) {
            if (!name) return '';
            var words = name.trim().split(/\s+/);
            if (words.length >= 2) {
                return (words[0][0] + words[1][0]).toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }

        // Save settings
        function saveSettings() {
            if (!vm.selectedProject || !vm.selectedProject.uuid) {
                utils.alertError('Error', 'Please select a project first');
                return;
            }

            vm.saving = true;

            // Build settings object from form
            var settings = {
                timezone: vm.settings.timezone,
                date_format: vm.settings.date_format || 'human',
                time_format: parseInt(vm.settings.time_format) || 12,
                week_starts_on: parseInt(vm.settings.week_starts_on) || 1,
                admin_email: vm.settings.admin_email,
                projectUuid: vm.selectedProject.uuid
            };

            // Send to server
            fetch('/dashboard/settings?project=' + vm.selectedProject.uuid, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(settings)
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                $timeout(function() {
                    vm.saving = false;
                }, 0);

                if (data.success) {
                    utils.alertSuccess('Success', 'Settings saved successfully');
                    // Reload settings to reflect changes
                    loadSettings(vm.selectedProject.uuid);
                } else {
                    var errorMsg = data.message || 'Failed to save settings';
                    if (data.errors) {
                        var firstError = Object.values(data.errors)[0];
                        errorMsg = firstError || errorMsg;
                    }
                    utils.alertError('Error', errorMsg);
                }
            })
            .catch(function(error) {
                $timeout(function() {
                    vm.saving = false;
                }, 0);
                console.error('Error saving settings:', error);
                utils.alertError('Error', 'Failed to save settings. Please try again.');
            });
        }
    }
})();

