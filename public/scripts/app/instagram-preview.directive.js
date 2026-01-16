(function () {
    'use strict';
    angular
        .module('app')
        .directive('instagramPreview', instagramPreview);

    function instagramPreview() {
        return {
            restrict: 'E',
            scope: {
                account: '=',
                content: '=',
                getPlainText: '&'
            },
            template: `
                <!-- Instagram Preview -->
                <div class="platform-preview platform-preview-instagram">
                    <div class="preview-post-card">
                        <!-- Instagram Header -->
                        <div class="preview-account-header">
                            <div class="preview-account-avatar-wrapper">
                                <img ng-if="account.image" 
                                     ng-src="{{ account.image }}" 
                                     alt="{{ account.name }}"
                                     class="preview-account-avatar">
                                <div ng-if="!account.image" 
                                     class="preview-account-avatar preview-account-avatar-placeholder">
                                    <i class="bi bi-instagram"></i>
                                </div>
                            </div>
                            <div class="preview-account-info">
                                <div class="preview-account-name">{{ account.name }}</div>
                            </div>
                            <div class="preview-account-provider">
                                <i class="bi bi-three-dots"></i>
                            </div>
                        </div>

                        <!-- Instagram Media (square format) -->
                        <div ng-if="content" class="preview-post-body">
                            <div ng-if="content.media && content.media.length > 0" class="preview-media-container preview-media-instagram">
                                <div class="preview-media-grid preview-media-single">
                                    <img ng-src="{{ content.media[0].url }}" 
                                         alt="Media"
                                         class="preview-media-image preview-media-instagram-image">
                                </div>
                            </div>
                            
                            <!-- Instagram Caption -->
                            <div class="preview-post-text preview-post-text-instagram" ng-if="content.body">
                                <strong>{{ account.name }}</strong> {{ getPlainText({html: content.body}) }}
                            </div>
                            <div ng-if="!content.body && (!content.media || content.media.length === 0)" class="preview-post-text-placeholder">
                                Write a caption...
                            </div>
                        </div>

                        <!-- Instagram Actions (Like, Comment, Share, Save) -->
                        <div class="preview-post-actions preview-post-actions-instagram">
                            <div class="preview-action-item">
                                <i class="bi bi-heart"></i>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-chat"></i>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-send"></i>
                            </div>
                            <div class="preview-action-item preview-action-item-right">
                                <i class="bi bi-bookmark"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
})();

