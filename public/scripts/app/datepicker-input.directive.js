(function () {
    'use strict';
    angular
        .module('app')
        .directive('datepickerInput', datepickerInputDirective);

    datepickerInputDirective.$inject = ['$timeout'];

    function datepickerInputDirective($timeout) {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                minDate: '@',
                maxDate: '@',
                placeholder: '@',
                format: '@',
                autohide: '@',
                todayHighlight: '@',
                showOnFocus: '@',
                showOnClick: '@',
                onChange: '&'
            },
            template: '<div class="datepicker-input-wrapper">' +
                      '<input type="text" ' +
                      'class="form-control datepicker-input" ' +
                      'ng-model="inputValue" ' +
                      'placeholder="{{ placeholder || \'Select date...\' }}" ' +
                      'readonly>' +
                      '</div>',
            link: function (scope, element, attrs, ngModelCtrl) {
                var datepickerInstance = null;
                var inputElement = null;
                
                // Get input element - try querySelector first, then jqLite
                if (element[0]) {
                    inputElement = element[0].querySelector('input');
                    if (!inputElement && element.find) {
                        var found = element.find('input');
                        if (found && found.length > 0) {
                            inputElement = found[0];
                        }
                    }
                }
                
                if (!inputElement) {
                    console.error('DatepickerInput: Input element not found');
                    return;
                }
                
                // Add a unique identifier to this input to help with debugging
                var uniqueId = 'datepicker-input-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                inputElement.setAttribute('data-datepicker-id', uniqueId);
                
                // Event handler functions (defined outside initDatepicker so they can be removed in cleanup)
                var handleDateChange = null;
                var handleShow = null;
                var handleHide = null;

                // Initialize datepicker
                function initDatepicker() {
                    if (typeof Datepicker === 'undefined') {
                        console.warn('Datepicker library not loaded');
                        return;
                    }

                    // Destroy existing instance if any
                    if (datepickerInstance) {
                        try {
                            datepickerInstance.destroy();
                        } catch (e) {
                            // Ignore errors
                        }
                        datepickerInstance = null;
                    }

                    var options = {
                        format: scope.format || 'yyyy-mm-dd',
                        autohide: scope.autohide !== 'false',
                        todayHighlight: scope.todayHighlight !== 'false',
                        showOnFocus: scope.showOnFocus !== 'false', // Let library handle showOnFocus - we'll intercept show event
                        showOnClick: scope.showOnClick !== 'false',
                        orientation: 'bottom left' // Align to left edge of input
                    };

                    // Set min date if provided
                    if (scope.minDate === 'today') {
                        options.minDate = new Date();
                    } else if (scope.minDate) {
                        var minDateObj = new Date(scope.minDate);
                        if (!isNaN(minDateObj.getTime())) {
                            options.minDate = minDateObj;
                        }
                    }

                    // Set max date if provided
                    if (scope.maxDate) {
                        var maxDateObj = new Date(scope.maxDate);
                        if (!isNaN(maxDateObj.getTime())) {
                            options.maxDate = maxDateObj;
                        }
                    }

                    // Set initial date if provided
                    if (scope.ngModel) {
                        try {
                            var dateObj = new Date(scope.ngModel);
                            if (!isNaN(dateObj.getTime())) {
                                // Set initial value in input
                                inputElement.value = formatDate(dateObj, options.format);
                            }
                        } catch (e) {
                            // Ignore date parsing errors
                        }
                    }

                    try {
                        // Destroy any existing datepicker on this element first
                        if (inputElement.datepicker) {
                            try {
                                inputElement.datepicker.destroy();
                                delete inputElement.datepicker;
                            } catch (e) {
                                // Ignore errors
                            }
                        }
                        
                        // Ensure no other datepicker is attached to this element
                        if (inputElement.datepicker) {
                            console.warn('DatepickerInput: Element still has datepicker after destroy attempt');
                        }
                        
                        // Create new datepicker instance for this specific input
                        datepickerInstance = new Datepicker(inputElement, options);
                        
                        // Verify the instance is correctly attached
                        if (inputElement.datepicker !== datepickerInstance) {
                            console.error('DatepickerInput: Datepicker instance mismatch');
                        }
                        
                        // Verify inputField is set correctly
                        if (datepickerInstance.inputField !== inputElement) {
                            console.error('DatepickerInput: inputField mismatch');
                        }
                        
                        // Store reference to this specific input element on the instance
                        datepickerInstance._inputElement = inputElement;
                        datepickerInstance._uniqueId = uniqueId;

                        // Handle date selection - use named function to ensure proper scoping
                        handleDateChange = function(e) {
                            // Verify this event is for our input
                            if (e.target !== inputElement && e.currentTarget !== inputElement) {
                                return;
                            }
                            
                            var selectedDate = e.detail.date;
                            if (selectedDate) {
                                // Format date as YYYY-MM-DD
                                var year = selectedDate.getFullYear();
                                var month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                var day = String(selectedDate.getDate()).padStart(2, '0');
                                var dateStr = year + '-' + month + '-' + day;
                                
                                // Update ng-model
                                scope.$apply(function() {
                                    scope.ngModel = dateStr;
                                    ngModelCtrl.$setViewValue(dateStr);
                                    
                                    // Call onChange callback if provided
                                    if (scope.onChange) {
                                        scope.onChange();
                                    }
                                });
                            }
                        }
                        
                        inputElement.addEventListener('changeDate', handleDateChange);

                        // Handle show event - hide other datepickers, reposition, and add data attributes
                        // The datepicker library dispatches 'show' event on the input element
                        handleShow = function(e) {
                            // The event target should be our input element
                            // The event detail contains the datepicker instance
                            var eventTarget = e.target || e.currentTarget;
                            var eventDatepicker = (e.detail && e.detail.datepicker) || (eventTarget && eventTarget.datepicker);
                            
                            // Only proceed if this event is for our datepicker instance
                            if (eventTarget !== inputElement && eventDatepicker !== datepickerInstance && eventDatepicker !== inputElement.datepicker) {
                                return;
                            }
                            
                            // CRITICAL: Hide ALL other active datepickers BEFORE this one shows
                            // Do this synchronously to prevent race conditions
                            var allInputs = document.querySelectorAll('input.datepicker-input');
                            for (var i = 0; i < allInputs.length; i++) {
                                var inp = allInputs[i];
                                if (inp !== inputElement && inp.datepicker) {
                                    try {
                                        // Force hide any active datepicker
                                        if (inp.datepicker.picker && inp.datepicker.picker.active) {
                                            inp.datepicker.picker.hide();
                                        }
                                        if (inp.datepicker.active) {
                                            inp.datepicker.hide();
                                        }
                                    } catch (err) {
                                        // Ignore errors
                                    }
                                }
                            }
                            
                            // CRITICAL: Force reposition the popup relative to OUR input
                            // The library's place() method uses this.datepicker.inputField, so we need to ensure
                            // the popup is positioned correctly relative to our input
                            $timeout(function() {
                                if (datepickerInstance && datepickerInstance.picker && datepickerInstance.inputField === inputElement) {
                                    // Verify the inputField is correct
                                    if (datepickerInstance.inputField !== inputElement) {
                                        console.error('DatepickerInput: inputField mismatch in show handler');
                                        return;
                                    }
                                    
                                    // Force reposition the popup relative to our input
                                    try {
                                        datepickerInstance.picker.place();
                                    } catch (err) {
                                        console.error('DatepickerInput: Error repositioning popup:', err);
                                    }
                                    
                                    // Add data attribute to the datepicker dropdown for CSS targeting
                                    var pickerElement = datepickerInstance.picker.element;
                                    // Find the dropdown container
                                    var dropdown = pickerElement.closest('.datepicker-dropdown');
                                    if (!dropdown) {
                                        // Fallback: find active dropdown
                                        dropdown = document.querySelector('.datepicker-dropdown.active');
                                        // Verify it contains our picker element
                                        if (dropdown && !dropdown.contains(pickerElement)) {
                                            dropdown = null;
                                        }
                                    }
                                    if (dropdown) {
                                        dropdown.setAttribute('data-datepicker-input', 'true');
                                        dropdown.setAttribute('data-datepicker-id', uniqueId);
                                    }
                                }
                            }, 0); // Use 0 timeout to run immediately after current execution
                        }
                        
                        inputElement.addEventListener('show', handleShow);

                        // Handle hide event
                        handleHide = function(e) {
                            // Verify this event is for our input
                            if (e.target !== inputElement && e.currentTarget !== inputElement) {
                                return;
                            }
                            // Picker is hidden
                        }
                        
                        inputElement.addEventListener('hide', handleHide);

                    } catch (e) {
                        console.error('Error initializing datepicker:', e);
                    }
                }

                // Format date helper function
                function formatDate(date, format) {
                    if (!date || isNaN(date.getTime())) {
                        return '';
                    }
                    
                    var year = date.getFullYear();
                    var month = String(date.getMonth() + 1).padStart(2, '0');
                    var day = String(date.getDate()).padStart(2, '0');
                    
                    if (format === 'yyyy-mm-dd') {
                        return year + '-' + month + '-' + day;
                    } else if (format === 'mm/dd/yyyy') {
                        return month + '/' + day + '/' + year;
                    } else if (format === 'dd/mm/yyyy') {
                        return day + '/' + month + '/' + year;
                    }
                    // Default to yyyy-mm-dd
                    return year + '-' + month + '-' + day;
                }

                // Watch for ngModel changes from outside
                scope.$watch('ngModel', function(newDate, oldDate) {
                    if (newDate !== oldDate && datepickerInstance) {
                        if (newDate) {
                            try {
                                var dateObj = new Date(newDate);
                                if (!isNaN(dateObj.getTime())) {
                                    // Update datepicker
                                    datepickerInstance.setDate(dateObj, {render: true});
                                    // Update input value
                                    inputElement.value = formatDate(dateObj, scope.format || 'yyyy-mm-dd');
                                }
                            } catch (e) {
                                console.warn('Error setting date from ngModel:', e);
                            }
                        } else {
                            // Clear date
                            datepickerInstance.setDate({clear: true});
                            inputElement.value = '';
                        }
                    }
                });

                // Watch for option changes
                scope.$watch('[minDate, maxDate]', function() {
                    if (datepickerInstance) {
                        var newOptions = {};
                        
                        if (scope.minDate === 'today') {
                            newOptions.minDate = new Date();
                        } else if (scope.minDate) {
                            var minDateObj = new Date(scope.minDate);
                            if (!isNaN(minDateObj.getTime())) {
                                newOptions.minDate = minDateObj;
                            }
                        }
                        
                        if (scope.maxDate) {
                            var maxDateObj = new Date(scope.maxDate);
                            if (!isNaN(maxDateObj.getTime())) {
                                newOptions.maxDate = maxDateObj;
                            }
                        }
                        
                        if (Object.keys(newOptions).length > 0) {
                            datepickerInstance.setOptions(newOptions);
                        }
                    }
                }, true);

                // Initialize input value from ngModel
                scope.inputValue = '';
                if (scope.ngModel) {
                    try {
                        var dateObj = new Date(scope.ngModel);
                        if (!isNaN(dateObj.getTime())) {
                            scope.inputValue = formatDate(dateObj, scope.format || 'yyyy-mm-dd');
                        }
                    } catch (e) {
                        // Ignore
                    }
                }

                // Handle focus event to hide other datepickers BEFORE library shows this one
                // We use capture phase to run before the library's focus handler
                function handleFocus(e) {
                    // Only handle focus for our specific input
                    if (e.target !== inputElement && e.currentTarget !== inputElement) {
                        return;
                    }
                    
                    // Immediately hide all other datepickers BEFORE the library shows this one
                    // This runs in capture phase, so it executes before the library's handler
                    var allInputs = document.querySelectorAll('input.datepicker-input');
                    for (var i = 0; i < allInputs.length; i++) {
                        var inp = allInputs[i];
                        if (inp !== inputElement && inp.datepicker) {
                            try {
                                // Force hide any active datepicker
                                if (inp.datepicker.picker && inp.datepicker.picker.active) {
                                    inp.datepicker.picker.hide();
                                }
                                if (inp.datepicker.active) {
                                    inp.datepicker.hide();
                                }
                            } catch (err) {
                                // Ignore errors
                            }
                        }
                    }
                    // Let the library's showOnFocus handler show the correct datepicker
                }
                
                // Add focus event listener in CAPTURE phase to run BEFORE library's handler
                inputElement.addEventListener('focus', handleFocus, true);
                
                // Initialize after DOM is ready
                $timeout(function() {
                    initDatepicker();
                }, 0);

                // Watch for when element becomes visible (for modals/dynamic content)
                var checkVisibility = function() {
                    if (inputElement && inputElement.offsetParent !== null && !datepickerInstance) {
                        $timeout(function() {
                            initDatepicker();
                        }, 50);
                    }
                };

                // Check visibility periodically when in modal (up to 2 seconds)
                var visibilityCheckInterval = setInterval(function() {
                    if (inputElement && inputElement.offsetParent !== null) {
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
                    // Remove event listeners
                    if (inputElement) {
                        inputElement.removeEventListener('focus', handleFocus);
                        if (handleDateChange) {
                            inputElement.removeEventListener('changeDate', handleDateChange);
                        }
                        if (handleShow) {
                            inputElement.removeEventListener('show', handleShow);
                        }
                        if (handleHide) {
                            inputElement.removeEventListener('hide', handleHide);
                        }
                    }
                    
                    // Destroy datepicker instance
                    if (datepickerInstance) {
                        try {
                            datepickerInstance.destroy();
                        } catch (e) {
                            // Ignore errors
                        }
                        datepickerInstance = null;
                    }
                    
                    // Also check if element has datepicker property and clean it up
                    if (inputElement && inputElement.datepicker) {
                        try {
                            inputElement.datepicker.destroy();
                        } catch (e) {
                            // Ignore errors
                        }
                        delete inputElement.datepicker;
                    }
                });
            }
        };
    }
})();

