(function () {
    'use strict';
    angular
        .module('app')
        .directive('dateTimePicker', dateTimePickerDirective);

    dateTimePickerDirective.$inject = ['$timeout'];

    function dateTimePickerDirective($timeout) {
        return {
            restrict: 'E',
            scope: {
                date: '=ngModel',
                time: '=ngTime',
                onSelect: '&',
                minDate: '@',
                maxDate: '@',
                placeholder: '@'
            },
            template: '<div class="date-time-picker-wrapper">' +
                      '<div class="datepicker-container"></div>' +
                      '<div class="timepicker-container mt-3">' +
                      '<div class="d-flex align-items-center gap-3">' +
                      '<label class="form-label mb-0">Time</label>' +
                      '<div class="d-flex align-items-center gap-2">' +
                      '<input type="number" class="form-control text-center time-input" ng-model="timeHour" min="1" max="12" placeholder="12">' +
                      '<span>:</span>' +
                      '<input type="number" class="form-control text-center time-input" ng-model="timeMinute" min="0" max="59" placeholder="00">' +
                      '<select class="form-select time-am-pm" ng-model="timeAmPm">' +
                      '<option value="AM">AM</option>' +
                      '<option value="PM">PM</option>' +
                      '</select>' +
                      '</div>' +
                      '</div>' +
                      '</div>' +
                      '</div>',
            link: function (scope, element, attrs) {
                var datepickerInstance = null;
                var datepickerElement = null;
                
                // Get the datepicker container element
                function getDatepickerElement() {
                    if (!datepickerElement) {
                        // Try querySelector first (native DOM)
                        var container = element[0].querySelector('.datepicker-container');
                        if (container) {
                            datepickerElement = container;
                        } else {
                            // Fallback to jQuery/jqLite find
                            var found = element.find ? element.find('.datepicker-container') : null;
                            if (found && found.length > 0) {
                                datepickerElement = found[0];
                            }
                        }
                    }
                    return datepickerElement;
                }
                
                // Initialize time values as empty
                scope.timeHour = null;
                scope.timeMinute = null;
                scope.timeAmPm = 'AM';
                
                // Flag to prevent circular updates
                var isUpdatingFromInput = false;
                
                // Convert 24-hour to 12-hour format
                function to12Hour(hour24) {
                    if (hour24 === 0) {
                        return { hour: 12, ampm: 'AM' };
                    } else if (hour24 < 12) {
                        return { hour: hour24, ampm: 'AM' };
                    } else if (hour24 === 12) {
                        return { hour: 12, ampm: 'PM' };
                    } else {
                        return { hour: hour24 - 12, ampm: 'PM' };
                    }
                }
                
                // Convert 12-hour to 24-hour format
                function to24Hour(hour12, ampm) {
                    if (ampm === 'AM') {
                        if (hour12 === 12) {
                            return 0;
                        }
                        return hour12;
                    } else { // PM
                        if (hour12 === 12) {
                            return 12;
                        }
                        return hour12 + 12;
                    }
                }
                
                // Parse time from string (HH:mm format - 24-hour)
                function parseTime(timeStr) {
                    if (!timeStr || timeStr.trim() === '') {
                        return { hour: null, minute: null, ampm: 'AM' };
                    }
                    var parts = timeStr.split(':');
                    var hour24 = parseInt(parts[0]) || null;
                    var minute = parseInt(parts[1]) || null;
                    
                    if (hour24 === null || minute === null) {
                        return { hour: null, minute: null, ampm: 'AM' };
                    }
                    
                    var time12 = to12Hour(hour24);
                    return {
                        hour: time12.hour,
                        minute: minute,
                        ampm: time12.ampm
                    };
                }
                
                // Format time to string (HH:mm format - 24-hour)
                function formatTime(hour12, minute, ampm) {
                    if (hour12 === null || hour12 === undefined || minute === null || minute === undefined) {
                        return '';
                    }
                    var hour24 = to24Hour(hour12, ampm);
                    return String(hour24).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
                }
                
                // Update time model (without calling onSelect - only update model)
                scope.updateTime = function() {
                    // Ensure values are valid numbers
                    var hour = scope.timeHour;
                    var minute = scope.timeMinute;
                    
                    // Validate and constrain hour (1-12)
                    if (hour !== null && hour !== undefined) {
                        hour = parseInt(hour);
                        if (isNaN(hour) || hour < 1) hour = 1;
                        if (hour > 12) hour = 12;
                        if (scope.timeHour !== hour) {
                            scope.timeHour = hour;
                        }
                    }
                    
                    // Validate and constrain minute (0-59)
                    if (minute !== null && minute !== undefined) {
                        minute = parseInt(minute);
                        if (isNaN(minute) || minute < 0) minute = 0;
                        if (minute > 59) minute = 59;
                        if (scope.timeMinute !== minute) {
                            scope.timeMinute = minute;
                        }
                    }
                    
                    if (hour !== null && hour !== undefined && 
                        minute !== null && minute !== undefined &&
                        scope.timeAmPm) {
                        var newTime = formatTime(hour, minute, scope.timeAmPm);
                        if (scope.time !== newTime) {
                            isUpdatingFromInput = true;
                            scope.time = newTime;
                            $timeout(function() {
                                isUpdatingFromInput = false;
                            }, 0);
                        }
                    } else {
                        if (scope.time !== '') {
                            isUpdatingFromInput = true;
                            scope.time = '';
                            $timeout(function() {
                                isUpdatingFromInput = false;
                            }, 0);
                        }
                    }
                };
                
                // Initialize datepicker
                function initDatepicker() {
                    var container = getDatepickerElement();
                    if (!container || typeof Datepicker === 'undefined') {
                        if (typeof Datepicker === 'undefined') {
                            console.warn('Datepicker library not loaded');
                        }
                        return;
                    }
                    datepickerElement = container;
                    
                    // Destroy existing instance if any
                    if (datepickerInstance) {
                        try {
                            datepickerInstance.destroy();
                        } catch (e) {
                            // Ignore errors
                        }
                    }
                    
                    var options = {
                        format: 'yyyy-mm-dd',
                        autohide: true,
                        todayHighlight: true
                    };
                    
                    // Set min date if provided
                    if (scope.minDate === 'today') {
                        options.minDate = new Date();
                    } else if (scope.minDate) {
                        options.minDate = new Date(scope.minDate);
                    }
                    
                    // Set max date if provided
                    if (scope.maxDate) {
                        options.maxDate = new Date(scope.maxDate);
                    }
                    
                    // Set initial date if provided
                    if (scope.date) {
                        try {
                            var dateObj = new Date(scope.date);
                            if (!isNaN(dateObj.getTime())) {
                                options.defaultViewDate = dateObj;
                            }
                        } catch (e) {
                            // Ignore date parsing errors
                        }
                    }
                    
                    try {
                        datepickerInstance = new Datepicker(datepickerElement, options);
                        
                        // Handle date selection (only update model, don't call onSelect)
                        datepickerElement.addEventListener('changeDate', function(e) {
                            var selectedDate = e.detail.date;
                            if (selectedDate) {
                                var year = selectedDate.getFullYear();
                                var month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                var day = String(selectedDate.getDate()).padStart(2, '0');
                                scope.date = year + '-' + month + '-' + day;
                                
                                if (!scope.$$phase && !scope.$root.$$phase) {
                                    scope.$apply();
                                }
                            }
                        });
                    } catch (e) {
                        console.error('Error initializing datepicker:', e);
                        // Retry after a short delay if initialization failed
                        $timeout(function() {
                            if (!datepickerInstance) {
                                initDatepicker();
                            }
                        }, 200);
                    }
                }
                
                // Watch for date changes from outside
                scope.$watch('date', function(newDate) {
                    if (newDate && datepickerInstance) {
                        var dateObj = new Date(newDate);
                        if (!isNaN(dateObj.getTime())) {
                            datepickerInstance.setDate(dateObj, { render: true });
                        }
                    }
                });
                
                // Watch for time changes from outside (but not from our own updates)
                scope.$watch('time', function(newTime, oldTime) {
                    if (isUpdatingFromInput) {
                        return; // Skip if we're updating from input
                    }
                    
                    if (newTime && newTime.trim() !== '' && newTime !== oldTime) {
                        var timeObj = parseTime(newTime);
                        if (scope.timeHour !== timeObj.hour || 
                            scope.timeMinute !== timeObj.minute || 
                            scope.timeAmPm !== timeObj.ampm) {
                            scope.timeHour = timeObj.hour;
                            scope.timeMinute = timeObj.minute;
                            scope.timeAmPm = timeObj.ampm;
                        }
                    } else if (!newTime || newTime.trim() === '') {
                        if (scope.timeHour !== null || scope.timeMinute !== null || scope.timeAmPm !== 'AM') {
                            scope.timeHour = null;
                            scope.timeMinute = null;
                            scope.timeAmPm = 'AM';
                        }
                    }
                }, true);
                
                // Watch the individual inputs to update on every change
                scope.$watch('timeHour', function(newVal, oldVal) {
                    if (newVal !== oldVal && !isUpdatingFromInput) {
                        $timeout(function() {
                            scope.updateTime();
                        }, 0);
                    }
                });
                
                scope.$watch('timeMinute', function(newVal, oldVal) {
                    if (newVal !== oldVal && !isUpdatingFromInput) {
                        $timeout(function() {
                            scope.updateTime();
                        }, 0);
                    }
                });
                
                scope.$watch('timeAmPm', function(newVal, oldVal) {
                    if (newVal !== oldVal && !isUpdatingFromInput) {
                        $timeout(function() {
                            scope.updateTime();
                        }, 0);
                    }
                });
                
                // Initialize after DOM is ready - with delay for modals
                $timeout(function() {
                    initDatepicker();
                }, 100);
                
                // Watch for when element becomes visible (for modals)
                var checkVisibility = function() {
                    var container = getDatepickerElement();
                    if (container && container.offsetParent !== null) {
                        // Element is visible, ensure datepicker is initialized
                        if (!datepickerInstance) {
                            initDatepicker();
                        }
                    }
                };
                
                // Check visibility periodically when in modal (up to 2 seconds)
                var visibilityCheckInterval = setInterval(function() {
                    var container = getDatepickerElement();
                    if (container && container.offsetParent !== null) {
                        checkVisibility();
                        clearInterval(visibilityCheckInterval);
                    }
                }, 100);
                
                // Clear interval after 2 seconds
                setTimeout(function() {
                    clearInterval(visibilityCheckInterval);
                }, 2000);
                
                // Cleanup
                scope.$on('$destroy', function() {
                    if (datepickerInstance) {
                        datepickerInstance.destroy();
                        datepickerInstance = null;
                    }
                });
            }
        };
    }
})();

