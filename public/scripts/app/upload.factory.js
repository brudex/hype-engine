(function () {
    angular
        .module('app')
        .factory('uploadservice', UploadService);
    UploadService.$inject = ['$http','brudexutils', '$window'];
    function UploadService($http,utils, $window) {
        const dropZones ={};
        $window.Dropzone.autoDiscover = false;
        return {
            getNewInstance: createDropZone,
        };
        function getFileTypes() {
            var ftps = "jpeg;jpg;png";
            var arr = ftps.split(/[,;\-]/);
            var str = '';
            var index = 0;
            arr.forEach(function (item) {
                if (index === 0) {
                    str += "." + item;
                } else {
                    str += ",." + item;
                }
                index++;
            });
            return str;
        }
        function createDropZone(elementId,uploadUrl){
            const instance = {
                uploadBatchIds:[],
                uploadUrl:uploadUrl,
                onUploadComplete:function(){},
                reqBody:{},
                getFileTypes:getFileTypes
            };
            initDropZone(instance,elementId);
            return instance;
         }
        function initDropZone(instance,elementId) {
            if(instance.initialized){
                return;
            }
            instance.initialized = true;
            $(document).ready(function () {
                 $window.Dropzone.autoDiscover = false;
                 var allowMultiple = false;
                 const myDropzone = new $window.Dropzone("#"+elementId, {
                    url: instance.uploadUrl,
                    acceptedFiles: instance.getFileTypes(),
                    autoProcessQueue: false,
                    addRemoveLinks: true,
                    uploadMultiple: allowMultiple,
                    parallelUploads: 10,
                    paramName: "files",
                    maxFilesize: 5, // 5MB max file size
                    sending: function(file, xhr, formData) {
                        // Add reqBody data to the form data
                        Object.keys(instance.reqBody).forEach(function(key) {
                            formData.append(key, instance.reqBody[key]);
                        });
                    }
                });
                $window.Dropzone.options.myDropzone = {
                    uploadMultiple: allowMultiple,
                    parallelUploads: 10,
                    paramName: "files"
                }
                myDropzone.on("success", function (file, response) {
                    console.log("File successfully uploaded", response);
                    if (response.status === "00") {
                        instance.uploadBatchIds.push(response.message);
                    }
                    instance.onUploadComplete(response);
                });
                myDropzone.on("processing", function () {
                    this.options.autoProcessQueue = true;
                });
                myDropzone.on("error", function (file, error) {
                    console.log("Error uploading file", error);
                    if (error.message) {
                        utils.alertError(error.message);
                    } else {
                        utils.alertError("An error occurred while uploading the file.");
                    }
                });
                myDropzone.on("complete", function (file) {
                    console.log('The uploaded file',file);
                 });
                instance.myDropzone = myDropzone;
                instance.processQueue = function(){
                    instance.uploadBatchIds=[];
                    myDropzone.processQueue();
                }
            });
        }

    }
})();
