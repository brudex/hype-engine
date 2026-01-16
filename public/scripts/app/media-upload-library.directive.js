(function () {
    'use strict';
    angular
        .module('app')
        .directive('mediaUploadLibrary', MediaUploadLibraryDirective);

    MediaUploadLibraryDirective.$inject = ['$timeout', 'brudexservices', 'brudexutils', 'uploadservice'];

    function MediaUploadLibraryDirective($timeout, services, utils, uploadservice) {
        return {
            restrict: 'E',
            scope: {
                selectedMedia: '=ngModel',
                onMediaSelected: '&?',
                onMediaUploaded: '&?'
            },
            template: `
                <div>
                    <!-- Upload Dropzone -->
                    <div class="mb-4">
                        <!-- Hidden File Input -->
                        <input type="file" 
                               id="mediaUploadFileInput" 
                               class="d-none" 
                               multiple 
                               accept="image/*,video/*">
                        
                        <!-- Dropzone Area -->
                        <div id="mediaUploadArea" 
                             class="add-media-button"
                             ng-class="{'drag-over': isDragging, 'uploading': uploading}"
                             ng-click="triggerFileInput()"
                             ondrop="handleDrop($event)"
                             ondragover="handleDragOver($event)"
                             ondragleave="handleDragLeave($event)">
                            <div ng-if="!uploading">
                                <i class="bi bi-cloud-upload me-2"></i> 
                                <span>Upload Media</span>
                                <small class="d-block mt-1 text-muted">Click to browse or drag and drop</small>
                            </div>
                            <div ng-if="uploading" class="text-center">
                                <i class="bi bi-arrow-repeat bi-spin me-2"></i>
                                <span>Uploading...</span>
                            </div>
                        </div>
                    </div>

                    <!-- Media Library -->
                    <div class="media-library-section">
                        <h6 class="mb-3">Media Library</h6>
                        <div ng-if="loading" class="text-center py-4">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div ng-if="!loading && mediaLibrary.length === 0" class="text-center py-4 text-muted">
                            <i class="bi bi-image fs-1 d-block mb-2"></i>
                            <p>No media uploaded yet</p>
                        </div>
                        <div ng-if="!loading && mediaLibrary.length > 0" class="row g-2">
                            <div class="col-md-3 col-sm-4 col-6" ng-repeat="media in mediaLibrary">
                                <div class="media-library-item position-relative"
                                     ng-class="{'selected': isSelected(media)}"
                                     ng-click="toggleSelection(media)">
                                    <img ng-if="media.url" 
                                         ng-src="{{ media.url }}" 
                                         alt="{{ media.name }}"
                                         class="img-fluid rounded media-library-thumb">
                                    <div class="media-library-overlay">
                                        <i class="bi bi-check-circle-fill"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs) {
                var uploader = null;
                var fileInputId = 'mediaUploadFileInput';
                var uploadAreaId = 'mediaUploadArea';
                
                // Initialize properties
                scope.mediaLibrary = [];
                scope.loading = false;
                scope.uploading = false;
                scope.isDragging = false;
                
                // Initialize selectedMedia from ngModel binding
                if (!scope.selectedMedia) {
                    scope.selectedMedia = [];
                }

                // Initialize uploader
                function initializeUploader() {
                    if (!uploader) {
                        uploader = uploadservice.getNewInstance(uploadAreaId, "/dashboard/api/media/upload");
                        uploader.getFileTypes = function() {
                            return '.jpeg,.jpg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv';
                        };
                        
                        $timeout(function() {
                            if (uploader && uploader.myDropzone) {
                                uploader.myDropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv';
                                uploader.myDropzone.options.maxFilesize = 100;
                                uploader.myDropzone.options.paramName = 'files[]';
                                uploader.myDropzone.options.autoProcessQueue = false;
                                
                                uploader.myDropzone.on("addedfile", function(file) {
                                    $timeout(function() {
                                        processUploadQueue();
                                    }, 100);
                                });
                                
                                uploader.myDropzone.on("queuecomplete", function() {
                                    scope.uploading = false;
                                    if (!scope.$$phase && !scope.$root.$$phase) {
                                        scope.$apply();
                                    }
                                });
                            }
                        }, 100);
                        
                        uploader.onUploadComplete = function(response) {
                            if (response.success) {
                                var uploadedMedia = normalizeMediaResponse(response.data);
                                if (uploadedMedia.length > 0) {
                                    // Add to media library
                                    uploadedMedia.forEach(function(media) {
                                        scope.mediaLibrary.unshift(media);
                                    });
                                    // Auto-select newly uploaded media
                                    uploadedMedia.forEach(function(media) {
                                        if (!scope.isSelected(media)) {
                                            scope.selectedMedia.push(media);
                                        }
                                    });
                                    // Update parent model (selectedMedia is already bound via ngModel)
                                    if (scope.onMediaUploaded) {
                                        scope.onMediaUploaded({ media: uploadedMedia });
                                    }
                                    utils.alertSuccess('Success', uploadedMedia.length + ' file(s) uploaded successfully');
                                }
                                if (uploader.myDropzone) {
                                    uploader.myDropzone.removeAllFiles();
                                }
                            } else {
                                utils.alertError('Error', response.message || 'Failed to upload media');
                            }
                            scope.uploading = false;
                            if (!scope.$$phase && !scope.$root.$$phase) {
                                scope.$apply();
                            }
                        };
                    }
                }

                function processUploadQueue() {
                    if (!uploader || !uploader.myDropzone) {
                        return;
                    }

                    if (!uploader.myDropzone.files || uploader.myDropzone.files.length === 0) {
                        return;
                    }

                    scope.uploading = true;
                    uploader.processQueue();
                }

                function normalizeMediaResponse(data) {
                    if (Array.isArray(data)) {
                        return data;
                    } else if (data) {
                        return [data];
                    }
                    return [];
                }

                // Load media library
                function loadMediaLibrary() {
                    scope.loading = true;
                    services.getUploadedMedia(1, 50, function(response) {
                        scope.loading = false;
                        if (response.success) {
                            scope.mediaLibrary = response.data || [];
                        } else {
                            utils.alertError('Error', response.message || 'Failed to load media library');
                        }
                        if (!scope.$$phase && !scope.$root.$$phase) {
                            scope.$apply();
                        }
                    });
                }

                // File input handling
                scope.triggerFileInput = function() {
                    $timeout(function() {
                        var fileInput = document.getElementById(fileInputId);
                        if (fileInput) {
                            fileInput.click();
                        }
                    }, 0);
                };

                // Drag and drop handlers
                scope.handleDragOver = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    scope.isDragging = true;
                    if (!scope.$$phase && !scope.$root.$$phase) {
                        scope.$apply();
                    }
                };

                scope.handleDragLeave = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    scope.isDragging = false;
                    if (!scope.$$phase && !scope.$root.$$phase) {
                        scope.$apply();
                    }
                };

                scope.handleDrop = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    scope.isDragging = false;
                    
                    var files = event.dataTransfer.files;
                    if (files && files.length > 0) {
                        scope.onFileSelect(files);
                    }
                    if (!scope.$$phase && !scope.$root.$$phase) {
                        scope.$apply();
                    }
                };

                // File selection handler
                scope.onFileSelect = function(files) {
                    if (!files || files.length === 0) return;

                    scope.uploading = true;
                    
                    var formData = new FormData();
                    for (var i = 0; i < files.length; i++) {
                        formData.append('files[]', files[i]);
                    }

                    services.uploadMedia(formData, function(response) {
                        if (response.success) {
                            var uploadedMedia = normalizeMediaResponse(response.data);
                            if (uploadedMedia.length > 0) {
                                // Add to media library
                                uploadedMedia.forEach(function(media) {
                                    scope.mediaLibrary.unshift(media);
                                });
                                // Auto-select newly uploaded media
                                uploadedMedia.forEach(function(media) {
                                    if (!scope.isSelected(media)) {
                                        scope.selectedMedia.push(media);
                                    }
                                });
                                    // Update parent model (selectedMedia is already bound via ngModel)
                                    if (scope.onMediaUploaded) {
                                        scope.onMediaUploaded({ media: uploadedMedia });
                                    }
                                utils.alertSuccess('Success', uploadedMedia.length + ' file(s) uploaded successfully');
                            }
                        } else {
                            utils.alertError('Error', response.message || 'Failed to upload media');
                        }
                        scope.uploading = false;
                        if (!scope.$$phase && !scope.$root.$$phase) {
                            scope.$apply();
                        }
                    });
                };

                // Media selection handlers
                scope.isSelected = function(media) {
                    return scope.selectedMedia.some(function(m) {
                        return (m.uuid || m.id) === (media.uuid || media.id);
                    });
                };

                scope.toggleSelection = function(media) {
                    var index = scope.selectedMedia.findIndex(function(m) {
                        return (m.uuid || m.id) === (media.uuid || media.id);
                    });
                    
                    if (index > -1) {
                        scope.selectedMedia.splice(index, 1);
                    } else {
                        scope.selectedMedia.push(media);
                    }
                    
                    // Update parent model (selectedMedia is already bound via ngModel)
                    if (scope.onMediaSelected) {
                        scope.onMediaSelected({ media: media, selected: index === -1 });
                    }
                    
                    if (!scope.$$phase && !scope.$root.$$phase) {
                        scope.$apply();
                    }
                };

                // Set up file input listener
                $timeout(function() {
                    var fileInput = document.getElementById(fileInputId);
                    if (fileInput) {
                        fileInput.addEventListener('change', function(e) {
                            if (e.target.files && e.target.files.length > 0) {
                                $timeout(function() {
                                    scope.onFileSelect(e.target.files);
                                    e.target.value = '';
                                }, 0);
                            }
                        });
                    }
                }, 100);

                // Initialize
                initializeUploader();
                loadMediaLibrary();

                // Watch for external changes to selectedMedia (bound via ngModel)
                scope.$watch('selectedMedia', function(newVal) {
                    if (!newVal) {
                        scope.selectedMedia = [];
                    }
                }, true);

                // Cleanup
                scope.$on('$destroy', function() {
                    if (uploader && uploader.myDropzone) {
                        try {
                            uploader.myDropzone.destroy();
                        } catch (e) {
                            // Ignore errors
                        }
                    }
                });
            }
        };
    }
})();

