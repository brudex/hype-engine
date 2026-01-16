(function () {
    'use strict';
    angular
        .module('app')
        .directive('facebookPreview', facebookPreview);

    function facebookPreview() {
        return {
            restrict: 'E',
            scope: {
                account: '=',
                content: '=',
                getPlainText: '&'
            },
            template: `
                <!-- Facebook Preview -->
                <div class="platform-preview platform-preview-facebook">
                    <div class="preview-post-card">
                        <!-- Facebook Header -->
                        <div class="preview-account-header">
                            <div class="preview-account-avatar-wrapper">
                                <img ng-if="account.image" 
                                     ng-src="{{ account.image }}" 
                                     alt="{{ account.name }}"
                                     class="preview-account-avatar">
                                <div ng-if="!account.image" 
                                     class="preview-account-avatar preview-account-avatar-placeholder">
                                    <i class="bi bi-facebook"></i>
                                </div>
                            </div>
                            <div class="preview-account-info">
                                <div class="preview-account-name">{{ account.name }}</div>
                                <div class="preview-account-timestamp">now</div>
                            </div>
                            <div class="preview-account-provider">
                                <i class="bi bi-three-dots"></i>
                            </div>
                        </div>

                        <!-- Facebook Post Content -->
                        <div ng-if="content" class="preview-post-body">
                            <div class="preview-post-text" ng-if="content.body">
                                {{ getPlainText({html: content.body}) }}
                            </div>
                            <div ng-if="!content.body" class="preview-post-text-placeholder">
                                What's on your mind?
                            </div>
                            
                            <!-- Facebook Media -->
                            <div ng-if="content.media && content.media.length > 0" class="preview-media-container preview-media-facebook">
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
                                    <div ng-if="content.media.length > 4" 
                                         class="preview-media-overlay">
                                        <span class="preview-media-count">+{{ content.media.length - 4 }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Facebook Actions (Like, Comment, Share) -->
                        <div class="preview-post-actions preview-post-actions-facebook">
                            <div class="preview-action-item">
                                <i class="bi bi-hand-thumbs-up"></i>
                                <span>Like</span>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-chat"></i>
                                <span>Comment</span>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-share"></i>
                                <span>Share</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
})();

