(function () {
    'use strict';
    angular
        .module('app')
        .directive('mediaPreview', MediaPreviewDirective);

    MediaPreviewDirective.$inject = ['$timeout'];

    function MediaPreviewDirective($timeout) {
        return {
            restrict: 'E',
            scope: {
                media: '=ngModel',
                onRemove: '&?',
                onReorder: '&?',
                containerId: '@?'
            },
            template: `
                <div ng-if="media && media.length > 0" class="mb-3">
                    <div class="row g-2 media-preview-container" 
                         ng-attr-id="{{ containerId || 'mediaPreviewContainer' }}">
                        <div class="col-md-3 media-preview-item" 
                             ng-repeat="item in media track by $index"
                             data-index="{{ $index }}">
                            <div class="position-relative">
                                <div class="media-drag-handle">
                                    <i class="bi bi-grip-vertical"></i>
                                </div>
                                <img ng-if="item.url" 
                                     ng-src="{{ item.url }}" 
                                     alt="Media"
                                     class="img-fluid rounded media-preview-image">
                                <button type="button" 
                                        class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                        ng-click="removeItem($index)">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs) {
                var sortableInstance = null;
                var container = null;

                // Initialize Sortable
                function initializeSortable() {
                    $timeout(function() {
                        // Wait for ng-if to render the container
                        container = element[0].querySelector('.media-preview-container');
                        
                        if (!container) {
                            console.log('Media preview: Container not found');
                            return;
                        }
                        
                        if (typeof Sortable === 'undefined') {
                            console.log('Media preview: Sortable.js not loaded');
                            return;
                        }

                        // Destroy existing sortable instance if any
                        if (sortableInstance) {
                            sortableInstance.destroy();
                            sortableInstance = null;
                        }

                        // Only initialize if there are media items
                        var items = container.querySelectorAll('.media-preview-item');
                        if (items && items.length > 0) {
                            console.log('Media preview: Initializing Sortable with', items.length, 'items');
                            
                            sortableInstance = new Sortable(container, {
                                animation: 150,
                                ghostClass: 'media-sortable-ghost',
                                chosenClass: 'media-sortable-chosen',
                                dragClass: 'media-sortable-drag',
                                draggable: '.media-preview-item',
                                handle: '.media-drag-handle',
                                filter: '.btn-danger, .btn', // Prevent dragging when clicking buttons
                                preventOnFilter: true,
                                forceFallback: false,
                                onStart: function(evt) {
                                    console.log('Media preview: Drag started', evt.oldIndex);
                                },
                                onEnd: function(evt) {
                                    var oldIndex = evt.oldIndex;
                                    var newIndex = evt.newIndex;

                                    console.log('Media preview: Drag ended', oldIndex, '->', newIndex);

                                    if (oldIndex !== newIndex && scope.media && scope.media.length > 0) {
                                        // Reorder the media array
                                        var movedItem = scope.media.splice(oldIndex, 1)[0];
                                        scope.media.splice(newIndex, 0, movedItem);

                                        // Notify parent of reorder
                                        if (scope.onReorder) {
                                            scope.$apply(function() {
                                                scope.onReorder({
                                                    oldIndex: oldIndex,
                                                    newIndex: newIndex,
                                                    media: scope.media
                                                });
                                            });
                                        } else {
                                            scope.$apply();
                                        }
                                    }
                                }
                            });
                            
                            console.log('Media preview: Sortable initialized successfully');
                        } else {
                            console.log('Media preview: No items to sort');
                        }
                    }, 300);
                }

                // Remove media item
                scope.removeItem = function(index) {
                    if (scope.onRemove) {
                        scope.onRemove({ index: index });
                    } else if (scope.media) {
                        scope.media.splice(index, 1);
                        scope.$apply();
                    }
                };

                // Watch for media changes and reinitialize sortable
                scope.$watch('media.length', function(newLength, oldLength) {
                    if (newLength !== oldLength && newLength > 0) {
                        console.log('Media preview: Media length changed', oldLength, '->', newLength);
                        initializeSortable();
                    }
                });

                // Watch for media array reference changes
                scope.$watch('media', function(newMedia, oldMedia) {
                    if (newMedia !== oldMedia && newMedia && newMedia.length > 0) {
                        console.log('Media preview: Media array changed');
                        initializeSortable();
                    }
                }, true);

                // Watch for when ng-if renders the container
                scope.$watch(function() {
                    return element[0].querySelector('.media-preview-container');
                }, function(container) {
                    if (container && scope.media && scope.media.length > 0) {
                        console.log('Media preview: Container rendered');
                        initializeSortable();
                    }
                });

                // Initialize on load (with delay to ensure ng-if has rendered)
                $timeout(function() {
                    if (scope.media && scope.media.length > 0) {
                        initializeSortable();
                    }
                }, 500);

                // Cleanup on destroy
                scope.$on('$destroy', function() {
                    if (sortableInstance) {
                        sortableInstance.destroy();
                        sortableInstance = null;
                    }
                });
            }
        };
    }
})();

