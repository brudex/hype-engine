(function () {
    'use strict';

    angular
        .module('app')
        .controller('TagManageController', TagManageController);

    TagManageController.$inject = ['$http', '$timeout', 'brudexservices', 'brudexutils'];

    function TagManageController($http, $timeout, services, utils) {
        var vm = this;
        var baseUrl = '';

        var COLOR_PALLET = [
            '#64748b', '#94a3b8', '#a8a29e', '#111827', '#ef4444', '#e11923',
            '#fb923c', '#c2410c', '#fbbf24', '#facc15', '#a3e635',
            '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#0891b2',
            '#38bdf8', '#0369a1', '#60a5fa', '#818cf8', '#a78bfa',
            '#c084fc', '#e879f9', '#f472b6', '#fb7185'
        ];

        vm.projectUuid = null;
        vm.projectName = '';
        vm.tags = [];
        vm.loading = false;
        vm.saving = false;
        vm.bulkTagInput = '';
        vm.selection = {};
        vm.editForm = { uuid: null, name: '', hex_color: '#3B82F6' };

        vm.init = init;
        vm.loadTags = loadTags;
        vm.openAddTagsModal = openAddTagsModal;
        vm.submitBulkTags = submitBulkTags;
        vm.selectedCount = selectedCount;
        vm.allSelected = allSelected;
        vm.toggleSelectAll = toggleSelectAll;
        vm.confirmDeleteSelected = confirmDeleteSelected;
        vm.clearSelection = clearSelection;
        vm.openEdit = openEdit;
        vm.saveEdit = saveEdit;
        vm.confirmDelete = confirmDelete;
        vm.displayHex = displayHex;

        function init(projectUuid, projectName) {
            var el = document.getElementById('___applicationbaseUrl');
            baseUrl = (el && el.value) ? el.value : '/';
            if (baseUrl !== '' && baseUrl.slice(-1) !== '/') {
                baseUrl += '/';
            }
            vm.projectUuid = projectUuid;
            vm.projectName = projectName || '';
            loadTags();
        }

        function displayHex(hex) {
            if (!hex) return '#3B82F6';
            var s = String(hex);
            return s.indexOf('#') === 0 ? s : '#' + s;
        }

        function pickRandomColor() {
            var usedColors = (vm.tags || []).map(function (tag) {
                var color = tag.hex_color || tag.hexColor;
                return color ? String(color).replace('#', '') : null;
            }).filter(function (c) { return c !== null; });

            var nonUsedColors = COLOR_PALLET.filter(function (color) {
                var colorWithoutHash = color.replace('#', '');
                return usedColors.indexOf(colorWithoutHash) === -1;
            });

            if (nonUsedColors.length === 0) {
                return COLOR_PALLET[Math.floor(Math.random() * COLOR_PALLET.length)].replace('#', '');
            }

            return nonUsedColors[Math.floor(Math.random() * nonUsedColors.length)].replace('#', '');
        }

        function openAddTagsModal() {
            vm.bulkTagInput = '';
            $timeout(function () {
                var modalEl = document.getElementById('tagManageAddModal');
                if (modalEl && window.bootstrap && window.bootstrap.Modal) {
                    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
                }
                var input = document.getElementById('tagManageBulkTagsInput');
                if (input) {
                    $timeout(function () { input.focus(); }, 150);
                }
            }, 0);

            if (vm.projectUuid) {
                services.getTagsByProject(vm.projectUuid, function (response) {
                    if (response && response.success) {
                        vm.tags = response.data || [];
                    }
                });
            }
        }

        function parseBulkNames(raw) {
            var parts = String(raw || '').split(',');
            var seen = {};
            var names = [];
            for (var i = 0; i < parts.length; i++) {
                var t = parts[i].trim();
                if (!t) continue;
                if (t.length > 120) {
                    t = t.slice(0, 120);
                }
                var key = t.toLowerCase();
                if (seen[key]) continue;
                seen[key] = true;
                names.push(t);
            }
            return names;
        }

        function submitBulkTags() {
            if (!vm.projectUuid) {
                utils.alertError('Error', 'Project is required to create tags');
                return;
            }

            var names = parseBulkNames(vm.bulkTagInput);
            if (names.length === 0) {
                utils.alertError('Validation', 'Enter at least one tag name, separated by commas.');
                return;
            }

            var toCreate = names.filter(function (n) {
                return !vm.tags.some(function (t) {
                    return t.name && t.name.toLowerCase() === n.toLowerCase();
                });
            });
            var skipped = names.length - toCreate.length;

            if (toCreate.length === 0) {
                utils.alertError('Duplicate', skipped > 0
                    ? 'All of these tags already exist in this project.'
                    : 'Nothing to add.');
                return;
            }

            vm.saving = true;
            var created = 0;

            function step(idx) {
                if (idx >= toCreate.length) {
                    vm.saving = false;
                    vm.bulkTagInput = '';
                    var msgParts = [];
                    if (created > 0) {
                        msgParts.push('Added ' + created + ' tag' + (created !== 1 ? 's' : ''));
                    }
                    if (skipped > 0) {
                        msgParts.push(skipped + ' skipped (already exist)');
                    }
                    utils.alertSuccess('Tags', msgParts.join('. '));
                    var modalEl = document.getElementById('tagManageAddModal');
                    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
                        window.bootstrap.Modal.getInstance(modalEl).hide();
                    }
                    loadTags();
                    return;
                }

                var name = toCreate[idx];
                var hexColor = pickRandomColor();
                services.createTag({
                    name: name,
                    hex_color: hexColor,
                    projectUuid: vm.projectUuid
                }, function (response) {
                    if (response && response.success) {
                        created++;
                        if (response.tags && Array.isArray(response.tags)) {
                            vm.tags = response.tags;
                        } else if (response.data) {
                            var d = response.data;
                            vm.tags.unshift({
                                id: d.id,
                                uuid: d.uuid,
                                name: d.name,
                                hex_color: d.hex_color || d.hexColor,
                                hexColor: d.hex_color || d.hexColor
                            });
                        }
                        step(idx + 1);
                    } else {
                        vm.saving = false;
                        utils.alertError('Error', (response && response.message) || ('Failed to create “' + name + '”'));
                    }
                });
            }

            step(0);
        }

        function selectedTagUuids() {
            var uuids = [];
            (vm.tags || []).forEach(function (t) {
                if (t.uuid && vm.selection[t.uuid]) {
                    uuids.push(t.uuid);
                }
            });
            return uuids;
        }

        function selectedCount() {
            return selectedTagUuids().length;
        }

        function allSelected() {
            var tags = vm.tags || [];
            if (tags.length === 0) {
                return false;
            }
            return tags.every(function (t) {
                return t.uuid && vm.selection[t.uuid];
            });
        }

        function toggleSelectAll() {
            if (allSelected()) {
                vm.selection = {};
            } else {
                var next = {};
                (vm.tags || []).forEach(function (t) {
                    if (t.uuid) {
                        next[t.uuid] = true;
                    }
                });
                vm.selection = next;
            }
        }

        function clearSelection() {
            vm.selection = {};
        }

        function confirmDeleteSelected() {
            var uuids = selectedTagUuids();
            if (uuids.length === 0) {
                return;
            }
            var msg = uuids.length === 1
                ? 'Delete 1 selected tag? This removes it from posts in this project.'
                : ('Delete ' + uuids.length + ' selected tags? This removes them from posts in this project.');
            utils.alertConfirm('Delete tags', msg, function (ok) {
                if (!ok) {
                    return;
                }
                vm.saving = true;
                var deleted = 0;

                function step(i) {
                    if (i >= uuids.length) {
                        vm.saving = false;
                        vm.selection = {};
                        loadTags();
                        utils.alertSuccess('Deleted', 'Removed ' + deleted + ' tag' + (deleted !== 1 ? 's' : '') + '.');
                        return;
                    }
                    $http.delete(baseUrl + 'dashboard/api/tags/delete/' + uuids[i]).then(function (res) {
                        if (res.data && res.data.success) {
                            deleted++;
                        }
                        step(i + 1);
                    }).catch(function (err) {
                        vm.saving = false;
                        vm.selection = {};
                        loadTags();
                        var msgErr = (err.data && err.data.message) || err.statusText || 'Delete failed';
                        utils.alertError('Error', msgErr);
                    });
                }

                step(0);
            });
        }

        function loadTags() {
            if (!vm.projectUuid) return;
            vm.loading = true;
            services.getTagsByProject(vm.projectUuid, function (response) {
                vm.loading = false;
                if (response && response.success) {
                    vm.tags = response.data || [];
                    vm.selection = {};
                } else {
                    utils.alertError('Error', (response && response.message) || 'Failed to load tags');
                    vm.tags = [];
                    vm.selection = {};
                }
            });
        }

        function openEdit(tag) {
            vm.editForm = {
                uuid: tag.uuid,
                name: tag.name,
                hex_color: displayHex(tag.hex_color)
            };
            var modalEl = document.getElementById('editTagModal');
            if (modalEl && window.bootstrap && window.bootstrap.Modal) {
                var modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            }
        }

        function saveEdit() {
            var name = (vm.editForm.name || '').trim();
            if (!vm.editForm.uuid || !name) {
                utils.alertError('Validation', 'Name is required');
                return;
            }
            vm.saving = true;
            services.updateTag({
                uuid: vm.editForm.uuid,
                name: name,
                hex_color: vm.editForm.hex_color || '#3B82F6'
            }, function (response) {
                vm.saving = false;
                if (response && response.success) {
                    var modalEl = document.getElementById('editTagModal');
                    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
                        window.bootstrap.Modal.getInstance(modalEl).hide();
                    }
                    loadTags();
                    utils.alertSuccess('Saved', response.message || 'Tag updated');
                } else {
                    utils.alertError('Error', (response && response.message) || 'Failed to update tag');
                }
            });
        }

        function confirmDelete(tag) {
            if (!tag || !tag.uuid) return;
            utils.alertConfirm('Delete tag', 'Delete “' + tag.name + '”? This removes the tag from posts in this project.', function (ok) {
                if (!ok) return;
                vm.saving = true;
                $http.delete(baseUrl + 'dashboard/api/tags/delete/' + tag.uuid).then(function (res) {
                    vm.saving = false;
                    if (res.data && res.data.success) {
                        loadTags();
                        utils.alertSuccess('Deleted', res.data.message || 'Tag deleted');
                    } else {
                        utils.alertError('Error', (res.data && res.data.message) || 'Delete failed');
                    }
                }).catch(function (err) {
                    vm.saving = false;
                    var msg = (err.data && err.data.message) || err.statusText || 'Failed to delete tag';
                    utils.alertError('Error', msg);
                });
            });
        }
    }
})();
