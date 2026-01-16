(function () {
    'use strict';
    angular
        .module('app')
        .directive('timePicker', timePickerDirective);

    timePickerDirective.$inject = ['$timeout'];

    function timePickerDirective($timeout) {
        return {
            restrict: 'E',
            scope: {
                time: '=ngModel',
                onSelect: '&'
            },
            template: '<div class="time-picker-wrapper">' +
                      '<div class="timepicker-container">' +
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
                
                // Update time model
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
            }
        };
    }
})();

