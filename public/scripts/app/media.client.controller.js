(function () {
    'use strict';
    angular
        .module('app')
        .controller('HypeEngineMediaController', HypeEngineMediaController);

    HypeEngineMediaController.$inject = ['$scope', 'brudexservices', 'brudexutils', 'uploadservice', '$http', '$timeout'];

    function HypeEngineMediaController($scope, services, utils, uploadservice, $http, $timeout) {
        var vm = this;

        // Properties
        vm.media = [];
        vm.page = 1;
        vm.hasMore = false;
        vm.loading = false;
        vm.uploading = false;
        vm.selectedItems = [];
        vm.uploader = null;

        // Methods
        vm.init = init;
        vm.loadMedia = loadMedia;
        vm.loadMore = loadMore;
        vm.onFileSelect = onFileSelect;
        vm.deleteMedia = deleteMedia;
        vm.selectMedia = selectMedia;
        vm.formatFileSize = formatFileSize;
        vm.createPost = createPost;
        vm.deleteSelected = deleteSelected;
        vm.saveMediaUpload = saveMediaUpload;

        // Initialize
        function init() {
            loadMedia();
            
            // Set up file input event listeners (CSP compliant)
            $timeout(function() {
                var mediaFileInput = document.getElementById('mediaFileInput');
                var mediaFileInputEmpty = document.getElementById('mediaFileInputEmpty');
                
                if (mediaFileInput) {
                    mediaFileInput.addEventListener('change', function(e) {
                        if (e.target.files && e.target.files.length > 0) {
                            $timeout(function() {
                                vm.onFileSelect(e.target.files);
                            }, 0);
                        }
                    });
                }
                
                if (mediaFileInputEmpty) {
                    mediaFileInputEmpty.addEventListener('change', function(e) {
                        if (e.target.files && e.target.files.length > 0) {
                            $timeout(function() {
                                vm.onFileSelect(e.target.files);
                            }, 0);
                        }
                    });
                }
            }, 100);
            
            // Set up image error handlers (CSP compliant) - use event delegation
            $timeout(function() {
                // Use event delegation for dynamically loaded images
                document.addEventListener('error', function(e) {
                    if (e.target && e.target.tagName === 'IMG' && e.target.classList.contains('media-item-image')) {
                        // Prevent infinite loop
                        if (!e.target.dataset.errorHandled) {
                            e.target.dataset.errorHandled = 'true';
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%231F1F23\' width=\'200\' height=\'200\'/%3E%3Ctext fill=\'%23B0B0B0\' font-family=\'sans-serif\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImage%3C/text%3E%3C/svg%3E';
                        }
                    }
                }, true); // Use capture phase
            }, 200);
            
            // Initialize uploader
            setTimeout(function() {
                if (!vm.uploader) {
                    vm.uploader = uploadservice.getNewInstance("mediaUploadArea", "/dashboard/api/media/upload");
                    vm.uploader.getFileTypes = function() {
                        return '.jpeg,.jpg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv'; // Define accepted file types
                    }
                    // Override accepted file types after dropzone is initialized
                    setTimeout(function() {
                        if (vm.uploader && vm.uploader.myDropzone) {
                            vm.uploader.myDropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv';
                            vm.uploader.myDropzone.options.maxFilesize = 100; // 100MB max file size
                            vm.uploader.myDropzone.options.paramName = 'files[]';
                            // Keep autoProcessQueue: false to show previews before upload
                            vm.uploader.myDropzone.options.autoProcessQueue = false;
                            
                            // Set up file added handler to show preview
                            vm.uploader.myDropzone.on("addedfile", function(file) {
                                // File preview will be shown automatically by Dropzone
                                $timeout(function() {}, 0);
                            });
                            
                            // Set up upload progress handler
                            vm.uploader.myDropzone.on("uploadprogress", function(file, progress, bytesSent) {
                                // Update progress if needed
                            });
                            
                            // Set up queue complete handler
                            vm.uploader.myDropzone.on("queuecomplete", function() {
                                vm.uploading = false;
                                $timeout(function() {}, 0);
                            });
                        }
                    }, 100);
                    
                    // Set up upload complete handler
                    vm.uploader.onUploadComplete = function(response) {
                        if (response.success) {
                            vm.page = 1;
                            vm.media = [];
                            loadMedia();
                            var count = response.count || 1;
                            utils.alertSuccess('Success', count + ' file(s) uploaded successfully');
                            
                            // Clear the Dropzone files after successful upload
                            if (vm.uploader.myDropzone) {
                                vm.uploader.myDropzone.removeAllFiles();
                            }
                        } else {
                            utils.alertError('Error', response.message || 'Failed to upload media');
                        }
                        vm.uploading = false;
                    };
                }
            }, 500);
        }

        function loadMedia() {
            if (vm.loading) return;
            vm.loading = true;

            services.getUploadedMedia(vm.page, 24, function(response) {
                if (response.success) {
                    if (vm.page === 1) {
                        vm.media = response.data;
                    } else {
                        vm.media = vm.media.concat(response.data);
                    }
                    vm.hasMore = response.meta.page < response.meta.last_page;
                    vm.page++;
                } else {
                    utils.alertError('Error', response.message || 'Failed to load media');
                }
                vm.loading = false;
            });
        }

        function loadMore() {
            loadMedia();
        }

        // File upload using file input (fallback)
        function onFileSelect(files) {
            if (!files || files.length === 0) return;

            vm.uploading = true;
            // Trigger digest cycle for inline event handlers
            $timeout(function() {}, 0);
            
            const formData = new FormData();
            
            // Append files
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }

            $http.post('/dashboard/api/media/upload', formData, {
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function(response) {
                if (response.data.success) {
                    vm.page = 1;
                    vm.media = [];
                    loadMedia();
                    var count = response.data.count || files.length;
                    utils.alertSuccess('Success', count + ' file(s) uploaded successfully');
                } else {
                    utils.alertError('Error', response.data.message || 'Failed to upload media');
                }
                vm.uploading = false;
            }).catch(function(error) {
                console.error('Upload error:', error);
                var errorMsg = error.data?.message || error.data?.error || 'Failed to upload media';
                utils.alertError('Error', errorMsg);
                vm.uploading = false;
            });
        }

        // Delete media
        function deleteMedia(uuid) {
            utils.alertConfirm('Delete Media', 
                'Are you sure you want to delete this media? This action cannot be undone.', 
                function(result) {
                    if (result.isConfirmed) {
                        services.deleteMedia([uuid], function(response) {
                            if (response.success !== false) {
                                vm.media = vm.media.filter(function(m) {
                                    return m.uuid !== uuid;
                                });
                                // Remove from selected items if present
                                vm.selectedItems = vm.selectedItems.filter(function(m) {
                                    return m.uuid !== uuid;
                                });
                                utils.alertSuccess('Success', 'Media deleted successfully');
                            } else {
                                utils.alertError('Error', response.message || 'Failed to delete media');
                            }
                        });
                    }
                },
                {
                    confirmButtonText: 'Yes, Delete',
                    icon: 'warning'
                }
            );
        }

        // Delete selected media
        function deleteSelected() {
            if (vm.selectedItems.length === 0) {
                utils.alertWarning('Warning', 'Please select media to delete');
                return;
            }

            var ids = vm.selectedItems.map(function(item) {
                return item.uuid;
            });
            var count = vm.selectedItems.length;

            utils.alertConfirm('Delete Selected Media', 
                'Are you sure you want to delete ' + count + ' selected media item(s)? This action cannot be undone.', 
                function(result) {
                    if (result.isConfirmed) {
                        services.deleteMedia(ids, function(response) {
                            if (response.success !== false) {
                                // Remove deleted items from media array
                                vm.media = vm.media.filter(function(m) {
                                    return ids.indexOf(m.uuid) === -1;
                                });
                                vm.selectedItems = [];
                                utils.alertSuccess('Success', count + ' media item(s) deleted successfully');
                            } else {
                                utils.alertError('Error', response.message || 'Failed to delete media');
                            }
                        });
                    }
                },
                {
                    confirmButtonText: 'Yes, Delete',
                    icon: 'warning'
                }
            );
        }

        // Select media
        function selectMedia(item) {
            item.selected = !item.selected;
            if (item.selected) {
                vm.selectedItems.push(item);
            } else {
                vm.selectedItems = vm.selectedItems.filter(function(m) {
                    return m.uuid !== item.uuid;
                });
            }
        }

        // Create post with selected media
        function createPost() {
            if (vm.selectedItems.length === 0) {
                utils.alertWarning('Warning', 'Please select media to create a post');
                return;
            }
            // Redirect to posts page with selected media
            var mediaIds = vm.selectedItems.map(function(item) {
                return item.uuid;
            });
            window.location.href = '/dashboard/posts/create?media=' + mediaIds.join(',');
        }

        // Format file size
        function formatFileSize(bytes) {
            if (!bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        // Save/Upload media files from dropzone
        function saveMediaUpload() {
            if (!vm.uploader || !vm.uploader.myDropzone) {
                utils.alertWarning('Warning', 'No files selected for upload');
                return;
            }

            if (!vm.uploader.myDropzone.files || vm.uploader.myDropzone.files.length === 0) {
                utils.alertWarning('Warning', 'Please select files to upload');
                return;
            }

            vm.uploading = true;
            
            // Set up upload complete handler
            vm.uploader.onUploadComplete = function(response) {
                if (response.success) {
                    vm.page = 1;
                    vm.media = [];
                    loadMedia();
                    var count = response.count || vm.uploader.myDropzone.files.length;
                    utils.alertSuccess('Success', count + ' file(s) uploaded successfully');
                    
                    // Clear the Dropzone files after successful upload
                    if (vm.uploader.myDropzone) {
                        vm.uploader.myDropzone.removeAllFiles();
                    }
                } else {
                    utils.alertError('Error', response.message || 'Failed to upload media');
                }
                vm.uploading = false;
            };

            // Process the queue to start uploads
            vm.uploader.processQueue();
        }
    }
})();
