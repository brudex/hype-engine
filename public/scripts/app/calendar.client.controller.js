(function () {
    'use strict';
    angular
        .module('app')
        .controller('CalendarController', CalendarController);

    CalendarController.$inject = ['$scope', '$http', 'brudexservices', 'brudexutils', '$timeout'];

    function CalendarController($scope, $http, services, utils, $timeout) {
        var vm = this;

        // Properties
        vm.projects = [];
        vm.posts = [];
        vm.accounts = [];
        vm.tags = [];
        vm.selectedProject = null;
        vm.loading = false;
        vm.calendarType = 'month'; // 'month', 'week', or 'day'
        vm.selectedDate = null;
        vm.currentMonth = null;
        vm.currentYear = null;
        vm.calendarDays = []; // Array of day objects for grid
        vm.timeSlots = []; // Array of time slots for week view (hours)
        vm.timeFormat = 12; // 12 or 24 hour format
        vm.filter = {
            keyword: '',
            status: null,
            tags: [],
            accounts: []
        };
        vm.currentProject = null;
        vm.weekStartsOn = 1; // Monday = 1, Sunday = 0
        vm.showTimePicker = false;
        vm.timePickerDate = '';
        vm.timePickerTime = '';

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.loadCalendarData = loadCalendarData;
        vm.loadAccounts = loadAccounts;
        vm.loadTags = loadTags;
        vm.onProjectChange = onProjectChange;
        vm.selectProject = selectProject;
        vm.getProjectInitials = getProjectInitials;
        vm.changeCalendarType = changeCalendarType;
        vm.changeDate = changeDate;
        vm.navigateMonth = navigateMonth;
        vm.navigateWeek = navigateWeek;
        vm.applyFilters = applyFilters;
        vm.clearFilters = clearFilters;
        vm.formatDate = formatDate;
        vm.getPostStatusClass = getPostStatusClass;
        vm.getPostStatusText = getPostStatusText;
        vm.getDayPosts = getDayPosts;
        vm.getPostsForTimeSlot = getPostsForTimeSlot;
        vm.isToday = isToday;
        vm.isDatePast = isDatePast;
        vm.isTimePast = isTimePast;
        vm.createPostForDate = createPostForDate;
        vm.createPostForTimeSlot = createPostForTimeSlot;
        vm.getMonthName = getMonthName;
        vm.getPostContent = getPostContent;
        vm.openPostPreview = openPostPreview;
        vm.closePostPreview = closePostPreview;
        vm.getAccountVersion = getAccountVersion;
        vm.getPlainText = getPlainText;
        vm.openTimePicker = openTimePicker;
        vm.closeTimePicker = closeTimePicker;
        vm.onDateTimeSelect = onDateTimeSelect;
        vm.formatDateForDisplay = formatDateForDisplay;

        // Initialize
        function init(projects, currentProject) {
            // Initialize with defaults
            vm.posts = [];
            vm.accounts = [];
            vm.tags = [];
            vm.projects = projects || [];
            vm.currentProject = currentProject || null;
            vm.selectedDate = new Date().toISOString().split('T')[0];
            vm.calendarType = 'month'; // Default to month view
            vm.filter = {
                keyword: '',
                status: null,
                tags: [],
                accounts: []
            };

            // Set selected project if currentProject exists
            if (vm.currentProject) {
                vm.selectedProject = vm.currentProject;
                // Load accounts and tags for the selected project
                loadAccounts(vm.currentProject.uuid);
                loadTags(vm.currentProject.uuid);
            }

            // Initialize current month/year
            var date = new Date(vm.selectedDate + 'T00:00:00');
            vm.currentMonth = date.getMonth();
            vm.currentYear = date.getFullYear();

            // Load projects if not provided
            if (!vm.projects || vm.projects.length === 0) {
                loadProjects();
            }

            // Generate calendar grid
            generateCalendarGrid();

            
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

        // Load accounts for a project
        function loadAccounts(projectUuid) {
            if (!projectUuid) {
                vm.accounts = [];
                return;
            }
            console.log('Loading accounts for project:', projectUuid);
            services.getAccounts(projectUuid, function(response) {
                console.log('Accounts loaded:', response);
                if (response.success) {
                    vm.accounts = response.data || [];
                } else {
                    console.error('Failed to load accounts:', response.message);
                    vm.accounts = [];
                }
            });
        }

        // Load tags for a project
        function loadTags(projectUuid) {
            console.log('Loading tags for project:', projectUuid);
            if (!projectUuid) {
                vm.tags = [];
                return;
            }
            services.getTagsByProject(projectUuid, function(response) {
                console.log('Tags loaded:', response);
                if (response.success) {
                    vm.tags = response.data || [];
                } else {
                    console.error('Failed to load tags:', response.message);
                    vm.tags = [];
                }
            });
        }

        // Load calendar data via API
        function loadCalendarData() {
            vm.loading = true;

            var params = {
                date: vm.selectedDate,
                type: vm.calendarType
            };

            if (vm.selectedProject && vm.selectedProject.uuid) {
                params.projectUuid = vm.selectedProject.uuid;
            }

            if (vm.filter.keyword) {
                params.keyword = vm.filter.keyword;
            }

            if (vm.filter.status !== null && vm.filter.status !== undefined && vm.filter.status !== '') {
                params.status = vm.filter.status;
            }

            if (vm.filter.tags && vm.filter.tags.length > 0) {
                params.tags = vm.filter.tags;
            }

            if (vm.filter.accounts && vm.filter.accounts.length > 0) {
                params.accounts = vm.filter.accounts;
            }

            services.getCalendarData(params, function(response) {
                vm.loading = false;
                if (response.success) {
                    console.log("Calendar Data is >>>",response.data);
                    // Format posts: split scheduledAt into date and time
                    var formattedPosts = (response.data.posts || []).map(function(post) {
                        var scheduledDate = post.scheduledAt ? new Date(post.scheduledAt) : null;
                        var formattedPost = {
                            id: post.id,
                            uuid: post.uuid,
                            status: post.status,
                            scheduleStatus: post.scheduleStatus,
                            publishedAt: post.publishedAt,
                            accounts: post.accounts || [],
                            tags: post.tags || [],
                            versions: post.versions || []
                        };
                        
                        // Split scheduledAt into date and time
                        if (scheduledDate && !isNaN(scheduledDate.getTime())) {
                            formattedPost.scheduled_at = {
                                date: scheduledDate.toISOString().split('T')[0],
                                time: scheduledDate.toTimeString().split(' ')[0].substring(0, 5)
                            };
                            formattedPost.scheduledAt = post.scheduledAt; // Keep original for reference
                        } else {
                            formattedPost.scheduled_at = {
                                date: null,
                                time: null
                            };
                            formattedPost.scheduledAt = null;
                        }
                        
                        return formattedPost;
                    });
                    
                    vm.posts = formattedPosts;
                    vm.selectedDate = response.data.selectedDate;
                    vm.calendarType = response.data.type;
                    
                    // Regenerate calendar grid with new posts
                    generateCalendarGrid();
                } else {
                    utils.alertError('Error', response.message || 'Failed to load calendar data');
                }
            });
        }

        // Generate calendar grid days
        function generateCalendarGrid() {
            if (vm.calendarType === 'month') {
                generateMonthGrid();
            } else if (vm.calendarType === 'week') {
                generateWeekGrid();
            }
        }

        // Generate month grid
        function generateMonthGrid() {
            var date = new Date(vm.currentYear, vm.currentMonth, 1);
            var daysInMonth = new Date(vm.currentYear, vm.currentMonth + 1, 0).getDate();
            var firstDay = new Date(vm.currentYear, vm.currentMonth, 1);
            var lastDay = new Date(vm.currentYear, vm.currentMonth, daysInMonth);
            
            // Get first day of week (0 = Sunday, 1 = Monday, etc.)
            var firstDayOfWeek = firstDay.getDay();
            var startOffset = vm.weekStartsOn === 1 
                ? (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)
                : firstDayOfWeek;

            // Previous month days
            var prevMonth = new Date(vm.currentYear, vm.currentMonth - 1, 0);
            var prevMonthDays = prevMonth.getDate();
            var previousDays = [];
            for (var i = startOffset - 1; i >= 0; i--) {
                var day = prevMonthDays - i;
                var dateStr = formatDateString(vm.currentYear, vm.currentMonth - 1, day);
                previousDays.push({
                    date: dateStr,
                    day: day,
                    isCurrentMonth: false,
                    isDisabled: isDatePast(dateStr),
                    posts: getDayPosts(dateStr)
                });
            }

            // Current month days
            var currentDays = [];
            for (var j = 1; j <= daysInMonth; j++) {
                var dateStr2 = formatDateString(vm.currentYear, vm.currentMonth, j);
                currentDays.push({
                    date: dateStr2,
                    day: j,
                    isCurrentMonth: true,
                    isDisabled: isDatePast(dateStr2),
                    posts: getDayPosts(dateStr2)
                });
            }

            // Next month days (to fill the grid)
            var totalDays = previousDays.length + currentDays.length;
            var remainingDays = 42 - totalDays; // 6 rows * 7 days
            var nextDays = [];
            for (var k = 1; k <= remainingDays; k++) {
                var dateStr3 = formatDateString(vm.currentYear, vm.currentMonth + 1, k);
                nextDays.push({
                    date: dateStr3,
                    day: k,
                    isCurrentMonth: false,
                    isDisabled: false,
                    posts: getDayPosts(dateStr3)
                });
            }

            vm.calendarDays = previousDays.concat(currentDays).concat(nextDays);
        }

        // Generate week grid with time slots
        function generateWeekGrid() {
            var date = new Date(vm.selectedDate + 'T00:00:00');
            var dayOfWeek = date.getDay();
            var diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            var startOfWeek = new Date(date);
            startOfWeek.setDate(diff);
            
            // Generate week days
            var weekDays = [];
            for (var i = 0; i < 7; i++) {
                var weekDate = new Date(startOfWeek);
                weekDate.setDate(startOfWeek.getDate() + i);
                var dateStr = weekDate.toISOString().split('T')[0];
                weekDays.push({
                    date: dateStr,
                    day: weekDate.getDate(),
                    dayName: weekDate.toLocaleDateString('en-US', { weekday: 'short' }),
                    isCurrentMonth: true,
                    isDisabled: isDatePast(dateStr)
                });
            }
            vm.calendarDays = weekDays;
            
            // Generate time slots (hours from 0 to 23)
            var times = [];
            for (var h = 0; h < 24; h++) {
                var hour24 = h.toString().padStart(2, '0') + ':00';
                var hour12 = convertTo12Hour(hour24);
                times.push({
                    hour24: hour24,
                    hour12: hour12,
                    hour: h
                });
            }
            vm.timeSlots = times;
        }
        
        // Convert 24-hour time to 12-hour format
        function convertTo12Hour(time24) {
            var parts = time24.split(':');
            var hour = parseInt(parts[0]);
            var minute = parts[1];
            var period = hour >= 12 ? 'pm' : 'am';
            var hour12 = hour % 12;
            if (hour12 === 0) hour12 = 12;
            return hour12 + ':' + minute + ' ' + period;
        }
        
        // Get posts for a specific date and time slot
        function getPostsForTimeSlot(dateStr, hour) {
            if (!vm.posts || !dateStr) return [];
            return vm.posts.filter(function(post) {
                if (!post.scheduled_at || !post.scheduled_at.date || !post.scheduled_at.time) return false;
                if (post.scheduled_at.date !== dateStr) return false;
                
                // Extract hour from time (HH:mm format)
                var timeParts = post.scheduled_at.time.split(':');
                var postHour = parseInt(timeParts[0]);
                return postHour === hour;
            });
        }


        // Format date string
        function formatDateString(year, month, day) {
            var date = new Date(year, month, day);
            return date.toISOString().split('T')[0];
        }

        // Get posts for a specific day
        function getDayPosts(dateStr) {
            if (!vm.posts || !dateStr) return [];
            return vm.posts.filter(function(post) {
                if (!post.scheduled_at || !post.scheduled_at.date) return false;
                return post.scheduled_at.date === dateStr;
            });
        }
        
        // Check if time is in the past
        function isTimePast(dateStr, hour) {
            if (!dateStr) return false;
            var today = new Date().toISOString().split('T')[0];
            var now = new Date();
            var currentHour = now.getHours();
            
            if (dateStr < today) return true;
            if (dateStr === today && hour < currentHour) return true;
            return false;
        }
        
        // Create post for specific date and time slot
        function createPostForTimeSlot(dateStr, timeStr) {
            if (!dateStr || !timeStr) return;
            if (!vm.selectedProject) {
                utils.alertError('Error', 'Please select a project first');
                return;
            }
            var scheduleAt = dateStr + ' ' + timeStr;
            window.location.href = '/dashboard/posts/create/' + vm.selectedProject.uuid + '/' + encodeURIComponent(scheduleAt);
        }

        // Check if date is today
        function isToday(dateStr) {
            if (!dateStr) return false;
            var today = new Date().toISOString().split('T')[0];
            return dateStr === today;
        }

        // Check if date is in the past
        function isDatePast(dateStr) {
            if (!dateStr) return false;
            var today = new Date().toISOString().split('T')[0];
            return dateStr < today;
        }

        // Navigate to previous/next month
        function navigateMonth(direction) {
            if (direction === 'prev') {
                vm.currentMonth--;
                if (vm.currentMonth < 0) {
                    vm.currentMonth = 11;
                    vm.currentYear--;
                }
            } else {
                vm.currentMonth++;
                if (vm.currentMonth > 11) {
                    vm.currentMonth = 0;
                    vm.currentYear++;
                }
            }
            
            // Set selected date to first day of new month
            var newDate = new Date(vm.currentYear, vm.currentMonth, 1);
            vm.selectedDate = newDate.toISOString().split('T')[0];
            loadCalendarData();
        }

        // Navigate to previous/next week
        function navigateWeek(direction) {
            var date = new Date(vm.selectedDate + 'T00:00:00');
            if (direction === 'prev') {
                date.setDate(date.getDate() - 7);
            } else {
                date.setDate(date.getDate() + 7);
            }
            vm.selectedDate = date.toISOString().split('T')[0];
            loadCalendarData();
        }

        // Handle project selection from dropdown
        function selectProject(project, event) {
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
                
                // Also use Bootstrap API
                $timeout(function() {
                    try {
                        var dropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
                        if (dropdown) {
                            dropdown.hide();
                        }
                    } catch (e) {
                        // Fallback: ensure it's closed
                        dropdownToggle.classList.remove('show');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                        if (dropdownMenu) {
                            dropdownMenu.classList.remove('show');
                        }
                    }
                }, 0);
            }
            
            // If no project selected, clear posts and regenerate grid
            if (!project) {
                vm.posts = [];
                vm.accounts = [];
                vm.tags = [];
                generateCalendarGrid();
            } else {
                // Load accounts and tags for selected project
                loadAccounts(project.uuid);
                loadTags(project.uuid);
                // Reload calendar data for selected project
                loadCalendarData();
            }
        }

        // Handle project change
        function onProjectChange() {
            loadCalendarData();
        }

        // Change calendar type (month/week/day)
        function changeCalendarType(type) {
            vm.calendarType = type;
            generateCalendarGrid();
            loadCalendarData();
        }

        // Change selected date
        function changeDate(date) {
            vm.selectedDate = date;
            var dateObj = new Date(date + 'T00:00:00');
            vm.currentMonth = dateObj.getMonth();
            vm.currentYear = dateObj.getFullYear();
            generateCalendarGrid();
            loadCalendarData();
        }

        // Apply filters
        function applyFilters($event) {
            if ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }
            loadCalendarData();
        }

        // Clear all filters
        function clearFilters($event) {
            if ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }
            vm.filter = {
                keyword: '',
                status: null,
                tags: [],
                accounts: []
            };
            loadCalendarData();
        }

        // Format date for display
        function formatDate(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        // Get month name
        function getMonthName() {
            var date = new Date(vm.currentYear, vm.currentMonth, 1);
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

        // Get post status CSS class
        function getPostStatusClass(status) {
            var classes = {
                0: 'badge-secondary',
                1: 'badge-info',
                2: 'badge-success',
                3: 'badge-danger'
            };
            return classes[status] || 'badge-secondary';
        }

        // Get post status text
        function getPostStatusText(status) {
            var texts = {
                0: 'Draft',
                1: 'Scheduled',
                2: 'Published',
                3: 'Failed'
            };
            return texts[status] || 'Unknown';
        }

        // Create post for a specific date - opens time picker modal
        function createPostForDate(dateStr) {
            if (!dateStr) return;
            if (!vm.selectedProject) {
                utils.alertError('Error', 'Please select a project first');
                return;
            }
            vm.timePickerDate = dateStr;
            vm.timePickerTime = '';
            openTimePicker();
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

        // Get post content from original version (first 30 chars with ellipses)
        function getPostContent(post) {
            if (!post || !post.versions || post.versions.length === 0) {
                return '';
            }

            // Find the original version
            var originalVersion = post.versions.find(function(version) {
                return version.isOriginal === true;
            });

            // If no original version found, use the first version
            if (!originalVersion && post.versions.length > 0) {
                originalVersion = post.versions[0];
            }

            if (!originalVersion) {
                return '';
            }

            // Get content - it's stored as TEXT directly, not as object with body
            var content = '';
            if (originalVersion.content) {
                // Content is stored as string (TEXT field)
                if (typeof originalVersion.content === 'string') {
                    content = originalVersion.content;
                } else if (originalVersion.content.body) {
                    // Fallback: if it's an object with body property
                    content = originalVersion.content.body || '';
                }
            }

            if (!content || content.trim() === '') {
                return '';
            }

            // Remove HTML tags
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            var textContent = tempDiv.textContent || tempDiv.innerText || '';

            // Clean up whitespace
            textContent = textContent.replace(/\s+/g, ' ').trim();

            if (!textContent) {
                return '';
            }

            // Truncate to 30 characters and add ellipses if longer
            if (textContent.length > 30) {
                return textContent.substring(0, 30) + '...';
            }

            return textContent;
        }

        // Post preview methods
        vm.showPostPreview = false;
        vm.previewPost = null;

        function openPostPreview(post) {
            vm.previewPost = post;
            vm.showPostPreview = true;
        }

        function closePostPreview() {
            vm.showPostPreview = false;
            vm.previewPost = null;
        }

        function getAccountVersion(post, account) {
            if (!post || !post.versions || !account) {
                return null;
            }

            // Find version for this account
            var accountVersion = post.versions.find(function(version) {
                return version.accountUuid === account.uuid || 
                       version.accountId === account.id ||
                       (version.accountUuid === account.uuid && !version.isOriginal);
            });

            // If no account-specific version found, use original
            if (!accountVersion) {
                accountVersion = post.versions.find(function(version) {
                    return version.isOriginal || version.accountUuid === '' || version.accountId === 0;
                });
            }

            if (!accountVersion || !accountVersion.content) {
                return null;
            }

            // Extract content from version
            // Version.content is a string (body), and version.media is an array
            var content = {
                body: accountVersion.content || '',
                media: accountVersion.media || []
            };

            return content;
        }

        function getPlainText(html) {
            if (!html) return '';
            
            if (typeof html !== 'string') {
                html = String(html);
            }
            
            if (html.indexOf('<') === -1 && html.indexOf('&') === -1) {
                return html.trim();
            }
            
            try {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                var text = tempDiv.textContent || tempDiv.innerText || '';
                
                if (!text && tempDiv.innerHTML) {
                    var scripts = tempDiv.querySelectorAll('script, style');
                    for (var i = 0; i < scripts.length; i++) {
                        scripts[i].parentNode.removeChild(scripts[i]);
                    }
                    text = tempDiv.textContent || tempDiv.innerText || '';
                }
                
                text = text.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
                return text;
            } catch (e) {
                return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
            }
        }

        // Time Picker Modal Methods
        function openTimePicker() {
            // Initialize date if not set
            if (!vm.timePickerDate) {
                var now = new Date();
                var year = now.getFullYear();
                var month = String(now.getMonth() + 1).padStart(2, '0');
                var day = String(now.getDate()).padStart(2, '0');
                vm.timePickerDate = year + '-' + month + '-' + day;
            }
            vm.showTimePicker = true;
            
            // Trigger datepicker re-initialization after modal is shown
            $timeout(function() {
                var modalElement = document.getElementById('timePickerModal');
                if (modalElement) {
                    var dateTimePickerElement = modalElement.querySelector('date-time-picker');
                    if (dateTimePickerElement) {
                        // Trigger Angular digest to re-initialize directive
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
            }, 100);
        }

        function closeTimePicker() {
            vm.showTimePicker = false;
            vm.timePickerDate = '';
            vm.timePickerTime = '';
        }

        function onDateTimeSelect(date, time) {
            if (!date) {
                date = vm.timePickerDate;
            }
            if (!time) {
                time = vm.timePickerTime;
            }
            
            if (!vm.selectedProject) {
                utils.alertError('Error', 'Please select a project first');
                closeTimePicker();
                return;
            }
            
            if (!date) {
                utils.alertError('Error', 'Please select a date');
                return;
            }
            
            if (!time) {
                utils.alertError('Error', 'Please select a time');
                return;
            }
            
            // Format schedule time and redirect
            var scheduleAt = date + ' ' + time;
            window.location.href = '/dashboard/posts/create/' + vm.selectedProject.uuid + '/' + encodeURIComponent(scheduleAt);
        }

        function formatDateForDisplay(dateStr) {
            if (!dateStr) return '';
            try {
                var date = new Date(dateStr + 'T00:00:00');
                if (isNaN(date.getTime())) return dateStr;
                
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                
                var dayName = days[date.getDay()];
                var monthName = months[date.getMonth()];
                var day = date.getDate();
                var year = date.getFullYear();
                
                return dayName + ', ' + monthName + ' ' + day + ', ' + year;
            } catch (e) {
                return dateStr;
            }
        }
    }
})();
