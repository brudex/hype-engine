(function () {
    'use strict';
    angular
        .module('app')
        .directive('linkedinPreview', linkedinPreview);

    function linkedinPreview() {
        return {
            restrict: 'E',
            scope: {
                account: '=',
                content: '=',
                getPlainText: '&'
            },
            template: `
                <!-- LinkedIn Preview -->
                <div class="platform-preview platform-preview-linkedin">
                    <div class="preview-post-card">
                        <!-- LinkedIn Header -->
                        <div class="preview-account-header">
                            <div class="preview-account-avatar-wrapper">
                                <img ng-if="account.image" 
                                     ng-src="{{ account.image }}" 
                                     alt="{{ account.name }}"
                                     class="preview-account-avatar">
                                <div ng-if="!account.image" 
                                     class="preview-account-avatar preview-account-avatar-placeholder">
                                    <i class="bi bi-linkedin"></i>
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

                        <!-- LinkedIn Post Content -->
                        <div ng-if="content" class="preview-post-body">
                            <div class="preview-post-text" ng-if="content.body">
                                {{ getPlainText({html: content.body}) }}
                            </div>
                            <div ng-if="!content.body" class="preview-post-text-placeholder">
                                Share an article, photo, video or idea
                            </div>
                            
                            <!-- LinkedIn Media -->
                            <div ng-if="content.media && content.media.length > 0" class="preview-media-container preview-media-linkedin">
                                <div class="preview-media-grid preview-media-single">
                                    <img ng-src="{{ content.media[0].url }}" 
                                         alt="Media"
                                         class="preview-media-image">
                                </div>
                            </div>
                        </div>

                        <!-- LinkedIn Actions (Like, Comment, Share) -->
                        <div class="preview-post-actions preview-post-actions-linkedin">
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
                            <div class="preview-action-item">
                                <i class="bi bi-send"></i>
                                <span>Send</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
})();

