(function () {
    'use strict';
    angular
        .module('app')
        .directive('mastodonPreview', mastodonPreview);

    function mastodonPreview() {
        return {
            restrict: 'E',
            scope: {
                account: '=',
                content: '=',
                getPlainText: '&'
            },
            template: `
                <!-- Mastodon Preview -->
                <div class="platform-preview platform-preview-mastodon">
                    <div class="preview-post-card">
                        <!-- Mastodon Header -->
                        <div class="preview-account-header">
                            <div class="preview-account-avatar-wrapper">
                                <img ng-if="account.image" 
                                     ng-src="{{ account.image }}" 
                                     alt="{{ account.name }}"
                                     class="preview-account-avatar">
                                <div ng-if="!account.image" 
                                     class="preview-account-avatar preview-account-avatar-placeholder">
                                    <i class="bi bi-server"></i>
                                </div>
                            </div>
                            <div class="preview-account-info">
                                <div class="preview-account-name">{{ account.name }}</div>
                                <div class="preview-account-username">@{{ account.username || 'N/A' }}</div>
                                <div class="preview-account-timestamp">now</div>
                            </div>
                        </div>

                        <!-- Mastodon Post Content -->
                        <div ng-if="content" class="preview-post-body">
                            <div class="preview-post-text" ng-if="content.body">
                                {{ getPlainText({html: content.body}) }}
                            </div>
                            <div ng-if="!content.body" class="preview-post-text-placeholder">
                                What's on your mind?
                            </div>
                            
                            <!-- Mastodon Media -->
                            <div ng-if="content.media && content.media.length > 0" class="preview-media-container preview-media-mastodon">
                                <div class="preview-media-grid preview-media-single" ng-if="content.media.length === 1">
                                    <img ng-src="{{ content.media[0].url }}" 
                                         alt="Media"
                                         class="preview-media-image">
                                </div>
                                <div class="preview-media-grid preview-media-double" ng-if="content.media.length === 2">
                                    <img ng-repeat="media in content.media"
                                         ng-src="{{ media.url }}" 
                                         alt="Media"
                                         class="preview-media-image">
                                </div>
                                <div class="preview-media-grid preview-media-multiple" ng-if="content.media.length >= 3">
                                    <img ng-repeat="media in content.media.slice(0, 4)"
                                         ng-src="{{ media.url }}" 
                                         alt="Media"
                                         class="preview-media-image">
                                </div>
                            </div>
                        </div>

                        <!-- Mastodon Actions (Reply, Boost, Favorite, Share) -->
                        <div class="preview-post-actions preview-post-actions-mastodon">
                            <div class="preview-action-item">
                                <i class="bi bi-reply"></i>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-arrow-repeat"></i>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-star"></i>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-share"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
})();

