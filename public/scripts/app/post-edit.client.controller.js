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
        vm.selectedMedia = [];
        vm.activeMediaTab = 'upload';
        vm.currentMediaAccountId = null;
        vm.isVersionPopoverOpen = false;
        
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
        vm.currentContent = { body: '', media: [] }; // For preview display

        // ============================================
        // PUBLIC METHODS
        // ============================================
        vm.init = init;
        vm.selectAccount = selectAccount;
        vm.isAccountSelected = isAccountSelected;
        vm.switchAccountVersion = switchAccountVersion;
        vm.togglePreview = togglePreview;
        vm.setTab = setTab;
        vm.save = save;
        vm.postNow = postNow;
        vm.addMedia = addMedia;
        vm.removeMedia = removeMedia;
        vm.reorderMedia = reorderMedia;
        vm.addTag = addTag;
        vm.removeTag = removeTag;
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
        vm.hasContent = hasContent;
        vm.addVersion = addVersion;
        vm.getAvailableAccountsForVersion = getAvailableAccountsForVersion;
        vm.getVersionAccount = getVersionAccount;
        vm.openVersionPopover = openVersionPopover;
        vm.closeVersionPopover = closeVersionPopover;

        // ============================================
        // INITIALIZATION
        // ============================================
        function init(postUuid, accounts, tags, scheduleAt, prefill, currentProject) {
            vm.accounts = accounts || [];
            vm.tags = tags || [];
            vm.currentProject = currentProject || null;
            
            if (!postUuid || typeof postUuid !== 'string') {
                utils.alertError('Error', 'Post UUID is required');
                window.location.href = '/dashboard/posts';
                return;
            }
            
            vm.loading = true;
            vm.hasError = false;
            
            services.getPost(postUuid, function(response) {
                console.log("Post Detail response:", response);
                vm.loading = false;
                
                if (!response.success || !response.data) {
                    vm.hasError = true;
                    utils.alertError('Error', response.message || 'Failed to load post');
                    window.location.href = '/dashboard/posts';
                    return;
                }
                
                var post = response.data;
                
                if (!vm.currentProject && post.project) {
                    vm.currentProject = post.project;
                }
                
                initializeEditMode(post);
                updateSelectedAccounts();
                startPreviewUpdateInterval();
                setupVersionPopoverClose();
            });
        }

        function initializeEditMode(post) {
            vm.post = post;
            vm.form.accounts = post.accounts.map(function(account) {
                return account.id;
            });
            
            // Process versions from API
            var allVersions = post.versions || [];
            
            // Find and set up the original version first
            var originalVersion = allVersions.find(function(v) {
                return v.original === true || v.accountUuid === '' || !v.accountUuid;
            });
            
            vm.form.versions = [];
            
            if (originalVersion) {
                var originalContent = normalizeContent(originalVersion.content);
                vm.form.versions.push({
                    accountUuid: originalVersion.accountUuid || '',
                    accountId: 0,
                    account_id: 0,
                    isOriginal: true,
                    is_original: true,
                    content: originalContent
                });
            }
            
            // Add account-specific versions
            var accountVersions = allVersions.filter(function(v) {
                return !(v.original === true || v.accountUuid === '' || !v.accountUuid);
            });
            
            accountVersions.forEach(function(version) {
                var content = normalizeContent(version.content);
                addVersion(version.accountUuid, content);
            });
            
            updateSelectedAccounts();
            vm.form.tags = post.tags || [];
            
            if (post.scheduledAt) {
                var scheduledDate = new Date(post.scheduledAt);
                vm.form.date = scheduledDate.toISOString().split('T')[0];
                vm.form.time = scheduledDate.toTimeString().split(' ')[0].substring(0, 5);
            }
            
            vm.activeVersion = 0;
            updateCurrentContent();
        }

        function normalizeContent(content) {
            if (content && Array.isArray(content) && content.length > 0) {
                return content.map(function(item) {
                    // Ensure media is an array
                    var media = [];
                    if (Array.isArray(item.media)) {
                        // Media can be either UUID strings or objects with url property
                        // Keep as-is since API now returns objects with URLs
                        media = item.media;
                    }
                    return {
                        body: item.body || '',
                        media: media
                    };
                });
            }
            return [{ body: '', media: [] }];
        }

        function setupVersionPopoverClose() {
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

        // ============================================
        // ACCOUNT MANAGEMENT
        // ============================================
        function selectAccount(accountId) {
            var index = vm.form.accounts.indexOf(accountId);
            if (index > -1) {
                vm.form.accounts.splice(index, 1);
                var version = vm.form.versions.find(function(v) {
                    return v.accountId === accountId;
                });
                if (version) {
                removeVersion(accountId);
                if (vm.activeVersion === accountId) {
                        vm.activeVersion = 0;
                        switchAccountVersion(0);
                    }
                }
            } else {
                vm.form.accounts.push(accountId);
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
        function addVersion(accountUuid, existingContent) {
            if (!accountUuid || accountUuid === '') return;
            
            var account = vm.accounts.find(function(acc) {
                return acc.uuid === accountUuid;
            });
            
            if (!account) {
                console.warn('addVersion: Account not found for UUID:', accountUuid);
                return;
            }
            
            var accountId = account.id || 0;
            
            if (vm.form.accounts.indexOf(accountId) === -1) {
                vm.form.accounts.push(accountId);
                updateSelectedAccounts();
            }
            
            var existingVersion = vm.form.versions.find(function(v) {
                return v.accountUuid === accountUuid;
            });
            
            if (existingVersion) {
                if (vm.activeVersion === 0) {
                    vm.activeVersion = accountId;
                    switchAccountVersion(accountId);
                }
                closeVersionPopover();
                return;
            }
            
            var sourceContent;
            if (existingContent && Array.isArray(existingContent) && existingContent.length > 0) {
                sourceContent = existingContent[0];
            } else {
            var originalVersion = vm.form.versions.find(function(v) {
                    return v.isOriginal || v.accountUuid === '';
                });
                sourceContent = originalVersion && originalVersion.content && originalVersion.content.length > 0
                    ? {
                        body: String(originalVersion.content[0].body || ''),
                        // Preserve media objects with URLs (or UUIDs if they're strings)
                        media: Array.isArray(originalVersion.content[0].media) 
                            ? originalVersion.content[0].media.map(function(m) {
                                // If it's already an object with url, keep it; if it's a UUID string, keep it
                                return typeof m === 'object' && m !== null ? m : m;
                            })
                            : []
                    }
                    : { body: '', media: [] };
            }
            
            vm.form.versions.push({
                accountUuid: accountUuid,
                accountId: accountId,
                account_id: accountId,
                isOriginal: false,
                is_original: false,
                content: [{
                    body: String(sourceContent.body || ''),
                    media: Array.isArray(sourceContent.media) ? sourceContent.media : []
                }]
            });
            
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
                    vm.activeVersion = 0;
                    switchAccountVersion(0);
                }
            }
        }

        function switchAccountVersion(accountId) {
            vm.activeVersion = accountId;
            updateCurrentContent();
            if (!$scope.$$phase && !$scope.$root.$$phase) {
                $scope.$apply();
            }
        }

        function getAvailableAccountsForVersion() {
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
        function updateVersionContent(accountId, key, value) {
            var version = findVersion(accountId);
            
            if (version && version.content && version.content.length > 0) {
                version.content[0][key] = value;
                // Update currentContent if this is the active version
                if (accountId === vm.activeVersion) {
                    updateCurrentContent();
                }
            }
        }

        function updateCurrentContent() {
            var version = findVersion(vm.activeVersion);
            if (version && version.content && version.content.length > 0) {
                vm.currentContent = version.content[0];
            } else {
                vm.currentContent = { body: '', media: [] };
            }
        }

        function getPostAccounts() {
            if (vm.post && vm.post.status === 2) {
                return vm.post.accounts;
            }
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
                return text.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
            } catch (e) {
                return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
            }
        }

        // ============================================
        // POST OPERATIONS
        // ============================================
        function save() {
            
            vm.saving = true;
            vm.hasError = false;
            var data = buildPostData();
            // Log payload for troubleshooting
            console.log('PostEditController.save - Sending update payload:', {
                postUuid: vm.post.uuid,
                payload: JSON.stringify(data, null, 2),
                payloadObject: data
            });
            
            // Call updatePost with full payload (uuid is included in data)
            services.updatePost(data, function(response) {
                vm.saving = false;
                if (response.success) {
                    utils.alertSuccess('Success', 'Post saved successfully');
                    // Stay on the page after successful update
                } else {
                    vm.hasError = true;
                    utils.alertError('Error', response.message || 'Failed to save post');
                }
            });
        }

        

        function postNow() {
            if (!vm.post) {
                utils.alertError('Error', 'Post not found. Cannot publish.');
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
            save(); //no need to confirm, just save
        
        }

       

        function buildPostData() {
            // Collect account UUIDs from selected accounts
            var accountUuids = vm.form.accounts.map(function(accountId) {
                var account = vm.accounts.find(function(acc) { return acc.id === accountId; });
                return account ? (account.uuid || null) : null;
            }).filter(function(uuid) { return uuid !== null; }); // Remove null values
            
            var payload = {
                uuid: vm.post ? vm.post.uuid : null, // Include post UUID for update
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
            
            // Normalize media items to include full object with url for display
            var normalizedMedia = mediaItems.map(function(item) {
                if (typeof item === 'object' && item !== null && (item.uuid || item.id)) {
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
            
            var version = findVersion(accountId);
            if (version && version.content && version.content.length > 0) {
                if (!version.content[0].media) {
                    version.content[0].media = [];
                }
                version.content[0].media = version.content[0].media.concat(normalizedMedia);
                // Update currentContent for preview
                if (accountId === vm.activeVersion) {
                    updateCurrentContent();
                }
            }
        }

        function removeMedia(accountId, mediaIndex) {
            var version = findVersion(accountId);
            if (version && version.content && version.content.length > 0) {
                version.content[0].media.splice(mediaIndex, 1);
            }
        }

        function reorderMedia(accountId, oldIndex, newIndex, media) {
            var version = findVersion(accountId);
            if (version && version.content && version.content.length > 0) {
                version.content[0].media = media;
            }
        }

        function findVersion(accountId) {
            return vm.form.versions.find(function(v) {
                return v.accountId === accountId || (accountId === 0 && v.isOriginal);
            });
        }

        function openMediaSelectionModal(accountId) {
            vm.selectedMedia = [];
            vm.activeMediaTab = 'upload';
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
            addMedia(vm.selectedMedia);
            
            // Show toast with count before clearing
            utils.toastSuccess(mediaCount + ' media item(s) added to post');
            
            // Close modal and clear selection after showing toast
            closeMediaSelectionModal();
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
                removeTag(tagUuid);
            } else {
                addTag(tag);
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
                addTag(existingTag);
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
                    if (response.tags && Array.isArray(response.tags)) {
                        vm.tags = response.tags;
                    } else {
                        vm.tags.unshift(newTag);
                    }
                    addTag(newTag);
                    vm.searchTagQuery = '';
                } else {
                    utils.alertError('Error', response.message || 'Failed to create tag');
                }
            });
        }

        function getFilteredTags() {
            var query = vm.searchTagQuery ? vm.searchTagQuery.toLowerCase() : '';
            return vm.tags.filter(function(tag) {
                var tagUuid = tag.uuid || tag.id;
                var isNotSelected = !vm.form.tags.some(function(t) {
                    var tUuid = typeof t === 'object' ? (t.uuid || t.id) : t;
                    return tUuid === tagUuid;
                });
                return isNotSelected && (!query || tag.name.toLowerCase().indexOf(query) > -1);
            });
        }

        // ============================================
        // SCHEDULE MANAGEMENT
        // ============================================
        function openTimePicker() {
            if (!vm.form.date) {
                var now = new Date();
                vm.form.date = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getDate()).padStart(2, '0');
            }
            showModal('timePickerModal');
        }

        function closeTimePicker() {
            hideModal('timePickerModal');
        }

        function onDateTimeSelect(date, time) {
            if (date) vm.form.date = date;
            if (time) vm.form.time = time;
        }

        function clearSchedule() {
            vm.form.date = '';
            vm.form.time = '';
        }

        function formatScheduleTime() {
            if (!vm.form.date || !vm.form.time) return '';
            
            try {
                var dateParts = vm.form.date.split('-');
                var timeParts = vm.form.time.split(':');
                if (dateParts.length !== 3 || timeParts.length !== 2) return '';
                
                var date = new Date(
                    parseInt(dateParts[0]),
                    parseInt(dateParts[1]) - 1,
                    parseInt(dateParts[2]),
                    parseInt(timeParts[0]),
                    parseInt(timeParts[1])
                );
                
                var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                var dayName = days[date.getDay()];
                var monthName = months[date.getMonth()];
                var dayNum = date.getDate();
                var suffix = (dayNum === 1 || dayNum === 21 || dayNum === 31) ? 'st' :
                            (dayNum === 2 || dayNum === 22) ? 'nd' :
                            (dayNum === 3 || dayNum === 23) ? 'rd' : 'th';
                
                var hour = parseInt(timeParts[0]);
                var hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
                var ampm = hour >= 12 ? 'pm' : 'am';
                var minuteStr = timeParts[1].padStart(2, '0');
                
                return dayName + ', ' + monthName + ' ' + dayNum + suffix + ', at ' + hour12 + ':' + minuteStr + ampm;
            } catch (e) {
                return '';
            }
        }

        // ============================================
        // PREVIEW MANAGEMENT
        // ============================================
        function togglePreview() {
            vm.showPreview = !vm.showPreview;
        }

        function setTab(tab) {
                vm.activeTab = tab;
        }

        function startPreviewUpdateInterval() {
            if (vm.previewUpdateInterval) {
                $timeout.cancel(vm.previewUpdateInterval);
            }
            
            vm.previewUpdateInterval = $timeout(function updatePreview() {
                var activeTabPane = document.getElementById('version-tab-' + vm.activeVersion);
                var editorElement = activeTabPane 
                    ? activeTabPane.querySelector('.rich-text-editor-wrapper .ql-editor')
                    : document.querySelector('.rich-text-editor-wrapper .ql-editor');
                
                if (editorElement) {
                    var currentBody = editorElement.innerHTML || '';
                    var version = findVersion(vm.activeVersion);
                    
                    if (version && version.content && version.content.length > 0) {
                        if (currentBody !== version.content[0].body) {
                            version.content[0].body = currentBody;
                        }
                        // Update currentContent for preview
                        updateCurrentContent();
                    }
                }
                
                vm.previewUpdateInterval = $timeout(updatePreview, 500);
            }, 500);
        }

        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        function hasContent() {
            var editorElement = document.querySelector('.rich-text-editor-wrapper .ql-editor');
            if (editorElement) {
                var text = (editorElement.innerText || editorElement.textContent || '').trim();
                if (text.length > 0) return true;
                if (editorElement.querySelectorAll('img').length > 0) return true;
            }
            
            for (var i = 0; i < vm.form.versions.length; i++) {
                var version = vm.form.versions[i];
                if (version.content && version.content.length > 0) {
                    for (var j = 0; j < version.content.length; j++) {
                        var content = version.content[j];
                        if (content.body && content.body.replace(/<[^>]*>/g, '').trim().length > 0) {
                            return true;
                        }
                        if (content.media && content.media.length > 0) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        }

        function getTagName(tag) {
            if (!tag) return '';
            return typeof tag === 'object' && tag !== null ? (tag.name || '') : String(tag || '');
        }

        function getTagColor(tag) {
            if (!tag) return '6c757d';
            return typeof tag === 'object' && tag !== null ? (tag.hex_color || tag.hexColor || '6c757d') : '6c757d';
        }

        function pickRandomColor() {
        var COLOR_PALLET = [
            '#94a3b8', '#a8a29e', '#111827', '#ef4444', '#e11923',
            '#fb923c', '#c2410c', '#fbbf24', '#facc15', '#a3e635',
            '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#0891b2',
            '#38bdf8', '#0369a1', '#60a5fa', '#818cf8', '#a78bfa',
            '#c084fc', '#e879f9', '#f472b6', '#fb7185'
        ];

            var usedColors = vm.tags.map(function(tag) {
                var color = tag.hex_color || tag.hexColor;
                return color ? color.replace('#', '') : null;
            }).filter(function(c) { return c !== null; });
            
            var nonUsedColors = COLOR_PALLET.filter(function(color) {
                return usedColors.indexOf(color.replace('#', '')) === -1;
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
