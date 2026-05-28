(function () {
    'use strict';
    angular
        .module('app')
        .controller('FlowListController', FlowListController);

    FlowListController.$inject = ['$scope', 'brudexservices', 'brudexutils', '$timeout', '$window'];

    function FlowListController($scope, services, utils, $timeout, $window) {
        var vm = this;

        vm.flows = [];
        vm.loading = false;
        vm.showCreateModal = false;
        vm.showEditModal = false;
        vm.editingFlow = null;
        vm.createForm = { name: '', description: '' };
        vm.editForm = { name: '', description: '', status: 1 };
        vm.statusOptions = [
            { value: 0, label: 'Draft' },
            { value: 1, label: 'Active' },
            { value: 2, label: 'Paused' },
            { value: 3, label: 'Archived' }
        ];

        vm.init = init;
        vm.loadFlows = loadFlows;
        vm.openCreateModal = openCreateModal;
        vm.closeCreateModal = closeCreateModal;
        vm.submitCreate = submitCreate;
        vm.openEditModal = openEditModal;
        vm.closeEditModal = closeEditModal;
        vm.updateFlow = updateFlow;
        vm.deleteFlow = deleteFlow;
        vm.goToDesign = goToDesign;
        vm.getFlowInitials = getFlowInitials;
        vm.statusLabel = statusLabel;

        function init() {
            loadFlows();
        }

        function loadFlows() {
            vm.loading = true;
            services.getFlows(function (response) {
                vm.loading = false;
                if (response.success) {
                    vm.flows = response.data || [];
                } else {
                    utils.alertError('Error', response.message || 'Failed to load flows');
                }
            });
        }

        function openCreateModal() {
            vm.createForm.name = '';
            vm.createForm.description = '';
            vm.showCreateModal = true;
            $timeout(function () {
                var el = document.getElementById('createFlowModal');
                if (el) {
                    var modal = bootstrap.Modal.getOrCreateInstance(el);
                    el.addEventListener(
                        'hidden.bs.modal',
                        function () {
                            vm.showCreateModal = false;
                            $scope.$applyAsync();
                        },
                        { once: true }
                    );
                    modal.show();
                }
            }, 0);
        }

        function closeCreateModal() {
            var el = document.getElementById('createFlowModal');
            if (el) {
                var modal = bootstrap.Modal.getInstance(el);
                if (modal) modal.hide();
            }
            vm.showCreateModal = false;
        }

        function submitCreate() {
            var name = (vm.createForm.name || '').trim();
            if (!name) {
                utils.alertError('Error', 'Flow name is required');
                return;
            }
            services.createFlow(
                { name: name, description: (vm.createForm.description || '').trim() },
                function (response) {
                    if (response.success && response.data && response.data.uuid) {
                        utils.toastSuccess('Flow created');
                        closeCreateModal();
                        $window.location.href = '/dashboard/flows/' + response.data.uuid + '/design';
                    } else {
                        utils.alertError('Error', response.message || 'Failed to create flow');
                    }
                }
            );
        }

        function openEditModal(flow) {
            vm.editingFlow = Object.assign({}, flow);
            vm.editForm.name = flow.name || '';
            vm.editForm.description = flow.description || '';
            vm.editForm.status =
                flow.status != null ? parseInt(flow.status, 10) : 1;
            vm.showEditModal = true;
            $timeout(function () {
                var el = document.getElementById('editFlowModal');
                if (el) {
                    var modal = bootstrap.Modal.getOrCreateInstance(el);
                    el.addEventListener(
                        'hidden.bs.modal',
                        function () {
                            vm.closeEditModal();
                        },
                        { once: true }
                    );
                    modal.show();
                }
            }, 0);
        }

        function closeEditModal() {
            vm.editingFlow = null;
            vm.editForm = { name: '', description: '', status: 1 };
            var el = document.getElementById('editFlowModal');
            if (el) {
                var modal = bootstrap.Modal.getInstance(el);
                if (modal) modal.hide();
            }
            vm.showEditModal = false;
        }

        function updateFlow() {
            if (!vm.editingFlow || !vm.editingFlow.uuid) return;
            var name = (vm.editForm.name || '').trim();
            if (!name) {
                utils.alertError('Error', 'Flow name is required');
                return;
            }
            var status = parseInt(vm.editForm.status, 10);
            if (Number.isNaN(status)) status = 1;

            services.updateFlow(
                vm.editingFlow.uuid,
                { name: name, description: (vm.editForm.description || '').trim(), status: status },
                function (response) {
                if (response.success) {
                    utils.alertSuccess('Success', 'Flow updated');
                    closeEditModal();
                    loadFlows();
                } else {
                    utils.alertError('Error', response.message || 'Failed to update flow');
                }
            });
        }

        function deleteFlow(flow) {
            utils.alertConfirm(
                'Delete flow',
                'Are you sure you want to delete "' + flow.name + '"? This cannot be undone.',
                function (result) {
                    if (result.isConfirmed) {
                        services.deleteFlow(flow.uuid, function (response) {
                            if (response.success) {
                                utils.toastSuccess('Flow deleted');
                                loadFlows();
                            } else {
                                utils.alertError('Error', response.message || 'Failed to delete flow');
                            }
                        });
                    }
                }
            );
        }

        function goToDesign(flow) {
            if (flow && flow.uuid) {
                $window.location.href = '/dashboard/flows/' + flow.uuid + '/design';
            }
        }

        function getFlowInitials(name) {
            if (!name || name.trim() === '') {
                return '??';
            }
            var trimmed = name.trim();
            var words = trimmed.split(/\s+/);
            if (words.length === 1) {
                return trimmed.substring(0, 2).toUpperCase();
            }
            if (words.length >= 2) {
                return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
            }
            return trimmed.substring(0, 2).toUpperCase();
        }

        function statusLabel(status) {
            var s = parseInt(status, 10);
            if (s === 0) return 'Draft';
            if (s === 1) return 'Active';
            if (s === 2) return 'Paused';
            if (s === 3) return 'Archived';
            return '—';
        }
    }
})();
