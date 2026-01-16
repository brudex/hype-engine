(function () {
    'use strict';
    angular
        .module('app')
        .directive('twitterPreview', twitterPreview);

    function twitterPreview() {
        return {
            restrict: 'E',
            scope: {
                account: '=',
                content: '=',
                getPlainText: '&'
            },
            template: `
                <!-- Twitter Preview -->
                <div class="platform-preview platform-preview-twitter">
                    <div class="preview-post-card">
                        <!-- Twitter Header -->
                        <div class="preview-account-header">
                            <div class="preview-account-avatar-wrapper">
                                <img ng-if="account.image" 
                                     ng-src="{{ account.image }}" 
                                     alt="{{ account.name }}"
                                     class="preview-account-avatar">
                                <div ng-if="!account.image" 
                                     class="preview-account-avatar preview-account-avatar-placeholder">
                                    <i class="bi bi-twitter"></i>
                                </div>
                            </div>
                            <div class="preview-account-info">
                                <div class="preview-account-name">{{ account.name }}</div>
                                <div class="preview-account-username">@{{ account.username || 'N/A' }}</div>
                                <div class="preview-account-timestamp">now</div>
                            </div>
                            <div class="preview-account-provider">
                                <i class="bi bi-twitter"></i>
                            </div>
                        </div>

                        <!-- Twitter Post Content -->
                        <div ng-if="content" class="preview-post-body">
                            <div class="preview-post-text" ng-if="content.body">
                                {{ getPlainText({html: content.body}) }}
                            </div>
                            <div ng-if="!content.body" class="preview-post-text-placeholder">
                                What's happening?
                            </div>
                            
                            <!-- Twitter Media (single image or video) -->
                            <div ng-if="content.media && content.media.length > 0" class="preview-media-container preview-media-twitter">
                                <div class="preview-media-grid preview-media-single">
                                    <img ng-src="{{ content.media[0].url }}" 
                                         alt="Media"
                                         class="preview-media-image">
                                </div>
                            </div>
                        </div>

                        <!-- Twitter Actions (Like, Retweet, Comment, Share) -->
                        <div class="preview-post-actions preview-post-actions-twitter">
                            <div class="preview-action-item">
                                <i class="bi bi-chat"></i>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-arrow-repeat"></i>
                            </div>
                            <div class="preview-action-item">
                                <i class="bi bi-heart"></i>
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

