(function () {
    'use strict';
    angular
        .module('app')
        .controller('PostsController', PostsController);

    PostsController.$inject = ['$scope', '$http', 'brudexservices', 'brudexutils', '$timeout'];

    function PostsController($scope, $http, services, utils, $timeout) {
        var vm = this;
        // Properties
        vm.projects = [];
        vm.posts = [];
        vm.accounts = [];
        vm.tags = [];
        vm.selectedProject = null;
        vm.loading = false;
        vm.filter = {
            keyword: '',
            status: null,
            tags: [],
            accounts: []
        };
        vm.pagination = {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        };
        vm.hasFailedPosts = false;
        vm.selectedPosts = [];
        vm.previewPost = null;
        vm.showPreview = false;
        vm.searchTimeout = null;

        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.loadPosts = loadPosts;
        vm.onProjectChange = onProjectChange;
        vm.selectProject = selectProject;
        vm.getProjectInitials = getProjectInitials;
        vm.applyFilters = applyFilters;
        vm.clearFilters = clearFilters;
        vm.changeStatusFilter = changeStatusFilter;
        vm.togglePostSelection = togglePostSelection;
        vm.toggleSelectAll = toggleSelectAll;
        vm.openPreview = openPreview;
        vm.closePreview = closePreview;
        vm.deletePost = deletePost;
        vm.deleteSelectedPosts = deleteSelectedPosts;
        vm.getStatusText = getStatusText;
        vm.getStatusClass = getStatusClass;
        vm.getPostContent = getPostContent;
        vm.getPostMedia = getPostMedia;
        vm.formatDate = formatDate;
        vm.editPost = editPost;
        vm.getAccountVersion = getAccountVersion;
        vm.getPlainText = getPlainText;
        vm.truncateContent = truncateContent;
        vm.getRecurringScheduleLabel = getRecurringScheduleLabel;
        vm.openPreviewFromMenu = openPreviewFromMenu;

        // Initialize
        function init(projects, currentProject, projectUuid) {
            vm.posts = [];
            vm.accounts = [];
            vm.tags = [];
            vm.projects = projects || [];
            vm.filter = {
                keyword: '',
                status: null,
                tags: [],
                accounts: []
            };
            vm.pagination = {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0
            };
            vm.hasFailedPosts = false;
            vm.selectedProject = currentProject || null;

            // Load projects if not provided
            if (!vm.projects || vm.projects.length === 0) {
                loadProjects();
            }
            // Initialize selected posts array
            vm.selectedPosts = [];
            // If a project is selected, load posts
            if (vm.selectedProject && vm.selectedProject.uuid) {
                loadPosts();
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

        // Load posts with filters
        function loadPosts() {
            if (!vm.selectedProject || !vm.selectedProject.uuid) {
                vm.loading = false;
                vm.posts = [];
                return;
            }

            vm.loading = true;
            var params = {
                page: vm.pagination.currentPage
            };

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

            // Use the new API endpoint with projectUuid in the path
            var url = '/dashboard/api/posts/list/' + vm.selectedProject.uuid;

            $http.get(url, { params: params }).then(function(response) {
                vm.loading = false;
                if (response.data.success) {
                    vm.posts = response.data.data || [];
                    if (response.data.meta) {
                        vm.pagination = {
                            currentPage: response.data.meta.current_page || 1,
                            totalPages: response.data.meta.last_page || 1,
                            totalItems: response.data.meta.total || 0
                        };
                    }
                    if (response.data.has_failed_posts !== undefined) {
                        vm.hasFailedPosts = response.data.has_failed_posts;
                    }
                    // Update accounts and tags from response
                    if (response.data.accounts) {
                        vm.accounts = response.data.accounts;
                    }
                    if (response.data.tags) {
                        vm.tags = response.data.tags;
                    }
                    vm.selectedPosts = []; // Clear selection when posts reload
                } else {
                    utils.alertError('Error', response.data.message || 'Failed to load posts');
                }
            }).catch(function(error) {
                vm.loading = false;
                console.error('Error loading posts:', error);
                utils.alertError('Error', 'Failed to load posts');
            });
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
                        // Fallback
                        dropdownToggle.classList.remove('show');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                        if (dropdownMenu) {
                            dropdownMenu.classList.remove('show');
                        }
                    }
                }, 0);
            }
            
            // Reload posts for selected project
            vm.pagination.currentPage = 1;
            loadPosts();
        }

        // Handle project change
        function onProjectChange() {
            vm.pagination.currentPage = 1;
            loadPosts();
        }

        // Apply filters
        function applyFilters() {
            vm.pagination.currentPage = 1;
            loadPosts();
        }

        // Apply filters with debounce for search input
        function applyFiltersDebounced() {
            if (vm.searchTimeout) {
                $timeout.cancel(vm.searchTimeout);
            }
            vm.searchTimeout = $timeout(function() {
                vm.applyFilters();
            }, 300); // Wait 300ms after user stops typing
        }
        vm.applyFiltersDebounced = applyFiltersDebounced;

        // Clear filters
        function clearFilters(event) {
            if (event) {
                event.preventDefault();
            }
            vm.filter = {
                keyword: '',
                status: null,
                tags: [],
                accounts: []
            };
            vm.pagination.currentPage = 1;
            loadPosts();
        }

        // Change status filter (from tabs)
        function changeStatusFilter(status) {
            vm.filter.status = status;
            vm.pagination.currentPage = 1;
            loadPosts();
        }

        // Toggle post selection (uses uuid; API list payload does not include numeric id)
        function togglePostSelection(postUuid) {
            var index = vm.selectedPosts.indexOf(postUuid);
            if (index > -1) {
                vm.selectedPosts.splice(index, 1);
            } else {
                vm.selectedPosts.push(postUuid);
            }
        }

        // Toggle select all posts on current page
        function toggleSelectAll() {
            if (vm.selectedPosts.length === vm.posts.length) {
                vm.selectedPosts = [];
            } else {
                vm.selectedPosts = vm.posts.map(function(post) {
                    return post.uuid;
                });
            }
        }

        function truncateContent(text, maxLength) {
            maxLength = maxLength || 20;
            if (!text) {
                return '';
            }
            var plain = String(text).replace(/<[^>]*>/g, '').trim();
            if (plain.length <= maxLength) {
                return plain;
            }
            return plain.substring(0, maxLength) + '...';
        }

        function formatRecurringTime(timeVal) {
            if (!timeVal) {
                return '';
            }
            var str = String(timeVal);
            var parts = str.split(':');
            var hour = parseInt(parts[0], 10);
            var minute = parseInt(parts[1], 10);
            if (isNaN(hour) || isNaN(minute)) {
                return '';
            }
            var hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            var ampm = hour >= 12 ? 'pm' : 'am';
            return hour12 + ':' + String(minute).padStart(2, '0') + ampm;
        }

        function getRecurringScheduleLabel(post) {
            if (!post || !post.recurringType) {
                return '';
            }
            var timeLabel = formatRecurringTime(post.recurringTime);
            if (post.recurringType === 1) {
                return timeLabel ? 'Daily ' + timeLabel : 'Daily';
            }
            if (post.recurringType === 2) {
                var dayMap = { MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu', FRI: 'Fri', SAT: 'Sat', SUN: 'Sun' };
                var days = '';
                if (post.recurringDays) {
                    days = String(post.recurringDays).split(',')
                        .map(function (d) { return dayMap[d.trim().toUpperCase()] || d.trim(); })
                        .filter(Boolean)
                        .join(', ');
                }
                var label = 'Weekly';
                if (days) {
                    label += ' ' + days;
                }
                if (timeLabel) {
                    label += ' ' + timeLabel;
                }
                return label;
            }
            return '';
        }

        function openPreviewFromMenu(post, $event) {
            if ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }
            openPreview(post);
        }

        // Open post preview modal
        function openPreview(post) {
            vm.previewPost = post;
            vm.showPreview = true;
        }

        // Close post preview modal
        function closePreview() {
            vm.previewPost = null;
            vm.showPreview = false;
        }

        // Delete single post
        function deletePost(postUuid) {
            utils.alertConfirm('Confirm', 'Are you sure you want to delete this post?', function(result) {
                if (result.isConfirmed) {
                    $http.get('/dashboard/api/posts/delete/' + postUuid).then(function(response) {
                    if (response.data.success) {
                        utils.alertSuccess('Success', 'Post deleted successfully');
                        loadPosts();
                    } else {
                        utils.alertError('Error', response.data.message || 'Failed to delete post');
                    }
                }).catch(function(error) {
                    console.error('Error deleting post:', error);
                    utils.alertError('Error', 'Failed to delete post');
                });
                }
            }, {
                icon: 'warning',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel'
            });
        }

        // Delete selected posts
        function deleteSelectedPosts() {
            if (vm.selectedPosts.length === 0) {
                return;
            }

            var postCount = vm.selectedPosts.length;
            var message = 'Are you sure you want to delete ' + postCount + ' selected post(s)?';
            
            utils.alertConfirm('Confirm Delete', message, function(result) {
                if (result.isConfirmed) {
                var postUuids = vm.posts.filter(function(post) {
                    return vm.selectedPosts.indexOf(post.uuid) > -1;
                }).map(function(post) {
                    return post.uuid;
                });

                    $http.post('/dashboard/api/posts/delete-multiple', {
                        posts: postUuids,
                        status: vm.filter.status
                }).then(function(response) {
                    if (response.data.success) {
                        utils.alertSuccess('Success', 'Selected posts deleted successfully');
                        vm.selectedPosts = [];
                        loadPosts();
                    } else {
                        utils.alertError('Error', response.data.message || 'Failed to delete posts');
                    }
                }).catch(function(error) {
                    console.error('Error deleting posts:', error);
                    utils.alertError('Error', 'Failed to delete posts');
                });
                }
            }, {
                icon: 'warning',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel'
            });
        }

        // Get status text
        function getStatusText(status) {
            var statuses = {
                0: 'Draft',
                1: 'Scheduled',
                2: 'Published',
                3: 'Failed'
            };
            return statuses[status] || 'Unknown';
        }

        // Get status class
        function getStatusClass(status) {
            var classes = {
                0: 'badge-secondary',
                1: 'badge-info',
                2: 'badge-success',
                3: 'badge-danger'
            };
            return classes[status] || 'badge-secondary';
        }

        // Get status badge style (for inline styling)
        vm.getStatusBadgeStyle = function(status) {
            var styles = {
                0: 'background: linear-gradient(135deg, rgba(107, 114, 128, 0.2) 0%, rgba(107, 114, 128, 0.15) 100%); color: #B0B0B0; border: 1px solid rgba(107, 114, 128, 0.3);',
                1: 'background: linear-gradient(135deg, rgba(0, 239, 255, 0.2) 0%, rgba(0, 239, 255, 0.15) 100%); color: #00EFFF; border: 1px solid rgba(0, 239, 255, 0.3);',
                2: 'background: linear-gradient(135deg, rgba(198, 255, 0, 0.2) 0%, rgba(198, 255, 0, 0.15) 100%); color: #C6FF00; border: 1px solid rgba(198, 255, 0, 0.3);',
                3: 'background: linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(255, 0, 0, 0.15) 100%); color: #FF6B6B; border: 1px solid rgba(255, 0, 0, 0.3);'
            };
            return styles[status] || styles[0];
        };

        // Get post content excerpt
        function getPostContent(post) {
            // Use content.excerpt if available (from API response)
            if (post.content && post.content.excerpt) {
                return post.content.excerpt;
            }
            
            if (!post.versions || post.versions.length === 0) {
                return '';
            }
            
            var version = post.versions[0];
            if (version.content) {
                // Remove HTML tags and get excerpt
                var plainText = version.content.replace(/<[^>]*>/g, '').trim();
                return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
            }
            return '';
        }

        // Get post media
        function getPostMedia(post) {
            // Use content.media if available (from API response)
            if (post.content && post.content.media && post.content.media.length > 0) {
                return {
                    first: post.content.media[0],
                    count: post.content.media_count || post.content.media.length
                };
            }
            
            if (!post.versions || post.versions.length === 0) {
                return null;
            }
            
            var version = post.versions[0];
            if (version.media && Array.isArray(version.media) && version.media.length > 0) {
                    return {
                    first: version.media[0],
                    count: version.media.length
                    };
            }
            return null;
        }

        // Format date
        function formatDate(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function formatCreatedDate(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
        vm.formatCreatedDate = formatCreatedDate;

        // Edit post
        function editPost(postUuid) {
            window.location.href = '/dashboard/posts/edit/' + postUuid;
        }

        // Get version content for a specific account
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
            // Version.content is a string (body), and version.media is an array of UUIDs
            // We need to convert this to the format expected by preview partials: { body: string, media: array }
            var content = {
                body: accountVersion.content || '',
                media: []
            };

            // If media is an array of UUIDs, we need to get the actual media objects
            if (accountVersion.media && Array.isArray(accountVersion.media)) {
                // Try to get media from post.content.media if available
                if (post.content && post.content.media && Array.isArray(post.content.media)) {
                    content.media = post.content.media.filter(function(media) {
                        return accountVersion.media.indexOf(media.uuid || media.id) > -1;
                    });
                } else {
                    // Fallback: create media objects from UUIDs (will need to be resolved)
                    content.media = accountVersion.media.map(function(uuid) {
                        return { uuid: uuid, url: '/api/media/' + uuid };
                    });
                }
            }

            return content;
        }

        // Convert HTML to plain text (same as PostEditController)
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

        // Get project initials
        function getProjectInitials(name) {
            if (!name) return '';
            var parts = name.split(' ');
            if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }

        // Get pagination pages array
        function getPages() {
            var pages = [];
            for (var i = 1; i <= vm.pagination.totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }
        vm.getPages = getPages;

        vm.getCurrentPage = function () {
            return vm.pagination.currentPage;
        };

        vm.setCurrentPage = function (page) {
            vm.pagination.currentPage = page;
            loadPosts();
        };

        vm.getTotalPages = function () {
            return vm.pagination.totalPages;
        };
    }
})();

