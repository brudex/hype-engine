(function () {
    'use strict';
    angular
        .module('app')
        .directive('multiSelect', MultiSelectDirective);

    MultiSelectDirective.$inject = ['$timeout'];

    function MultiSelectDirective($timeout) {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                options: '=',
                optionValue: '@',
                optionLabel: '@',
                placeholder: '@?',
                searchEnabled: '@?',
                removeItemButton: '@?',
                onSelect: '&?',
                onRemove: '&?'
            },
            template: '<select class="form-control" multiple ng-attr-id="{{ selectId }}" ng-attr-name="{{ selectId }}"></select>',
            link: function (scope, element, attrs, ngModel) {
                var choicesInstance = null;
                var selectElement = null;
                var isUpdatingFromChoices = false;
                var isInitialized = false;
                var isInitializing = false; // Flag to prevent concurrent initialization
                scope.selectId = 'multi-select-' + Math.random().toString(36).substr(2, 9);
                

                // Default values
                var searchEnabled = scope.searchEnabled !== 'false';
                var removeItemButton = scope.removeItemButton !== 'false';
                var placeholder = scope.placeholder || 'Select options...';

                // Initialize Choices.js (only once)
                function initializeChoices() {
                    console.log('[MultiSelect] initializeChoices() called', {
                        selectId: scope.selectId,
                        hasChoicesInstance: !!choicesInstance,
                        isInitialized: isInitialized,
                        isInitializing: isInitializing,
                        optionsCount: scope.options ? scope.options.length : 0
                    });
                    
                    // Don't re-initialize if already initialized or currently initializing
                    if (choicesInstance || isInitialized || isInitializing) {
                        console.log('[MultiSelect] Skipping initialization - already initialized or initializing', {
                            selectId: scope.selectId,
                            hasChoicesInstance: !!choicesInstance,
                            isInitialized: isInitialized,
                            isInitializing: isInitializing
                        });
                        return;
                    }
                    
                    // Mark as initializing to prevent multiple calls
                    isInitializing = true;
                    console.log('[MultiSelect] Starting initialization >>>>>>', { selectId: scope.selectId });
                    
                    $timeout(function() {
                        selectElement = element.find('select')[0];
                        if (!selectElement || choicesInstance) {
                            isInitializing = false;
                            return;
                        }

                        console.log("Building choice options")
                        // Build choices from options
                        var choicesOptions = buildChoicesOptions(scope.options);
                        console.log("Calling new choices")
                        // Initialize Choices.js
                        choicesInstance = new Choices(selectElement, {
                            removeItemButton: removeItemButton,
                            searchEnabled: searchEnabled,
                            placeholder: true,
                            placeholderValue: placeholder,
                            searchPlaceholderValue: 'Search...',
                            noResultsText: 'No results found',
                            noChoicesText: 'No options available',
                            itemSelectText: 'Press to select',
                            addItemText: 'Press Enter to add',
                            maxItemText: 'Only {count} values can be added',
                            uniqueItemText: 'Only unique values can be added',
                            classNames: {
                                containerOuter: 'choices',
                                containerInner: 'choices__inner',
                                input: 'choices__input',
                                inputCloned: 'choices__input--cloned',
                                list: 'choices__list',
                                listItems: 'choices__list--multiple',
                                listSingle: 'choices__list--single',
                                listDropdown: 'choices__list--dropdown',
                                item: 'choices__item',
                                itemSelectable: 'choices__item--selectable',
                                itemDisabled: 'choices__item--disabled',
                                itemChoice: 'choices__item--choice',
                                placeholder: 'choices__placeholder',
                                group: 'choices__group',
                                groupHeading: 'choices__heading',
                                button: 'choices__button',
                                activeState: 'is-active',
                                focusState: 'is-focused',
                                openState: 'is-open',
                                disabledState: 'is-disabled',
                                highlightedState: 'is-highlighted',
                                selectedState: 'is-selected',
                                flippedState: 'is-flipped',
                                loadingState: 'is-loading',
                                noResults: 'has-no-results',
                                noChoices: 'has-no-choices'
                            }
                        });
                        console.log("New  choices called");

                        // Set choices if available
                        if (choicesOptions.length > 0) {
                            choicesInstance.setChoices(choicesOptions, 'value', 'label', true);
                            console.log("Setting intial values  called");
                            setInitialValues(choicesOptions);
                            console.log(" intial values  set");
                        }
                        
                        console.log("Setting up event handlers  set");
                        // Setup event listeners
                        setupEventListeners();
                        console.log("Event handlers  hve been set");
                        // Mark as initialized
                        isInitialized = true;
                        isInitializing = false;
                        console.log("Timeout complete >>")
                    }, 1000);
                }
                
                // Build choices options from scope.options
                function buildChoicesOptions(options) {
                    if (!options || !Array.isArray(options)) {
                        return [];
                    }
                    
                    return options.map(function(option) {
                        var value = scope.optionValue ? option[scope.optionValue] : option.value || option.id || option.uuid || option;
                        var label = getLabel(option, value);
                        
                        return {
                            value: String(value),
                            label: label
                        };
                    });
                }
                
                // Get label for an option
                function getLabel(option, value) {
                    if (scope.optionLabel && option && typeof option === 'object') {
                        var label = option[scope.optionLabel];
                        if (label !== undefined && label !== null && label !== '') {
                            return String(label).trim();
                        }
                    }
                    
                    // Fallbacks
                    if (option && option.name && option.provider) {
                        return option.name + ' (' + option.provider + ')';
                    }
                    if (option && option.name) {
                        return option.name;
                    }
                    if (option && option.label) {
                        return option.label;
                    }
                    
                    return String(value);
                }
                
                // Set initial values from ngModel
                function setInitialValues(choicesOptions) {
                    if (!ngModel.$viewValue || !Array.isArray(ngModel.$viewValue) || ngModel.$viewValue.length === 0) {
                        return;
                    }
                    
                    var validValues = ngModel.$viewValue
                        .map(function(val) { return String(val); })
                        .filter(function(val) {
                            return choicesOptions.some(function(choice) {
                                return choice.value === val;
                            });
                        });
                    
                    if (validValues.length > 0) {
                        var modelValues = validValues.map(function(val) {
                            if (scope.optionValue && scope.options) {
                                var option = scope.options.find(function(opt) {
                                    var optValue = scope.optionValue ? opt[scope.optionValue] : opt.value || opt.id || opt.uuid || opt;
                                    return String(optValue) === val;
                                });
                                if (option) {
                                    return scope.optionValue ? option[scope.optionValue] : option.value || option.id || option.uuid || option;
                                }
                            }
                            return val;
                        });
                        
                        isUpdatingFromChoices = true;
                        ngModel.$setViewValue(modelValues);
                        choicesInstance.setValue(validValues);
                        $timeout(function() {
                            isUpdatingFromChoices = false;
                        }, 0);
                    }
                }

                let triggerCount = 0;
                // Setup event listeners for Choices.js
                function setupEventListeners() {
                    // Handle selection changes
                    selectElement.addEventListener('change', function(event) {
                        triggerCount++;
                       
                        var selectedValues = choicesInstance.getValue(true);
                        
                        // Normalize to array
                        if (!Array.isArray(selectedValues)) {
                            selectedValues = (selectedValues === null || selectedValues === undefined) ? [] : [selectedValues];
                        }
                        
                        // Convert to original types
                        var modelValues = selectedValues.map(function(val) {
                            var valStr = String(val);
                            
                            // Get original value from options to preserve type
                            if (scope.optionValue && scope.options) {
                                var option = scope.options.find(function(opt) {
                                    var optValue = scope.optionValue ? opt[scope.optionValue] : opt.value || opt.id || opt.uuid || opt;
                                    return String(optValue) === valStr;
                                });
                                if (option) {
                                    var originalValue = scope.optionValue ? option[scope.optionValue] : option.value || option.id || option.uuid || option;
                                    return originalValue;
                                }
                            }
                            
                            // Infer type: UUID (36 chars with hyphens) or number
                            if (valStr.length === 36 && valStr.indexOf('-') !== -1 && valStr.split('-').length === 5) {
                                return valStr; // UUID
                            }
                            
                            var numVal = Number(val);
                            if (!isNaN(numVal) && valStr === String(numVal) && valStr.indexOf('-') === -1) {
                                return numVal; // Number
                            }
                            
                            return valStr; // String
                        });
                        
                        // Update ngModel
                        isUpdatingFromChoices = true;
                        console.log('[MultiSelect] Updating ngModel from selection change', {
                            selectId: scope.selectId,
                            modelValues: modelValues
                        });
                        console.log('The ngModel value is', ngModel);
                        console.log('The ngModel value before setViewValue is', ngModel.$viewValue);
                        ngModel.$setViewValue(modelValues);
                        console.log('The ngModel value after setViewValue is', ngModel.$viewValue);
                        ngModel.$setDirty();
                        ngModel.$setTouched();
                        
                        if (!scope.$root.$$phase) {
                            scope.$apply();
                            console.log('The ngModel value after apply is', ngModel);
                        }
                       
                        $timeout(function() {
                            isUpdatingFromChoices = false;
                        }, 300);
                        
                        if (scope.onSelect) {
                            $timeout(function() {
                                scope.onSelect();
                            }, 300);
                        }
                    });
                    
                    // Handle item removal
                    selectElement.addEventListener('removeItem', function(event) {
                        if (scope.onRemove) {
                            scope.onRemove({ value: event.detail.value });
                        }
                    });
                }

                // Watch for options changes
                scope.$watch('options', function(newOptions, oldOptions) {
                    console.log('[MultiSelect] Options watcher triggered', {
                        selectId: scope.selectId,
                        hasChoicesInstance: !!choicesInstance,
                        isInitialized: isInitialized,
                        isInitializing: isInitializing,
                        newOptionsCount: newOptions ? (Array.isArray(newOptions) ? newOptions.length : 'not array') : 'null/undefined',
                        oldOptionsCount: oldOptions ? (Array.isArray(oldOptions) ? oldOptions.length : 'not array') : 'null/undefined',
                        isSameReference: newOptions === oldOptions
                    });
                    
                    // Only initialize if not already initialized and instance doesn't exist
                    if (!choicesInstance && !isInitialized && !isInitializing) {
                        console.log('[MultiSelect] Initializing from options watcher', { selectId: scope.selectId });
                        initializeChoices();
                        return;
                    }
                    
                    // If instance doesn't exist but we're initialized, something went wrong - skip
                    if (!choicesInstance) {
                        console.warn('[MultiSelect] Choices instance missing but initialized flag is true', { selectId: scope.selectId });
                        return;
                    }
                    
                    // If we're still initializing, skip options update
                    if (isInitializing) {
                        console.log('[MultiSelect] Skipping options update - still initializing', { selectId: scope.selectId });
                        return;
                    }

                    // Skip if options haven't actually changed (reference equality check)
                    if (newOptions === oldOptions) {
                        console.log('[MultiSelect] Options unchanged (same reference)', { selectId: scope.selectId });
                        return;
                    }

                    // Skip if both are arrays with same length and same content
                    if (Array.isArray(newOptions) && Array.isArray(oldOptions) && 
                        newOptions.length === oldOptions.length) {
                        var optionsChanged = false;
                        for (var i = 0; i < newOptions.length; i++) {
                            var newVal = scope.optionValue ? newOptions[i][scope.optionValue] : newOptions[i].value || newOptions[i].id || newOptions[i].uuid;
                            var oldVal = scope.optionValue ? oldOptions[i][scope.optionValue] : oldOptions[i].value || oldOptions[i].id || oldOptions[i].uuid;
                            if (String(newVal) !== String(oldVal)) {
                                optionsChanged = true;
                                break;
                            }
                        }
                        if (!optionsChanged) {
                            console.log('[MultiSelect] Options content unchanged', {
                                selectId: scope.selectId,
                                optionsCount: newOptions.length
                            });
                            return;
                        }
                    }
                    
                    console.log('[MultiSelect] Options changed, updating choices', {
                        selectId: scope.selectId,
                        newOptionsCount: newOptions ? (Array.isArray(newOptions) ? newOptions.length : 'not array') : 'null/undefined',
                        oldOptionsCount: oldOptions ? (Array.isArray(oldOptions) ? oldOptions.length : 'not array') : 'null/undefined'
                    });

                    // Build choices options from new options
                    var choicesOptions = buildChoicesOptions(newOptions);

                    // Preserve current selected values before clearing
                    var currentSelectedValues = [];
                    if (choicesInstance) {
                        var currentValues = choicesInstance.getValue(true);
                        if (Array.isArray(currentValues) && currentValues.length > 0) {
                            currentSelectedValues = currentValues;
                        }
                    }
                    
                    console.log('[MultiSelect] Updating choices with new options', {
                        selectId: scope.selectId,
                        currentSelectedCount: currentSelectedValues.length,
                        currentSelected: currentSelectedValues,
                        newChoicesCount: choicesOptions.length
                    });
                    
                    // Clear existing choices and set new ones
                    choicesInstance.clearChoices();
                    if (choicesOptions.length > 0) {
                        choicesInstance.setChoices(choicesOptions, 'value', 'label', true);
                        
                        // Restore selected values if they still exist in new options
                        if (currentSelectedValues.length > 0) {
                            var validValues = currentSelectedValues.filter(function(val) {
                                return choicesOptions.some(function(choice) {
                                    return choice.value === String(val);
                                });
                            });
                            
                            console.log('[MultiSelect] Restoring selected values after options update', {
                                selectId: scope.selectId,
                                originalSelected: currentSelectedValues,
                                validSelected: validValues,
                                invalidCount: currentSelectedValues.length - validValues.length
                            });
                            
                            if (validValues.length > 0) {
                                isUpdatingFromChoices = true;
                                choicesInstance.setValue(validValues);
                                
                                // Convert to original types
                                var modelValues = validValues.map(function(val) {
                                    if (scope.optionValue && newOptions) {
                                        var option = newOptions.find(function(opt) {
                                            var optValue = scope.optionValue ? opt[scope.optionValue] : opt.value || opt.id || opt.uuid || opt;
                                            return String(optValue) === String(val);
                                        });
                                        if (option) {
                                            return scope.optionValue ? option[scope.optionValue] : option.value || option.id || option.uuid || option;
                                        }
                                    }
                                    
                                    // Infer type: UUID or number
                                    var valStr = String(val);
                                    if (valStr.length === 36 && valStr.indexOf('-') !== -1 && valStr.split('-').length === 5) {
                                        return valStr; // UUID
                                    }
                                    
                                    var numVal = Number(val);
                                    if (!isNaN(numVal) && valStr === String(numVal) && valStr.indexOf('-') === -1) {
                                        return numVal; // Number
                                    }
                                    
                                    return valStr; // String
                                });
                                
                                alert("Set View values");
                                ngModel.$setViewValue(modelValues);
                                ngModel.$setDirty();
                                ngModel.$setTouched();
                                $timeout(function() {
                                    isUpdatingFromChoices = false;
                                }, 0);
                            }
                        }
                    }
                }, true);

                // Watch for ngModel changes from outside (only after initialization)
                scope.$watch(function() {
                    return ngModel.$viewValue;
                }, function(newValue, oldValue) {
                    // Skip if this update was triggered by Choices.js itself
                    if (isUpdatingFromChoices) {
                        console.log('[MultiSelect] Skipping ngModel watcher - update from Choices.js', { selectId: scope.selectId });
                        return;
                    }
                    
                    // Skip if Choices instance doesn't exist yet or not initialized
                    if (!choicesInstance || !isInitialized) {
                        console.log('[MultiSelect] Skipping ngModel watcher - not initialized', {
                            selectId: scope.selectId,
                            hasChoicesInstance: !!choicesInstance,
                            isInitialized: isInitialized
                        });
                        return;
                    }
                    
                    // Skip if values are the same (reference or content)
                    if (newValue === oldValue) {
                        console.log('[MultiSelect] ngModel unchanged', { selectId: scope.selectId });
                        return;
                    }
                    
                    console.log('[MultiSelect] ngModel changed from outside', {
                        selectId: scope.selectId,
                        oldValue: oldValue,
                        newValue: newValue,
                        oldType: typeof oldValue,
                        newType: typeof newValue
                    });
                    
                    if (choicesInstance && newValue !== oldValue) {
                        var currentValues = choicesInstance.getValue(true);
                        // Ensure currentValues is always an array
                        if (!Array.isArray(currentValues)) {
                            if (currentValues === null || currentValues === undefined) {
                                currentValues = [];
                            } else {
                                currentValues = [currentValues];
                            }
                        }
                        
                        var newValues = Array.isArray(newValue) ? newValue.map(function(v) { return String(v); }) : [];
                        
                        // Only update if values are actually different
                        var currentStr = currentValues.sort().join(',');
                        var newStr = newValues.sort().join(',');
                        if (currentStr !== newStr) {
                            console.log('[MultiSelect] Updating Choices.js from ngModel change', {
                                selectId: scope.selectId,
                                currentValues: currentValues,
                                newValues: newValues
                            });
                            
                            isUpdatingFromChoices = true;
                            choicesInstance.setValue(newValues);
                            $timeout(function() {
                                isUpdatingFromChoices = false;
                                console.log('[MultiSelect] ngModel update complete', { selectId: scope.selectId });
                            }, 0);
                        } else {
                            console.log('[MultiSelect] Values are the same, skipping update', {
                                selectId: scope.selectId,
                                values: newValues
                            });
                        }
                    }
                }, true);

                // Initialize on load (only once)
                console.log('[MultiSelect] Directive linked', {
                    selectId: scope.selectId,
                    hasOptions: !!scope.options,
                    optionsCount: scope.options ? (Array.isArray(scope.options) ? scope.options.length : 'not array') : 0,
                    optionValue: scope.optionValue,
                    optionLabel: scope.optionLabel
                });
                
                if (!choicesInstance && !isInitialized) {
                    console.log('[MultiSelect] Triggering initial initialization', { selectId: scope.selectId });
                    initializeChoices();
                } else {
                    console.log('[MultiSelect] Skipping initial initialization', {
                        selectId: scope.selectId,
                        hasChoicesInstance: !!choicesInstance,
                        isInitialized: isInitialized
                    });
                }

                // Cleanup on destroy
                scope.$on('$destroy', function() {
                    console.log('[MultiSelect] Directive destroying', { selectId: scope.selectId });
                    if (choicesInstance) {
                        choicesInstance.destroy();
                        choicesInstance = null;
                        isInitialized = false;
                        isInitializing = false;
                    }
                });
            }
        };
    }
})();

