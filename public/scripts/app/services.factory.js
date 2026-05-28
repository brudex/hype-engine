(function ($) {
    angular
        .module('app')
        .factory('brudexservices', DataService);
    DataService.$inject = ['$http', '$location', '$window'];
    function DataService($http, $location, $window) {
        var baseUrl = $("#___applicationbaseUrl").val();
         if (baseUrl === "") {
            baseUrl = "/";
        }
         var spinner = null;
        var spinTarget = null;
        return {

          
 

            // Media Management
            getUploadedMedia: function(page, limit, callback) {
                if (arguments.length === 2) {
                    callback = limit;
                    limit = 30;
                }
                var url = 'dashboard/api/media/uploaded?page=' + page + '&limit=' + limit;
                getDataNoSpinner(url)(callback);
            },
            uploadMedia: function(formData, callback) {
                $http.post(baseUrl + 'dashboard/api/media/upload', formData, {
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to upload media' });
                });
            },
            deleteMedia: function(ids, callback) {
                $http.delete(baseUrl + 'dashboard/api/media', {
                    data: { ids: ids },
                    headers: {'Content-Type': 'application/json'}
                }).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to delete media' });
                });
            },
            getStockMedia: function(keyword, page, callback) {
                var url = 'dashboard/api/media/stock?keyword=' + encodeURIComponent(keyword || '') + '&page=' + (page || 1);
                getDataNoSpinner(url)(callback);
            },
            getGifs: function(keyword, page, callback) {
                var url = 'dashboard/api/media/gifs?keyword=' + encodeURIComponent(keyword || '') + '&page=' + (page || 1);
                getDataNoSpinner(url)(callback);
            },
            downloadExternalMedia: postData('dashboard/api/media/download'),

            // Project Management
            getProjects: getData('dashboard/api/projects'),
            getProject: function(uuid, callback) {
                getData('dashboard/api/projects/' + uuid)(callback);
            },
            createProject: postData('dashboard/api/projects'),
            updateProject: function(uuid, data, callback) {
                var formData = data instanceof FormData ? data : new FormData();
                if (!(data instanceof FormData)) {
                    Object.keys(data).forEach(function(key) {
                        formData.append(key, data[key]);
                    });
                }
                $http.put(baseUrl + 'dashboard/api/projects/' + uuid, formData, {
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to update project' });
                });
            },
            deleteProject: function(uuid, callback) {
                $http.delete(baseUrl + 'dashboard/api/projects/' + uuid).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to delete project' });
                });
            },

            // Social Flows (dashboard session API)
            getFlows: getData('dashboard/api/flows'),
            createFlow: function(payload, callback) {
                $http.post(baseUrl + 'dashboard/api/flows', payload, {
                    headers: { 'Content-Type': 'application/json' }
                }).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to create flow' });
                });
            },
            updateFlow: function(uuid, payload, callback) {
                $http.put(baseUrl + 'dashboard/api/flows/' + uuid, payload, {
                    headers: { 'Content-Type': 'application/json' }
                }).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to update flow' });
                });
            },
            deleteFlow: function(uuid, callback) {
                $http.delete(baseUrl + 'dashboard/api/flows/' + uuid).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to delete flow' });
                });
            },

            // Services Management
            getServices: getData('dashboard/api/services'),
            getService: getDataNoSpinner('dashboard/api/services'), //name will be passed to the returned method
            updateService: postData('dashboard/api/services'),

            // Posts Management
            createPost: postData('dashboard/api/posts/save'),
            getPost:getData('dashboard/api/posts/details'), //uuid will be passed when call the method returned
            updatePost: postData('dashboard/api/posts/update'),
            deletePost: getData('dashboard/api/posts/delete'),//uuid will be passed when call the method returned
            deleteMultiplePosts: postData('dashboard/api/posts/delete-multiple'),
            // Accounts Management
            getAccounts: getDataNoSpinner('dashboard/api/accounts/project'), //projectUuid will be passed to the returned method
            getAccount: getDataNoSpinner('dashboard/api/accounts/single'), //uuid will be passed to the returned method

            // Tags Management
            getTagsByProject: getDataNoSpinner('dashboard/api/tags/project'), //projectUuid will be passed to the returned method
            createTag: postDataNoSpinner('dashboard/api/tags/create'),
            updateTag: postDataNoSpinner('dashboard/api/tags/update'),
            deleteTag: getDataNoSpinner('dashboard/api/tags/delete'), //uuid will be passed to the returned method

            // Reports Management
            getReports: function(projectUuid, payload, callback) {
                var url = 'dashboard/api/reports/project/' + projectUuid;
                $http.post(baseUrl + url, payload, {
                    headers: {'Content-Type': 'application/json'}
                }).then(function(response) {
                    callback(response.data);
                }).catch(function(error) {
                    callback(error.data || { success: false, message: 'Failed to fetch reports' });
                });
            },

            // Calendar Management
            getCalendarData: postDataNoSpinner("dashboard/api/calendar") 

        };
        function startSpiner() {
            var opts =  {
                lines: 13,
                length: 42,
                width: 28,
                radius: 80,
                scale: 1,
                corners: 1,
                color: '#000',
                opacity: 0.25,
                fadeColor: 'transparent',
                speed: 1,
                rotate: 0,
                animation: 'spinner-line-fade-quick',
                direction: 1,
                zIndex: 2e9,
                className: 'myspinner',
                top: '30%',
                left: '50%',
                shadow: false,
                position: 'absolute'
            };
            if (!spinTarget) {
                spinTarget = $window.document.getElementById('spinnerContainer');
                spinner = new $window.Spinner(opts);
            }
            spinner.spin(spinTarget);
        }

        function stopSpinner() {
            spinner.stop(spinTarget);
        }

        function postData(endpoint) {
            return function (data, callback) {
                if (!callback) {
                    callback = data;
                    data = {};
                }
                var url = baseUrl + endpoint;
                startSpiner();
                doPost(url, data, function (err, response) {
                    stopSpinner();
                    if (err) {
                        console.log(err);
                        return;
                    }
                    callback(response.data);
                });
            }
        }


        function postDataNoSpinner(endpoint) {
            return function (data, callback) {
                if (!callback) {
                    callback = data;
                    data = {};
                }
                var url = baseUrl + endpoint;
                doPost(url, data, function (err, response) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    callback(response.data);
                });
            }
        }

        function getData(endpoint,isQuery) {
            return function (callback) {
                var param= "";
                if (arguments.length > 1) {
                    if(isQuery) {
                        param =   "=" + arguments[0];
                        callback = arguments[1];
                    }else{
                        param =   "/" + arguments[0];
                        callback = arguments[1];
                    }
                }
                var url = endpoint + param;
                 startSpiner();
                 console.log("The url is >>>"+url);
                doGet(url, function (err, response) {
                    stopSpinner();
                    if (err) {
                        console.error(err);
                        return;
                    }
                    callback(response.data);
                });
            }
        }

        function getDataNoSpinner(endpoint) {
            return function (callback) {
                var param= "";
                if (arguments.length > 1) {
                    param =   "/" + arguments[0];
                    callback = arguments[1];
                }
                var url = endpoint + param;
                doGet(url, function (err, response) {

                    if (err) {
                        console.log("Error getting url"+url,err );
                        return;
                    }
                    callback(response.data);
                });
            }
        }
        function doPost(url, data, callback) {
            return $http.post(url, data)
               .then(function (response) {
                   if (response == null) {
                       return callback(null, { status: "07", message: "Error in response" });
                   }
                   return callback(null, response);
               })
               .catch(function (error) {
                   console.log(error);
                   callback(error);
               });
        }
        function doGet(endpoint, callback) {
            var url = baseUrl + endpoint;
            console.log('the url>>>', url);
            return $http.get(url)
               .then(function (response) {
                   if (response == null) {
                       return callback(null, { status: "07", message: "Error in response" });
                   }
                   return callback(null, response);
               })
               .catch(function (error) {
                   console.log(error);
                   return callback(error);
               });
        }
    }
})(window.jQuery);
