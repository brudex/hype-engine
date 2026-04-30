(function () {
    'use strict';
    angular
        .module('app')
        .controller('PostEditController', PostEditController);

    PostEditController.$inject = ['$scope', '$http', 'brudexservices', 'brudexutils', '$timeout'];

    function PostEditController($scope, $http, services, utils, $timeout) {
        var vm = this;

        // ============================================
        // PROPERTIES
        // ============================================
        vm.post = null;
        vm.accounts = [];
        vm.tags = [];
        vm.currentProject = null;
        vm.loading = false;
        vm.saving = false;
        vm.hasError = false;
        vm.showPreview = true;
        vm.activeTab = 'preview';
        vm.searchTagQuery = '';
        vm.previewUpdateInterval = null;
        vm.lastContentHash = '';
        vm.loadingTags = false;
        vm.selectedMedia = [];
        vm.activeMediaTab = 'upload';
        vm.currentMediaAccountId = null;
        
        // Form data
        vm.form = {
            accounts: [],
            versions: [],
            tags: [],
            date: '',
            time: ''
        };
        
        vm.selectedAccounts = [];
        vm.activeVersion = 0;
        vm.currentContent = { body: '', media: [] };

        // ============================================
        // PUBLIC METHODS - Exposed to View
        // ============================================
        vm.init = init;
        vm.selectAccount = selectAccount;
        vm.isAccountSelected = isAccountSelected;
        vm.switchAccountVersion = switchAccountVersion;
        vm.togglePreview = togglePreview;
        vm.setTab = setTab;
        vm.schedule = schedule;
        vm.postNow = postNow;
        vm.addMedia = addMedia;
        vm.removeMedia = removeMedia;
        vm.reorderMedia = reorderMedia;
        vm.addTag = addTag;
        vm.removeTag = removeTag;
        vm.updateContent = updateContent;
        vm.updateCurrentContent = updateCurrentContent;
        vm.updateVersionContent = updateVersionContent;
        vm.getPostAccounts = getPostAccounts;
        vm.getPlainText = getPlainText;
        vm.getTagName = getTagName;
        vm.getTagColor = getTagColor;
        vm.getAccountVersionForPreview = getAccountVersionForPreview;
        vm.openTimePicker = openTimePicker;
        vm.clearSchedule = clearSchedule;
        vm.formatScheduleTime = formatScheduleTime;
        vm.closeTimePicker = closeTimePicker;
        vm.onDateTimeSelect = onDateTimeSelect;
        vm.openLabelsModal = openLabelsModal;
        vm.closeLabelsModal = closeLabelsModal;
        vm.toggleTag = toggleTag;
        vm.createNewTag = createNewTag;
        vm.getFilteredTags = getFilteredTags;
        vm.openMediaSelectionModal = openMediaSelectionModal;
        vm.closeMediaSelectionModal = closeMediaSelectionModal;
        vm.setMediaTab = setMediaTab;
        vm.addSelectedMediaToPost = addSelectedMediaToPost;
        vm.onMediaUploaded = onMediaUploaded;
        vm.onMediaSelected = onMediaSelected;
        vm.hasContent = hasContent;
        vm.addVersion = addVersion;
        vm.removeVersion = removeVersion;
        vm.getAvailableAccountsForVersion = getAvailableAccountsForVersion;
        vm.getVersionAccount = getVersionAccount;
        vm.openVersionPopover = openVersionPopover;
        vm.closeVersionPopover = closeVersionPopover;
        vm.isVersionPopoverOpen = false;

        // ============================================
        // INITIALIZATION
        // ============================================
        /** First arg is legacy; create.ejs always passes null — editing is post-edit.client.controller.js */
        function init(post, accounts, tags, scheduleAt, prefill, currentProject) {
            console.log('PostCreateController.init called with:', {
                accountsCount: (accounts || []).length,
                tagsCount: (tags || []).length,
                currentProject: currentProject,
                currentProjectType: typeof currentProject
            });
            
            // Ensure accounts have id field for internal mapping (fallback to uuid if id missing)
            vm.accounts = (accounts || []).map(function(account) {
                if (!account.id && account.uuid) {
                    // If id is missing but uuid exists, we need to find the account by uuid to get its id
                    // For now, use a hash of uuid as a temporary id, or use the account's database id
                    // Since we're getting accounts from server, they should have id
                    console.warn('Account missing id field:', account);
                }
                return account;
            });
            vm.tags = tags || [];
            vm.currentProject = currentProject || null;
            
            console.log('PostCreateController.init - vm.currentProject after assignment:', vm.currentProject);
            
            // Validate currentProject exists - but be more lenient (check for object with uuid)
            // Only redirect if we're absolutely sure there's no project
            // Use $timeout to allow Angular to finish initialization first
            if (!vm.currentProject || (typeof vm.currentProject === 'object' && !vm.currentProject.uuid)) {
                console.error('PostCreateController.init - No valid currentProject provided:', {
                    currentProject: vm.currentProject,
                    type: typeof vm.currentProject,
                    hasUuid: vm.currentProject && vm.currentProject.uuid
                });
                
                // Delay the redirect check to allow for any async initialization
                $timeout(function() {
                    if (!vm.currentProject || (typeof vm.currentProject === 'object' && !vm.currentProject.uuid)) {
                        console.error('PostCreateController.init - Still no valid currentProject after delay, redirecting');
                        utils.alertError('Error', 'Project is required to create posts');
                        window.location.href = '/dashboard/posts';
                        return; // Exit early if redirecting
                    }
                }, 2000);
                
                // Continue initialization even if project check is pending
                // The redirect will happen in timeout if still no project
            }
            
            // Create page always passes post=null (see create.ejs); edit uses post-edit controller.
            initializeCreateMode(scheduleAt, prefill);
            
            updateSelectedAccounts();
            startPreviewUpdateInterval();
            
            // Close popover when clicking outside
            $timeout(function() {
                angular.element(document).on('click', function(event) {
                    if (vm.isVersionPopoverOpen) {
                        var target = angular.element(event.target);
                        var popoverElement = target.closest('.version-popover, #version-add-popover-trigger');
                        if (popoverElement.length === 0) {
                            closeVersionPopover();
                            if (!$scope.$$phase && !$scope.$root.$$phase) {
                                $scope.$apply();
                            }
                        }
                    }
                });
            }, 0);
        }

        function initializeCreateMode(scheduleAt, prefill) {
            vm.post = null;
            vm.form.accounts = [];
            // Only create original version on page load
            vm.form.versions = [{
                accountId: 0,
                isOriginal: true,
                content: [{
                    body: prefill ? (prefill.body || '') : '',
                    media: []
                }]
            }];
            vm.form.tags = [];
            vm.activeVersion = 0; // Set active version to original
            
            if (scheduleAt && scheduleAt.date) {
                vm.form.date = scheduleAt.date;
                vm.form.time = scheduleAt.time || '';
            }
            
            vm.currentContent = vm.form.versions[0].content[0];
        }

        // ============================================
        // ACCOUNT MANAGEMENT
        // ============================================
        function selectAccount(accountId) {
            var index = vm.form.accounts.indexOf(accountId);
            if (index > -1) {
                // Remove account from selection
                vm.form.accounts.splice(index, 1);
                // Only remove version if it exists (don't create tabs automatically)
                var versionExists = vm.form.versions.find(function(v) {
                    return v.accountId === accountId;
                });
                if (versionExists) {
                    removeVersion(accountId);
                    if (vm.activeVersion === accountId) {
                        var remainingAccount = vm.form.accounts.find(function(id) { return id !== accountId; });
                        vm.activeVersion = remainingAccount || 0;
                        updateCurrentContent();
                    }
                }
            } else {
                // Add account to selection (but don't create version/tab automatically)
                vm.form.accounts.push(accountId);
                // Version/tab will be created only when user clicks account in popover
            }
            updateSelectedAccounts();
        }

        function isAccountSelected(accountId) {
            return vm.form.accounts.indexOf(accountId) > -1;
        }

        function updateSelectedAccounts() {
            vm.selectedAccounts = vm.accounts.filter(function(account) {
                return vm.form.accounts.indexOf(account.id) > -1;
            });
        }

        // ============================================
        // VERSION MANAGEMENT
        // ============================================
        function addVersion(accountId) {
            if (accountId === 0) return;
            
            // Ensure account is selected first
            if (vm.form.accounts.indexOf(accountId) === -1) {
                vm.form.accounts.push(accountId);
                updateSelectedAccounts();
            }
            
            var existingVersion = vm.form.versions.find(function(v) {
                return v.accountId === accountId;
            });
            if (existingVersion) {
                // Version already exists, just switch to it
                if (vm.activeVersion === 0 || !vm.form.accounts.find(function(id) { return id === vm.activeVersion; })) {
                    vm.activeVersion = accountId;
                    switchAccountVersion(accountId);
                }
                closeVersionPopover();
                return;
            }
            
            // Save current editor content before creating new version
            var editorElement = document.querySelector('.rich-text-editor-wrapper .ql-editor');
            var currentBody = '';
            var currentMedia = [];
            
            if (editorElement) {
                currentBody = editorElement.innerHTML || '';
            } else if (vm.currentContent) {
                currentBody = vm.currentContent.body || '';
                currentMedia = vm.currentContent.media || [];
            }
            
            // Get original version content as source and create a DEEP, INDEPENDENT copy
            var originalVersion = vm.form.versions.find(function(v) {
                return v.isOriginal || (v.accountId === 0);
            });
            
            // Create a completely independent copy - no references to original
            var sourceContent = { 
                body: '', 
                media: [] 
            };
            
            if (originalVersion && originalVersion.content && originalVersion.content.length > 0) {
                // Deep copy the entire content object including nested media array
                var originalContent = originalVersion.content[0];
                sourceContent = {
                    body: originalContent.body ? String(originalContent.body) : '',
                    media: originalContent.media && Array.isArray(originalContent.media) 
                        ? originalContent.media.map(function(mediaItem) {
                            // Deep copy each media item
                            return {
                                id: mediaItem.id || null,
                                uuid: mediaItem.uuid || null,
                                url: mediaItem.url ? String(mediaItem.url) : '',
                                name: mediaItem.name ? String(mediaItem.name) : '',
                                mime_type: mediaItem.mime_type || mediaItem.mimeType || '',
                                size: mediaItem.size || 0
                            };
                        })
                        : []
                };
            } else {
                // Fallback: use current editor content
                sourceContent = {
                    body: currentBody ? String(currentBody) : '',
                    media: currentMedia && Array.isArray(currentMedia)
                        ? currentMedia.map(function(mediaItem) {
                            return {
                                id: mediaItem.id || null,
                                uuid: mediaItem.uuid || null,
                                url: mediaItem.url ? String(mediaItem.url) : '',
                                name: mediaItem.name ? String(mediaItem.name) : '',
                                mime_type: mediaItem.mime_type || mediaItem.mimeType || '',
                                size: mediaItem.size || 0
                            };
                        })
                        : []
                };
            }
            
            // Create new version with completely independent content array
            var newVersion = {
                accountId: accountId,
                account_id: accountId,
                isOriginal: false,
                is_original: false,
                content: [sourceContent]  // New array with new object - no references
            };
            
            vm.form.versions.push(newVersion);
            vm.activeVersion = accountId;
            switchAccountVersion(accountId);
            closeVersionPopover();
        }

        function removeVersion(accountId) {
            if (accountId === 0) return;
            
            var index = vm.form.versions.findIndex(function(v) {
                return v.accountId === accountId;
            });
            
            if (index > -1) {
                vm.form.versions.splice(index, 1);
                if (vm.activeVersion === accountId) {
                    var remainingAccount = vm.form.accounts.find(function(id) { 
                        return id !== accountId && vm.form.versions.find(function(v) { return v.accountId === id; });
                    });
                    vm.activeVersion = remainingAccount || 0;
                    switchAccountVersion(vm.activeVersion);
                }
            }
        }

        function switchAccountVersion(accountId) {
            // Simply switch the active tab - content is already bound to version.content[0] in the view
            // No need to save/load content - Angular handles the display automatically via ng-model binding
            vm.activeVersion = accountId;
            
            // Update currentContent reference for backward compatibility (if needed by other code)
            var targetVersion = vm.form.versions.find(function(v) {
                return v.accountId === accountId || (accountId === 0 && (v.isOriginal || v.accountId === 0));
            });
            
            if (targetVersion && targetVersion.content && targetVersion.content.length > 0) {
                vm.currentContent = targetVersion.content[0];
            } else {
                vm.currentContent = { body: '', media: [] };
            }
            
            // Trigger Angular digest if needed
            if (!$scope.$$phase && !$scope.$root.$$phase) {
                $scope.$apply();
            }
        }

        function getAvailableAccountsForVersion() {
            // Get selected accounts that don't have versions yet
            var accountsWithVersions = vm.form.versions
                .filter(function(v) { return v.accountId !== 0; })
                .map(function(v) { return v.accountId; });
            
            return vm.accounts.filter(function(account) {
                return vm.form.accounts.indexOf(account.id) !== -1 && 
                       accountsWithVersions.indexOf(account.id) === -1;
            });
        }

        function getVersionAccount(accountId) {
            if (accountId === 0) {
                return { id: 0, name: 'Original', provider: null };
            }
            return vm.accounts.find(function(acc) { return acc.id === accountId; }) || null;
        }

        function openVersionPopover() {
            vm.isVersionPopoverOpen = true;
        }

        function closeVersionPopover() {
            vm.isVersionPopoverOpen = false;
        }

        // ============================================
        // CONTENT MANAGEMENT
        // ============================================
        function updateCurrentContent() {
            // Get editor from active version tab
            var activeTabPane = document.getElementById('version-tab-' + vm.activeVersion);
            var editorElement = null;
            
            if (activeTabPane) {
                editorElement = activeTabPane.querySelector('.rich-text-editor-wrapper .ql-editor');
            }
            
            // Fallback if tab pane not found
            if (!editorElement) {
                editorElement = document.querySelector('.rich-text-editor-wrapper .ql-editor');
            }
            
            var editorContent = '';
            
            if (editorElement) {
                editorContent = editorElement.innerHTML || '';
            }
            
            // Update ONLY the active version's content - do not affect other versions
            var activeVersion = vm.form.versions.find(function(v) {
                return v.accountId === vm.activeVersion || (vm.activeVersion === 0 && (v.isOriginal || v.accountId === 0));
            });
            
            if (activeVersion && activeVersion.content && activeVersion.content.length > 0) {
                // Update the active version's content directly
                activeVersion.content[0].body = editorContent;
                // Update currentContent reference for backward compatibility
                vm.currentContent = activeVersion.content[0];
            } else if (vm.currentContent) {
                // Fallback if version not found
                vm.currentContent.body = editorContent;
            }
            
            vm.lastContentHash = '';
            
            if (!$scope.$$phase && !$scope.$root.$$phase) {
                $scope.$apply();
            }
        }

        function updateContent(key, value) {
            var version = vm.form.versions.find(function(v) {
                return v.accountId === vm.activeVersion || (vm.activeVersion === 0 && v.isOriginal);
            });
            
            if (version && version.content && version.content.length > 0) {
                version.content[0][key] = value;
                vm.currentContent = version.content[0];
            }
        }

        function updateVersionContent(accountId, key, value) {
            var version = vm.form.versions.find(function(v) {
                return v.accountId === accountId || (accountId === 0 && (v.isOriginal || v.accountId === 0));
            });
            
            if (version && version.content && version.content.length > 0) {
                version.content[0][key] = value;
            }
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

        function getTagName(tag) {
            if (!tag) return '';
            if (typeof tag === 'object' && tag !== null) {
                return tag.name || '';
            }
            return String(tag || '');
        }

        function getTagColor(tag) {
            if (!tag) return '6c757d';
            if (typeof tag === 'object' && tag !== null) {
                return tag.hex_color || tag.hexColor || '6c757d';
            }
            return '6c757d';
        }

        // ============================================
        // POST CRUD OPERATIONS
        // ============================================
        function createPost() {
            if (!vm.currentProject) {
                utils.alertError('Error', 'Project is required');
                return;
            }
            
            vm.saving = true;
            vm.hasError = false;
            
            var data = buildPostData(0);
            
            console.log('Creating post with payload:', JSON.stringify(data, null, 2));
            
            services.createPost(data, function(response) {
                vm.saving = false;
                if (response.success) {
                    utils.alertSuccess('Success','Post saved successfully');
                    $timeout(function() {
                        window.location.href = '/dashboard/posts/' + vm.currentProject.uuid;
                    }, 4000);
                } else {
                    vm.hasError = true;
                    utils.alertError('Error', response.message || 'Failed to create post');
                }
            });
        }

        function schedule() {
            if (!vm.form.date || !vm.form.time) {
                utils.alertError('Error', 'Please select a schedule time');
                return;
            }
            createPostAndSchedule();
        }

        /**
         * Create page only (vm.post is always null).
         * @param {number} [draftStatus] - 0 = save draft via {@link createPost}; omit = SAVE & POST via {@link createPostAndPublish} after confirm.
         */
        function postNow(draftStatus) {
            var asDraft = draftStatus === 0;

            if (!vm.currentProject) {
                utils.alertError('Error', 'Project is required');
                return;
            }

            if (vm.form.accounts.length === 0) {
                utils.alertInfo('Account Selection', 'Please select at least one account');
                return;
            }

            if (!hasContent()) {
                utils.alertInfo('Content', 'Please enter some content for your post');
                return;
            }

            if (asDraft) {
                createPost();
                return;
            }

            var confirmMessage = 'This post will be immediately published.';
            if (vm.form.date && vm.form.time) {
                var scheduledTime = vm.formatScheduleTime();
                if (scheduledTime) {
                    confirmMessage = 'This post will be published at ' + scheduledTime + '. Are you sure?';
                } else {
                    confirmMessage = 'This post will be immediately published. Are you sure?';
                }
            } else {
                confirmMessage = 'This post will be immediately published. Are you sure?';
            }
 
            utils.alertConfirm('Confirm', confirmMessage, function(result) {
                if (result.isConfirmed) {
                    createPostAndPublish();
                }
            });
        }

        function createPostAndSchedule() {
            if (!vm.currentProject) {
                utils.alertError('Error', 'Project is required');
                return;
            }
            
            vm.saving = true;
            vm.hasError = false;
            
            var scheduledAt = vm.form.date + ' ' + vm.form.time + ':00';
            var data = buildPostData(1);
            data.scheduled_at = scheduledAt;
            
            console.log('Creating and scheduling post with payload:', JSON.stringify(data, null, 2));
            
            services.createPost(data, function(response) {
                vm.saving = false;
                if (response.success) {
                    utils.alertSuccess('Success', 'Post scheduled successfully!!');
                    // Redirect to posts list with projectUuid
                    if (vm.currentProject && vm.currentProject.uuid) {
                        $timeout(function() {
                            window.location.href = '/dashboard/posts/' + vm.currentProject.uuid;
                        }, 4000);
                    } else {
                        window.location.href = '/dashboard/posts';
                    }
                } else {
                    vm.hasError = true;
                    utils.alertError('Error', response.message || 'Failed to schedule post');
                }
            });
        }

        function createPostAndPublish() {
            vm.saving = true;
            vm.hasError = false;
            
            var now = new Date();
            var scheduledAt = now.toISOString();
            var data = buildPostData(1);
            data.scheduled_at = scheduledAt;
            
            console.log('Creating and publishing post with payload:', JSON.stringify(data, null, 2));
            
            services.createPost(data, function(response) {
                vm.saving = false;
                if (response.success) {
                    utils.alertSuccess('Success', 'Post published successfully');
                    // Redirect to posts list with projectUuid
                    if (vm.currentProject && vm.currentProject.uuid) {
                        $timeout(function() {
                            window.location.href = '/dashboard/posts/' + vm.currentProject.uuid;
                        }, 4000);
                    } else {
                        window.location.href = '/dashboard/posts';
                    }
                } else {
                    vm.hasError = true;
                    utils.alertError('Error', response.message || 'Failed to publish post');
                }
            });
        }

        /**
         * @param {number} [status] - 0 draft, 1 scheduled (omit for create-and-schedule flows that rely on server default)
         */
        function buildPostData(status) {
            // Collect account UUIDs from selected accounts
            var accountUuids = vm.form.accounts.map(function(accountId) {
                var account = vm.accounts.find(function(acc) { return acc.id === accountId; });
                return account ? (account.uuid || null) : null;
            }).filter(function(uuid) { return uuid !== null; }); // Remove null values
            
            var payload = {
                versions: vm.form.versions.map(function(version) {
                    var accountId = version.accountId || version.account_id || 0;
                    var isOriginal = version.isOriginal !== undefined ? version.isOriginal : (version.is_original !== undefined ? version.is_original : false);
                    
                    // Get accountUuid: empty string for original, UUID for social accounts
                    var accountUuid = '';
                    if (!isOriginal && accountId !== 0) {
                        var account = vm.accounts.find(function(acc) { return acc.id === accountId; });
                        accountUuid = account ? (account.uuid || '') : '';
                    }
                    
                    var content = (version.content || []).map(function(item) {
                        var media = (item.media || []).map(function(m) {
                            // Return UUID or ID (whichever is available)
                            if (typeof m === 'object') {
                                return m.uuid || m.id || m;
                            }
                            return m;
                        });
                        return {
                            body: item.body || '',
                            media: media
                        };
                    });
                    
                    return {
                        accountUuid: accountUuid,
                        original: isOriginal,
                        content: content
                    };
                }),
                accountUuids: accountUuids, // List of selected account UUIDs for PostAccount records
                tags: vm.form.tags.map(function(tag) {
                    // Return UUID (tags should have UUID)
                    return typeof tag === 'object' ? (tag.uuid || tag.id) : tag;
                }),
                date: vm.form.date || null,
                time: vm.form.time || null,
                projectUuid: vm.currentProject ? (vm.currentProject.uuid || null) : null
            };

            if (status === 0 || status === 1) {
                payload.status = status;
            }
            
            // Verify media is included in payload
            var hasMedia = false;
            payload.versions.forEach(function(version) {
                if (version.content && version.content.length > 0) {
                    version.content.forEach(function(item) {
                        if (item.media && item.media.length > 0) {
                            hasMedia = true;
                        }
                    });
                }
            });
            
            // Log payload for troubleshooting
            console.log('Post Payload:', JSON.stringify(payload, null, 2));
            console.log('Payload includes media:', hasMedia);
            console.log('Total versions:', payload.versions.length);
            payload.versions.forEach(function(version, index) {
                var versionMediaCount = 0;
                if (version.content && version.content.length > 0) {
                    version.content.forEach(function(item) {
                        if (item.media && item.media.length > 0) {
                            versionMediaCount += item.media.length;
                        }
                    });
                }
                console.log('Version ' + index + ' (accountUuid: ' + version.accountUuid + ', original: ' + version.original + ') has ' + versionMediaCount + ' media items');
            });
            
            return payload;
        }

        // ============================================
        // MEDIA MANAGEMENT
        // ============================================
        function addMedia(mediaItems, accountId) {
            if (!Array.isArray(mediaItems)) {
                mediaItems = [mediaItems];
            }
            
            // Use provided accountId, or currentMediaAccountId (from modal), or activeVersion
            if (accountId === undefined) {
                accountId = vm.currentMediaAccountId !== null ? vm.currentMediaAccountId : vm.activeVersion;
            }
            
            var normalizedMedia = mediaItems.map(function(item) {
                if (typeof item === 'object' && (item.uuid || item.id)) {
                    return {
                        id: item.id,
                        uuid: item.uuid,
                        url: item.url,
                        name: item.name,
                        mime_type: item.mime_type || item.mimeType,
                        size: item.size
                    };
                }
                return item;
            });
            
            var version = vm.form.versions.find(function(v) {
                return v.accountId === accountId || (accountId === 0 && (v.isOriginal || v.accountId === 0));
            });
            
            if (version && version.content && version.content.length > 0) {
                if (!version.content[0].media) {
                    version.content[0].media = [];
                }
                version.content[0].media = version.content[0].media.concat(normalizedMedia);
                // Update currentContent for backward compatibility
                if (accountId === vm.activeVersion) {
                    vm.currentContent = version.content[0];
                }
            }
        }

        function removeMedia(accountId, mediaIndex) {
            // If accountId is not provided, use activeVersion (backward compatibility)
            if (typeof accountId === 'number' && typeof mediaIndex === 'number') {
                // New signature: removeMedia(accountId, mediaIndex)
            } else if (typeof accountId === 'number') {
                // Old signature: removeMedia(mediaIndex) - accountId is actually mediaIndex
                mediaIndex = accountId;
                accountId = vm.activeVersion;
            } else {
                accountId = vm.activeVersion;
            }
            
            var version = vm.form.versions.find(function(v) {
                return v.accountId === accountId || (accountId === 0 && (v.isOriginal || v.accountId === 0));
            });
            
            if (version && version.content && version.content.length > 0) {
                version.content[0].media.splice(mediaIndex, 1);
                // Update currentContent for backward compatibility
                if (accountId === vm.activeVersion) {
                    vm.currentContent = version.content[0];
                }
            }
        }

        function reorderMedia(accountId, oldIndex, newIndex, media) {
            // If accountId is not provided, use activeVersion (backward compatibility)
            if (typeof accountId === 'number' && typeof oldIndex === 'number' && typeof newIndex === 'number') {
                // New signature: reorderMedia(accountId, oldIndex, newIndex, media)
            } else if (typeof accountId === 'number' && typeof oldIndex === 'number') {
                // Old signature: reorderMedia(oldIndex, newIndex, media) - accountId is actually oldIndex
                media = newIndex;
                newIndex = oldIndex;
                oldIndex = accountId;
                accountId = vm.activeVersion;
            } else {
                accountId = vm.activeVersion;
            }
            
            var version = vm.form.versions.find(function(v) {
                return v.accountId === accountId || (accountId === 0 && (v.isOriginal || v.accountId === 0));
            });
            
            if (version && version.content && version.content.length > 0) {
                version.content[0].media = media;
                // Update currentContent for backward compatibility
                if (accountId === vm.activeVersion) {
                    vm.currentContent = version.content[0];
                }
            }
        }




        // ============================================
        // MEDIA SELECTION MODAL
        // ============================================
        function openMediaSelectionModal(accountId) {
            vm.selectedMedia = [];
            vm.activeMediaTab = 'upload';
            // Store the accountId for the version we're adding media to
            vm.currentMediaAccountId = accountId !== undefined ? accountId : vm.activeVersion;
            showModal('mediaSelectionModal');
        }

        function closeMediaSelectionModal() {
            hideModal('mediaSelectionModal');
            vm.selectedMedia = [];
        }

        function setMediaTab(tab) {
            vm.activeMediaTab = tab;
        }

        function addSelectedMediaToPost() {
            if (vm.selectedMedia.length === 0) {
                utils.alertError('Error', 'Please select at least one media item');
                return;
            }
            
            // Store count before clearing the array
            var mediaCount = vm.selectedMedia.length;
            
            // Add media to post
            vm.addMedia(vm.selectedMedia);
            
            // Show toast with count before clearing
            utils.toastSuccess(mediaCount + ' media item(s) added to post');
            
            // Close modal and clear selection after showing toast
            closeMediaSelectionModal();
        }

        function onMediaUploaded(data) {
            // Media was uploaded and added to library
            // The directive handles adding it to selectedMedia automatically
        }

        function onMediaSelected(data) {
            // Media selection changed
            // The directive handles updating selectedMedia automatically
        }

        // ============================================
        // TAG MANAGEMENT
        // ============================================
        function addTag(tag) {
            if (!tag) return;
            
            var tagUuid = typeof tag === 'object' ? (tag.uuid || tag.id) : tag;
            var exists = vm.form.tags.some(function(t) {
                var tUuid = typeof t === 'object' ? (t.uuid || t.id) : t;
                return tUuid === tagUuid;
            });
            
            if (!exists) {
                if (typeof tag === 'string' || typeof tag === 'number') {
                    var tagObj = vm.tags.find(function(t) {
                        return (t.uuid || t.id) === tagUuid;
                    });
                    if (tagObj) {
                        vm.form.tags.push(tagObj);
                    }
                } else {
                    vm.form.tags.push(tag);
                }
            }
        }

        function removeTag(tagUuid) {
            vm.form.tags = vm.form.tags.filter(function(t) {
                var tUuid = typeof t === 'object' ? (t.uuid || t.id) : t;
                return tUuid !== tagUuid;
            });
        }

        function toggleTag(tag) {
            var tagUuid = typeof tag === 'object' ? (tag.uuid || tag.id) : tag;
            var exists = vm.form.tags.some(function(t) {
                var tUuid = typeof t === 'object' ? (t.uuid || t.id) : t;
                return tUuid === tagUuid;
            });
            
            if (exists) {
                vm.removeTag(tagUuid);
            } else {
                vm.addTag(tag);
            }
        }

        function openLabelsModal() {
            vm.searchTagQuery = '';
            vm.loadingTags = true;
            
            if (vm.currentProject && vm.currentProject.uuid) {
                services.getTagsByProject(vm.currentProject.uuid, function(response) {
                    if (response.success) {
                        vm.tags = response.data || [];
                    } else {
                        utils.alertError('Error', response.message || 'Failed to load tags');
                    }
                    vm.loadingTags = false;
                    showModal('labelsModal');
                });
            } else {
                vm.loadingTags = false;
                showModal('labelsModal');
            }
        }

        function closeLabelsModal() {
            hideModal('labelsModal');
            vm.searchTagQuery = '';
        }

        function createNewTag() {
            if (!vm.searchTagQuery || vm.searchTagQuery.trim() === '') {
                return;
            }
            
            if (!vm.currentProject || !vm.currentProject.uuid) {
                utils.alertError('Error', 'Project is required to create tags');
                return;
            }
            
            var tagName = vm.searchTagQuery.trim();
            
            var existingTag = vm.tags.find(function(tag) {
                return tag.name.toLowerCase() === tagName.toLowerCase();
            });
            
            if (existingTag) {
                vm.searchTagQuery = '';
                vm.addTag(existingTag);
                return;
            }
            
            var hexColor = pickRandomColor();
            var requestData = {
                name: tagName,
                hex_color: hexColor,
                projectUuid: vm.currentProject.uuid
            };
            
            services.createTag(requestData, function(response) {
                if (response.success) {
                    var newTag = response.data;
                    var normalizedTag = {
                        id: newTag.id,
                        uuid: newTag.uuid,
                        name: newTag.name,
                        hex_color: newTag.hex_color || newTag.hexColor,
                        hexColor: newTag.hex_color || newTag.hexColor
                    };
                    
                    // Refresh tags list from response if provided
                    if (response.tags && Array.isArray(response.tags)) {
                        vm.tags = response.tags;
                    } else {
                        vm.tags.unshift(normalizedTag);
                    }
                    
                    vm.addTag(normalizedTag);
                    vm.searchTagQuery = '';
                } else {
                    utils.alertError('Error', response.message || 'Failed to create tag');
                }
            });
        }

        function getFilteredTags() {
            if (!vm.searchTagQuery || vm.searchTagQuery.trim() === '') {
                return vm.tags.filter(function(tag) {
                    var tagUuid = tag.uuid || tag.id;
                    return !vm.form.tags.some(function(t) {
                        var tUuid = typeof t === 'object' ? (t.uuid || t.id) : t;
                        return tUuid === tagUuid;
                    });
                });
            }
            var query = vm.searchTagQuery.toLowerCase();
            return vm.tags.filter(function(tag) {
                var tagUuid = tag.uuid || tag.id;
                var isNotSelected = !vm.form.tags.some(function(t) {
                    var tUuid = typeof t === 'object' ? (t.uuid || t.id) : t;
                    return tUuid === tagUuid;
                });
                return isNotSelected && tag.name.toLowerCase().indexOf(query) > -1;
            });
        }

        // ============================================
        // CALENDAR / TIME PICKER
        // ============================================
        function openTimePicker() {
            // Initialize date if not set
            if (!vm.form.date) {
                var now = new Date();
                var year = now.getFullYear();
                var month = String(now.getMonth() + 1).padStart(2, '0');
                var day = String(now.getDate()).padStart(2, '0');
                vm.form.date = year + '-' + month + '-' + day;
            }
            
            // Don't prefill time - let it be empty for user to select
            // Time will remain empty if not previously set
            
            showModal('timePickerModal');
        }

        function closeTimePicker() {
            hideModal('timePickerModal');
        }

        function onDateTimeSelect(date, time) {
            // Only called when "PICK TIME" button is clicked
            // Use current form values if not provided (from directive)
            var selectedDate = date || vm.form.date;
            var selectedTime = time || vm.form.time;
            
            if (selectedDate) {
                vm.form.date = selectedDate;
            }
            if (selectedTime) {
                vm.form.time = selectedTime;
            }
            if (selectedDate && selectedTime) {
                vm.form.scheduleAt = selectedDate + ' ' + selectedTime;
            }
        }

        function clearSchedule() {
            vm.form.date = '';
            vm.form.time = '';
            vm.form.scheduleAt = '';
        }

        function formatScheduleTime() {
            if (!vm.form.date || !vm.form.time) {
                return '';
            }
            
            try {
                var dateStr = vm.form.date;
                var timeStr = vm.form.time;
                
                // Parse date (YYYY-MM-DD)
                var dateParts = dateStr.split('-');
                if (dateParts.length !== 3) return '';
                
                var year = parseInt(dateParts[0]);
                var month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
                var day = parseInt(dateParts[2]);
                
                // Parse time (HH:mm)
                var timeParts = timeStr.split(':');
                if (timeParts.length !== 2) return '';
                
                var hour = parseInt(timeParts[0]);
                var minute = parseInt(timeParts[1]);
                
                var date = new Date(year, month, day, hour, minute);
                
                // Format: "Thu, Feb 2nd, at 3:00pm"
                var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                var dayName = days[date.getDay()];
                var monthName = months[date.getMonth()];
                var dayNum = date.getDate();
                
                // Add ordinal suffix
                var suffix = '';
                if (dayNum === 1 || dayNum === 21 || dayNum === 31) {
                    suffix = 'st';
                } else if (dayNum === 2 || dayNum === 22) {
                    suffix = 'nd';
                } else if (dayNum === 3 || dayNum === 23) {
                    suffix = 'rd';
                } else {
                    suffix = 'th';
                }
                
                // Format time (12-hour with am/pm)
                var hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
                var ampm = hour >= 12 ? 'pm' : 'am';
                var minuteStr = minute.toString().padStart(2, '0');
                var timeFormatted = hour12 + ':' + minuteStr + ampm;
                
                return dayName + ', ' + monthName + ' ' + dayNum + suffix + ', at ' + timeFormatted;
            } catch (e) {
                return '';
            }
        }

        function hasContent() {
            // Check if editor has content
            var editorElement = document.querySelector('.rich-text-editor-wrapper .ql-editor');
            if (editorElement) {
                // Get plain text from Quill editor
                var text = editorElement.innerText || editorElement.textContent || '';
                // Remove whitespace and check if there's actual content
                text = text.trim();
                if (text.length > 0) {
                    return true;
                }
                
                // Also check for images/media in the editor
                var images = editorElement.querySelectorAll('img');
                if (images && images.length > 0) {
                    return true;
                }
            }
            
            // Check if there's media attached to the post
            if (vm.currentContent && vm.currentContent.media && vm.currentContent.media.length > 0) {
                return true;
            }
            
            // Check all versions for content or media
            if (vm.form.versions && vm.form.versions.length > 0) {
                for (var i = 0; i < vm.form.versions.length; i++) {
                    var version = vm.form.versions[i];
                    if (version.content && version.content.length > 0) {
                        for (var j = 0; j < version.content.length; j++) {
                            var content = version.content[j];
                            if (content.body) {
                                var bodyText = content.body.replace(/<[^>]*>/g, '').trim();
                                if (bodyText.length > 0) {
                                    return true;
                                }
                            }
                            if (content.media && content.media.length > 0) {
                                return true;
                            }
                        }
                    }
                }
            }
            
            return false;
        }

        // ============================================
        // PREVIEW MANAGEMENT
        // ============================================
        function togglePreview() {
            vm.showPreview = !vm.showPreview;
        }

        function setTab(tab) {
            if (vm.activeTab !== tab) {
                vm.activeTab = tab;
            }
        }

        function getPostAccounts() {
            return vm.selectedAccounts;
        }

        function getAccountVersionForPreview(account) {
            if (!account) {
                return vm.currentContent || { body: '', media: [] };
            }

            // Find version for this account
            var accountVersion = vm.form.versions.find(function(version) {
                return version.accountId === account.id;
            });

            // If no account-specific version found, use original
            if (!accountVersion) {
                accountVersion = vm.form.versions.find(function(version) {
                    return version.isOriginal || version.accountId === 0;
                });
            }

            if (!accountVersion || !accountVersion.content || accountVersion.content.length === 0) {
                return vm.currentContent || { body: '', media: [] };
            }

            // Return the first content item (body and media)
            return accountVersion.content[0] || { body: '', media: [] };
        }

        function startPreviewUpdateInterval() {
            if (vm.previewUpdateInterval) {
                $timeout.cancel(vm.previewUpdateInterval);
            }
            
            vm.previewUpdateInterval = $timeout(function updatePreview() {
                // Get the editor from the active version tab
                var activeTabPane = document.getElementById('version-tab-' + vm.activeVersion);
                var editorElement = null;
                
                if (activeTabPane) {
                    editorElement = activeTabPane.querySelector('.rich-text-editor-wrapper .ql-editor');
                }
                
                // Fallback to any editor if tab pane not found
                if (!editorElement) {
                    editorElement = document.querySelector('.rich-text-editor-wrapper .ql-editor');
                }
                
                var currentBody = '';
                
                if (editorElement) {
                    currentBody = editorElement.innerHTML || '';
                }
                
                // Only update the active version's content, not all versions
                var activeVersion = vm.form.versions.find(function(v) {
                    return v.accountId === vm.activeVersion || (vm.activeVersion === 0 && (v.isOriginal || v.accountId === 0));
                });
                
                if (activeVersion && activeVersion.content && activeVersion.content.length > 0) {
                    if (!currentBody && activeVersion.content[0].body) {
                        currentBody = activeVersion.content[0].body;
                    }
                    
                    if (typeof currentBody !== 'string') {
                        currentBody = String(currentBody || '');
                    }
                    
                    // Only update if content actually changed
                    if (currentBody !== activeVersion.content[0].body) {
                        activeVersion.content[0].body = currentBody;
                        // Update currentContent for backward compatibility
                        vm.currentContent = activeVersion.content[0];
                    }
                    
                    var contentHash = currentBody + JSON.stringify(activeVersion.content[0].media || []);
                    
                    if (vm.lastContentHash === '' || contentHash !== vm.lastContentHash) {
                        vm.lastContentHash = contentHash;
                        
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
                
                vm.previewUpdateInterval = $timeout(updatePreview, 500);
            }, 500);
        }

        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        var COLOR_PALLET = [
            '#94a3b8', '#a8a29e', '#111827', '#ef4444', '#e11923',
            '#fb923c', '#c2410c', '#fbbf24', '#facc15', '#a3e635',
            '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#0891b2',
            '#38bdf8', '#0369a1', '#60a5fa', '#818cf8', '#a78bfa',
            '#c084fc', '#e879f9', '#f472b6', '#fb7185'
        ];

        function pickRandomColor() {
            var usedColors = vm.tags.map(function(tag) {
                var color = tag.hex_color || tag.hexColor;
                return color ? color.replace('#', '') : null;
            }).filter(function(c) { return c !== null; });
            
            var nonUsedColors = COLOR_PALLET.filter(function(color) {
                var colorWithoutHash = color.replace('#', '');
                return usedColors.indexOf(colorWithoutHash) === -1;
            });
            
            if (nonUsedColors.length === 0) {
                return COLOR_PALLET[Math.floor(Math.random() * COLOR_PALLET.length)].replace('#', '');
            }
            
            return nonUsedColors[Math.floor(Math.random() * nonUsedColors.length)].replace('#', '');
        }

        function showModal(modalId) {
            $timeout(function() {
                var modalElement = document.getElementById(modalId);
                if (modalElement) {
                    var modal = new bootstrap.Modal(modalElement);
                    modal.show();
                }
            }, 0);
        }

        function hideModal(modalId) {
            var modalElement = document.getElementById(modalId);
            if (modalElement) {
                var modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
        }

        // ============================================
        // CLEANUP
        // ============================================
        $scope.$on('$destroy', function() {
            if (vm.previewUpdateInterval) {
                $timeout.cancel(vm.previewUpdateInterval);
            }
        });
    }
})();

