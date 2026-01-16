(function () {
    angular
        .module('app')
        .factory('brudexutils', UtilityFunctions);
    UtilityFunctions.$inject = ['$http', '$location', '$window'];
    function UtilityFunctions($http, $location, $window) {
        let _dataTables ={};
        if ($window._) {
            $window._.isNumeric = function isNumeric(str) {
                if (typeof str != "string") return false // we only process strings!  
                return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
            }
        }
        const swalWithBootstrapButtons =  $window.Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-accent-cyan me-2 mb-2',
                cancelButton: 'btn btn-outline-secondary me-2 mb-2',
                denyButton: 'btn btn-outline-danger me-2 mb-2',
                popup: 'swal2-popup-theme',
                container: 'swal2-container-theme'
            },
            buttonsStyling: false
        })

        const Toast = $window.Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        return {
            alertSuccess: createAlert('success'),
            alertError: createAlert('error'),
            alertInfo : createAlert('info'),
            alertWarning: createAlert('warning'),
            alertConfirm: createAlertCustomized('warning'),
            alertSuccessHtml: createAlertHtml('success'),
            alertInfoHtml : createAlertHtml('info'),
            alertErrorHtml: createAlertHtml('error'),
            alertInputModal: createAlertInput('success'),
            toastSuccess: createToast('success'),
            toastError: createToast('warning'),
            toastInfo: createToast('info'),
            toastWarning: createToast('warning'),
            filterTable: filterTable,
            renderDataTable: renderDataTable,
            renderDataTableV2: renderDataTableV2,
            _ :$window._
        };
        function createAlert(alertType) {
            return function showAlert(title, message) {
                var args = [].slice.call(arguments);
                if (args.length === 1) {
                    message = args[0];
                    title = alertType;
                }
                swalWithBootstrapButtons.fire({
                    title: title,
                    text: message,
                    icon: alertType
                });
            }
        }

        function createAlertHtml(alertType) {
            return function showAlert(title, message) {
                var args = [].slice.call(arguments);
                if (args.length === 1) {
                    message = args[0];
                    title = alertType;
                }
                swalWithBootstrapButtons.fire({
                    title: title,
                    html : message,
                    icon: alertType
                });
            }
        }

        function createToast(toastType) {
            return function showToast(message) {
                Toast.fire({
                    icon: toastType,
                    title: message
                })
            }
        }

        function createAlertCustomized(alertType) {
            return function showAlert(title, message, callback,options) {
                var args = [].slice.call(arguments);
                if (args.length === 1) {
                    message = args[0];
                    title = alertType;
                }
                var confirmButtonText ='OK';
                var cancelButtonText = 'Cancel';
                var icon="warning";
                // Use same button classes as alertSuccess/alertError for consistency
                var confirmButtonClass = 'btn btn-accent-cyan me-2 mb-2';
                var cancelButtonClass = 'btn btn-outline-secondary me-2 mb-2';
                
                if(options){
                    confirmButtonText = options.confirmButtonText  || "Yes";
                    cancelButtonText = options.cancelButtonText || "Cancel";
                    icon = options.icon || "warning";
                    // Allow custom button classes based on icon/type
                    if (options.icon === 'error' || options.icon === 'danger') {
                        confirmButtonClass = 'btn btn-accent-cyan me-2 mb-2';
                    } else if (options.icon === 'success') {
                        confirmButtonClass = 'btn btn-accent-cyan me-2 mb-2';
                    } else if (options.icon === 'warning') {
                        confirmButtonClass = 'btn btn-accent-cyan me-2 mb-2';
                    }
                }
                
                var swalConfig = {
                    title: title,
                    icon: icon,
                    text: message,
                    showCancelButton: true,
                    confirmButtonText: confirmButtonText,
                    cancelButtonText: cancelButtonText,
                    customClass: {
                        confirmButton: confirmButtonClass,
                        cancelButton: cancelButtonClass,
                        popup: 'swal2-popup-theme',
                        container: 'swal2-container-theme'
                    },
                    buttonsStyling: false
                };
                
                swalWithBootstrapButtons.fire(swalConfig).then(function (result){
                    callback(result)
                });
            }
        }


        function createAlertInput(alertType) {
            return function showAlert(title, message, callback,options) {
                var args = [].slice.call(arguments);
                if (args.length === 1) {
                    message = args[0];
                    title = alertType;
                }
                var confirmButtonText ='OK';
                var icon="warning";
                var confirmButtonClass = 'btn btn-danger me-2 mb-2'; // Default to danger for input modals (usually destructive)
                var cancelButtonClass = 'btn btn-outline-secondary me-2 mb-2';
                
                if(options){
                    confirmButtonText = options.confirmButtonText  || "Yes";
                    icon = options.icon || "warning";
                    // Allow custom button classes based on icon/type
                    if (options.icon === 'error' || options.icon === 'danger') {
                        confirmButtonClass = 'btn btn-danger me-2 mb-2';
                    } else if (options.icon === 'success') {
                        confirmButtonClass = 'btn btn-success me-2 mb-2';
                    } else if (options.icon === 'warning') {
                        confirmButtonClass = 'btn btn-warning me-2 mb-2';
                    }
                }
                
                var inputValidator = options.validator || function(value){
                    if (!value) {
                        return 'Enter a valid value!'
                    }
                };
                
                var swalConfig = {
                    title: title,
                    input: 'text',
                    showCancelButton: true,
                    inputValidator: inputValidator,
                    text: message,
                    confirmButtonText: confirmButtonText,
                    icon: icon,
                    customClass: {
                        confirmButton: confirmButtonClass,
                        cancelButton: cancelButtonClass,
                        popup: 'swal2-popup-theme',
                        container: 'swal2-container-theme'
                    },
                    buttonsStyling: false
                };
                
                swalWithBootstrapButtons.fire(swalConfig).then(function (result){
                    callback(result)
                });
            }
        }

        

        function renderDataTable(tableId,jsonData) {
            $(document).ready(function () {
                let dataTable=null;
                if (_dataTables[tableId]) {
                    dataTable = _dataTables[tableId];
                    dataTable.destroy();
                }
                var exportButtons =[];
                exportButtons.push({
                    extend: 'excelHtml5',
                    className:"btn btn-primary",
                    exportOptions:{
                        className:"btn btn-primary mr-2"
                    }
                });
                exportButtons.push({
                    extend: 'csv',
                    className:"btn btn-primary",
                    exportOptions:{
                        className:"btn btn-primary ml-2"
                    }
                });

                if(jsonData){
                    var rows = extractRowsDataTable(data);
                    console.log('The rows extracted >>',rows);
                    var cols = extractColumns(data);
                    _dataTables[tableId] = $('#'+tableId).DataTable({
                        data: rows,
                        columns: cols,
                        "pageLength": 50,
                        dom: 'Bfrtip',
                        buttons: exportButtons,
                        colReorder: true
                    });
                }else{ 
                    _dataTables[tableId] = $('#'+tableId).DataTable({
                        dom: 'Bfrtip',
                        buttons:{ buttons : exportButtons, dom: {
                                button: {
                                    className: 'btn btn-primary ml-2'
                                },
                            }},
                        "pageLength": 50,
                        colReorder: true
                    });
                }
            });
        }

        function renderDataTableV2(tableId,columnMap,jsonData) {
            $(document).ready(function () {
                let dataTable=null;
                if (_dataTables[tableId]) {
                    dataTable = _dataTables[tableId];
                    dataTable.destroy();
                }
                var exportButtons =[];
                exportButtons.push({
                    extend: 'excelHtml5',
                    className:"btn btn-primary",
                    exportOptions:{
                        className:"btn btn-primary mr-2"
                    }
                });
                exportButtons.push({
                    extend: 'csv',
                    className:"btn btn-primary",
                    exportOptions:{
                        className:"btn btn-primary ml-2"
                    }
                });
                var rows = extractRowsDataTableV2(jsonData,columnMap);
                console.log('The rows extracted >>',rows);
                var cols = extractColumnsV2(columnMap);
                _dataTables[tableId] = $('#'+tableId).DataTable({
                    data: rows,
                    columns: cols,
                    "pageLength": 50,
                    dom: 'Bfrtip',
                    buttons:{ buttons : exportButtons, dom: {
                            button: {
                                className: 'btn btn-primary ml-2'
                            },
                        }},
                    colReorder: true
                }); 
            });
        }

        function extractColumns(data) {
            var arr = [];
            if (data.length) {
                Object.keys(data[0]).forEach(function (item) {
                    arr.push({ "title": item });
                });
            }
            return arr;
        }

        function extractColumnsV2(columMap) {
            var arr = [];
            Object.keys(columMap).forEach(function (item) {
                arr.push({ "title": columMap[item]});
            });
            return arr;
        }
        

        function extractRowsDataTable(data) {
            var arr = [];
            data.forEach(function (item) {
                var obarr = [];
                Object.keys(item).forEach(function (prop) {
                    obarr.push(item[prop]);
                });
                arr.push(obarr);
            });
            return arr;
        }

        function extractRowsDataTableV2(data,columnMap) {
            var arr = [];
            var len =data.length;
            for(var k=0; k<len; k++){
                var item = data[k];
                var obarr = [];
                Object.keys(columnMap).forEach(function (prop) {
                    obarr.push(item[prop]);
                });
                arr.push(obarr);
            }
            return arr;
        }

        function filterTable(searchText,tableId){
            var filter, table, tr, td, i, j, txtValue;
            filter = searchText.toUpperCase();
            table = document.getElementById(tableId);
            tr = table.getElementsByTagName("tr");
            // Loop through all table rows (start from index 1 to skip the header row)
            for (i = 1; i < tr.length; i++) {
                var displayRow = false;
                // Loop through each column of the current row
                for (j = 0; j < tr[i].cells.length; j++) {
                    td = tr[i].cells[j];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            displayRow = true;
                            break; // No need to check other columns if match found
                        }
                    }
                }
                // Show/hide row based on the search result
                if (displayRow) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }




})();