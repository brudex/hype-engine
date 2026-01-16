(function () {
    'use strict';
    angular
        .module('app')
        .directive('tiktokPreview', tiktokPreview);

    function tiktokPreview() {
        return {
            restrict: 'E',
            scope: {
                account: '=',
                content: '=',
                getPlainText: '&'
            },
            template: `
                <!-- TikTok Preview -->
                <div class="platform-preview platform-preview-tiktok">
                    <div class="preview-post-card">
                        <!-- TikTok Header -->
                        <div class="preview-account-header">
                            <div class="preview-account-avatar-wrapper">
                                <img ng-if="account.image" 
                                     ng-src="{{ account.image }}" 
                                     alt="{{ account.name }}"
                                     class="preview-account-avatar">
                                <div ng-if="!account.image" 
                                     class="preview-account-avatar preview-account-avatar-placeholder">
                                    <i class="bi bi-music-note-beamed"></i>
                                </div>
                            </div>
                            <div class="preview-account-info">
                                <div class="preview-account-name">{{ account.name }}</div>
                                <div class="preview-account-username">@{{ account.username || 'N/A' }}</div>
                            </div>
                        </div>

                        <!-- TikTok Media (vertical video format) -->
                        <div ng-if="content" class="preview-post-body">
                            <div ng-if="content.media && content.media.length > 0" class="preview-media-container preview-media-tiktok">
                                <div class="preview-media-grid preview-media-single">
                                    <img ng-src="{{ content.media[0].url }}" 
                                         alt="Media"
                                         class="preview-media-image preview-media-tiktok-image">
                                </div>
                            </div>
                            
                            <!-- TikTok Caption -->
                            <div class="preview-post-text preview-post-text-tiktok" ng-if="content.body">
                                {{ getPlainText({html: content.body}) }}
                            </div>
                            <div ng-if="!content.body && (!content.media || content.media.length === 0)" class="preview-post-text-placeholder">
                                Add a caption...
                            </div>
                        </div>

                        <!-- TikTok Actions (Like, Comment, Share, Bookmark) -->
                        <div class="preview-post-actions preview-post-actions-tiktok">
                            <div class="preview-action-item preview-action-item-vertical">
                                <i class="bi bi-heart"></i>
                                <span>0</span>
                            </div>
                            <div class="preview-action-item preview-action-item-vertical">
                                <i class="bi bi-chat"></i>
                                <span>0</span>
                            </div>
                            <div class="preview-action-item preview-action-item-vertical">
                                <i class="bi bi-share"></i>
                                <span>0</span>
                            </div>
                            <div class="preview-action-item preview-action-item-vertical">
                                <i class="bi bi-bookmark"></i>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
})();

