(function () {
    'use strict';

    angular
        .module('app')
        .controller('PostHistoryController', PostHistoryController);

    PostHistoryController.$inject = ['$http', 'brudexutils'];

    function PostHistoryController($http, utils) {
        var vm = this;

        vm.post = null;
        vm.currentProject = null;
        vm.items = [];
        vm.loading = false;
        vm.previewPost = null;
        vm.showPreview = false;
        vm.showStatusDataModal = false;
        vm.statusDataItem = null;
        vm.statusDataJson = '';
        vm.pagination = {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        };

        vm.init = init;
        vm.loadHistory = loadHistory;
        vm.truncateContent = truncateContent;
        vm.formatDate = formatDate;
        vm.getPostContent = getPostContent;
        vm.getHistoryStatusText = getHistoryStatusText;
        vm.getHistoryStatusClass = getHistoryStatusClass;
        vm.getAccountProviderIcon = getAccountProviderIcon;
        vm.getAccountProviderColor = getAccountProviderColor;
        vm.openPreview = openPreview;
        vm.closePreview = closePreview;
        vm.openStatusDataModal = openStatusDataModal;
        vm.closeStatusDataModal = closeStatusDataModal;
        vm.formatHistoryDataJson = formatHistoryDataJson;
        vm.editPost = editPost;
        vm.getStatusText = getStatusText;
        vm.getStatusClass = getStatusClass;
        vm.getStatusBadgeStyle = getStatusBadgeStyle;
        vm.getAccountVersion = getAccountVersion;
        vm.getPlainText = getPlainText;
        vm.getPages = getPages;
        vm.getCurrentPage = getCurrentPage;
        vm.setCurrentPage = setCurrentPage;
        vm.getTotalPages = getTotalPages;

        function init(post, currentProject) {
            vm.post = post || null;
            vm.previewPost = post || null;
            vm.currentProject = currentProject || null;
            vm.items = [];
            vm.pagination = { currentPage: 1, totalPages: 1, totalItems: 0 };

            if (vm.post && vm.post.uuid) {
                loadHistory();
            }
        }

        function loadHistory() {
            if (!vm.post || !vm.post.uuid) {
                return;
            }

            vm.loading = true;
            $http.get('/dashboard/api/posts/history/' + vm.post.uuid, {
                params: { page: vm.pagination.currentPage }
            }).then(function (response) {
                vm.loading = false;
                if (response.data.success) {
                    vm.items = response.data.data || [];
                    if (response.data.meta) {
                        vm.pagination = {
                            currentPage: response.data.meta.current_page || 1,
                            totalPages: response.data.meta.last_page || 1,
                            totalItems: response.data.meta.total || 0
                        };
                    }
                } else {
                    utils.alertError('Error', response.data.message || 'Failed to load history');
                }
            }).catch(function () {
                vm.loading = false;
                utils.alertError('Error', 'Failed to load history');
            });
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

        function formatDate(dateString) {
            if (!dateString) {
                return '';
            }
            var date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function getPostContent(post) {
            if (post.content && post.content.excerpt) {
                return post.content.excerpt;
            }
            if (!post.versions || post.versions.length === 0) {
                return '';
            }
            var version = post.versions[0];
            if (version.content) {
                var plainText = version.content.replace(/<[^>]*>/g, '').trim();
                return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
            }
            return '';
        }

        function getHistoryStatusText(status) {
            return Number(status) === 0 ? 'Success' : 'Failed';
        }

        function getHistoryStatusClass(status) {
            return Number(status) === 0 ? 'badge-success' : 'badge-danger';
        }

        function normalizeProvider(provider) {
            if (!provider) {
                return '';
            }
            var p = String(provider).toLowerCase();
            if (p.indexOf('twitter') !== -1 || p === 'x') {
                return 'twitter';
            }
            if (p.indexOf('facebook') !== -1) {
                return 'facebook';
            }
            if (p.indexOf('instagram') !== -1) {
                return 'instagram';
            }
            if (p.indexOf('linkedin') !== -1) {
                return 'linkedin';
            }
            if (p.indexOf('tiktok') !== -1) {
                return 'tiktok';
            }
            if (p.indexOf('mastodon') !== -1) {
                return 'mastodon';
            }
            return p;
        }

        function getAccountProviderIcon(provider) {
            var key = normalizeProvider(provider);
            var icons = {
                twitter: 'bi-twitter',
                facebook: 'bi-facebook',
                instagram: 'bi-instagram',
                linkedin: 'bi-linkedin',
                tiktok: 'bi-tiktok',
                mastodon: 'bi-mastodon'
            };
            return icons[key] || 'bi-share';
        }

        function getAccountProviderColor(provider) {
            var key = normalizeProvider(provider);
            var colors = {
                twitter: '#1DA1F2',
                facebook: '#1877F2',
                instagram: '#E4405F',
                linkedin: '#0077B5',
                tiktok: '#FFFFFF',
                mastodon: '#6364FF'
            };
            return colors[key] || '#B0B0B0';
        }

        function openPreview(post) {
            vm.previewPost = post;
            vm.showPreview = true;
        }

        function closePreview() {
            vm.previewPost = null;
            vm.showPreview = false;
        }

        function formatHistoryDataJson(data) {
            if (data === null || data === undefined) {
                return 'null';
            }
            if (typeof data === 'string') {
                var trimmed = data.trim();
                if (!trimmed) {
                    return 'null';
                }
                try {
                    return JSON.stringify(JSON.parse(trimmed), null, 2);
                } catch (e) {
                    return data;
                }
            }
            try {
                return JSON.stringify(data, null, 2);
            } catch (e2) {
                return String(data);
            }
        }

        function openStatusDataModal(item, $event) {
            if ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }
            vm.statusDataItem = item || null;
            vm.statusDataJson = item ? formatHistoryDataJson(item.data) : 'null';
            vm.showStatusDataModal = true;
        }

        function closeStatusDataModal() {
            vm.showStatusDataModal = false;
            vm.statusDataItem = null;
            vm.statusDataJson = '';
        }

        function editPost(postUuid) {
            window.location.href = '/dashboard/posts/edit/' + postUuid;
        }

        function getStatusText(status) {
            var statuses = {
                0: 'Draft',
                1: 'Scheduled',
                2: 'Published',
                3: 'Failed'
            };
            return statuses[status] || 'Unknown';
        }

        function getStatusClass(status) {
            var classes = {
                0: 'badge-secondary',
                1: 'badge-info',
                2: 'badge-success',
                3: 'badge-danger'
            };
            return classes[status] || 'badge-secondary';
        }

        function getStatusBadgeStyle(status) {
            var styles = {
                0: 'background: linear-gradient(135deg, rgba(107, 114, 128, 0.2) 0%, rgba(107, 114, 128, 0.15) 100%); color: #B0B0B0; border: 1px solid rgba(107, 114, 128, 0.3);',
                1: 'background: linear-gradient(135deg, rgba(0, 239, 255, 0.2) 0%, rgba(0, 239, 255, 0.15) 100%); color: #00EFFF; border: 1px solid rgba(0, 239, 255, 0.3);',
                2: 'background: linear-gradient(135deg, rgba(198, 255, 0, 0.2) 0%, rgba(198, 255, 0, 0.15) 100%); color: #C6FF00; border: 1px solid rgba(198, 255, 0, 0.3);',
                3: 'background: linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(255, 0, 0, 0.15) 100%); color: #FF6B6B; border: 1px solid rgba(255, 0, 0, 0.3);'
            };
            return styles[status] || styles[0];
        }

        function getAccountVersion(post, account) {
            if (!post || !post.versions || !account) {
                return null;
            }

            var accountVersion = post.versions.find(function (version) {
                return version.accountUuid === account.uuid ||
                    version.accountId === account.id;
            });

            if (!accountVersion) {
                accountVersion = post.versions.find(function (version) {
                    return version.isOriginal || version.accountUuid === '' || version.accountId === 0;
                });
            }

            if (!accountVersion || !accountVersion.content) {
                return null;
            }

            var content = {
                body: accountVersion.content || '',
                media: []
            };

            if (accountVersion.media && Array.isArray(accountVersion.media)) {
                if (post.content && post.content.media && Array.isArray(post.content.media)) {
                    content.media = post.content.media.filter(function (media) {
                        return accountVersion.media.indexOf(media.uuid || media.id) > -1;
                    });
                } else {
                    content.media = accountVersion.media.map(function (uuid) {
                        return { uuid: uuid, url: '/api/media/' + uuid };
                    });
                }
            }

            return content;
        }

        function getPlainText(html) {
            if (!html) {
                return '';
            }
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
                text = text.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
                return text;
            } catch (e) {
                return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            }
        }

        function getPages() {
            var pages = [];
            for (var i = 1; i <= vm.pagination.totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        function getCurrentPage() {
            return vm.pagination.currentPage;
        }

        function setCurrentPage(page) {
            vm.pagination.currentPage = page;
            loadHistory();
        }

        function getTotalPages() {
            return vm.pagination.totalPages;
        }
    }
})();
