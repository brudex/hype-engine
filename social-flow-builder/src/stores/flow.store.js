import { defineStore } from 'pinia';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@vue-flow/core';
import { createNode, createNodeId } from '../utils/nodeDefaults';
import { fromWorkflowDefinition, toWorkflowDefinition } from '../utils/workflowSchema';

export const useFlowStore = defineStore('flow', {
  state: () => ({
    id: 'draft-flow',
    name: 'Daily Social Pulse',
    trigger: 'manual',
    scheduleCron: null,
    isActive: true,
    nodes: [],
    edges: [],
    selectedNodeId: null,
    inspectedNodeId: null,
    zoom: 100,
  }),
  getters: {
    selectedNode(state) {
      return state.nodes.find((node) => node.id === state.selectedNodeId) || null;
    },
    inspectedNode(state) {
      return state.nodes.find((node) => node.id === state.inspectedNodeId) || null;
    },
    selectedNodeIds(state) {
      const selectedIds = state.nodes.filter((node) => node.selected).map((node) => node.id);
      if (!selectedIds.length && state.selectedNodeId) {
        return [state.selectedNodeId];
      }
      return selectedIds;
    },
    selectedEdgeIds(state) {
      return state.edges.filter((edge) => edge.selected).map((edge) => edge.id);
    },
    flowPayload(state) {
      return toWorkflowDefinition({
        id: state.id,
        name: state.name,
        version: '1.0.0',
        trigger: state.trigger,
        scheduleCron: state.scheduleCron,
        isActive: state.isActive,
        nodes: state.nodes,
        edges: state.edges,
      });
    },
  },
  actions: {
    onNodesChange(changes) {
      this.nodes = applyNodeChanges(changes, this.nodes);
      if (changes.some((change) => change.type === 'select')) {
        const selectedNodes = this.nodes.filter((node) => node.selected);
        this.selectedNodeId = selectedNodes.at(-1)?.id || null;
      }
    },
    onEdgesChange(changes) {
      this.edges = applyEdgeChanges(changes, this.edges);
    },
    onConnect(connection) {
      const handleId = connection.sourceHandle ? `-${connection.sourceHandle}` : '';
      this.edges = addEdge(
        { ...connection, id: `${connection.source}${handleId}-${connection.target}`, animated: false },
        this.edges,
      );
    },
    removeSourceHandleEdges(sourceNodeId, sourceHandle) {
      this.edges = this.edges.filter((edge) => edge.source !== sourceNodeId || edge.sourceHandle !== sourceHandle);
    },
    loadFromWorkflow(workflow) {
      const definition = workflow?.definition || workflow;
      if (!definition || typeof definition !== 'object') return false;

      const nextFlow = fromWorkflowDefinition(definition);
      this.id = nextFlow.id;
      this.name = nextFlow.name;
      this.trigger = nextFlow.trigger;
      this.nodes = nextFlow.nodes;
      this.edges = nextFlow.edges;
      this.selectedNodeId = null;
      this.inspectedNodeId = null;
      return true;
    },
    selectNode(id) {
      this.selectedNodeId = id;
    },
    inspectNode(id) {
      this.selectedNodeId = id;
      this.inspectedNodeId = id;
    },
    closeNodeInspector() {
      this.inspectedNodeId = null;
    },
    addNode(type, position = null) {
      const count = this.nodes.filter((node) => node.type === type).length + 1;
      const node = createNode(type, count, position || { x: 160 + count * 40, y: 120 + count * 40 });
      while (this.nodes.some((existing) => existing.id === node.id)) {
        node.id = createNodeId();
      }
      while (this.nodes.some((existing) => existing.name === node.name)) {
        node.name = `${node.name}_${Math.floor(Math.random() * 1000)}`;
      }
      this.nodes.push(node);
      this.selectedNodeId = node.id;
    },
    duplicateNode(nodeId) {
      const source = this.nodes.find((node) => node.id === nodeId);
      if (!source) return;
      const count = this.nodes.filter((node) => node.type === source.type).length + 1;
      const duplicate = {
        ...structuredClone(source),
        id: createNodeId(),
        name: `${source.name || source.id}_${count}`,
        position: {
          x: source.position.x + 40,
          y: source.position.y + 40,
        },
        status: 'idle',
        warning: '',
      };
      while (this.nodes.some((node) => node.id === duplicate.id)) {
        duplicate.id = createNodeId();
      }
      while (this.nodes.some((node) => node.name === duplicate.name)) {
        duplicate.name = `${source.name || source.id}_${Math.floor(Math.random() * 1000)}`;
      }
      this.nodes.push(duplicate);
      this.selectedNodeId = duplicate.id;
    },
    deleteNode(nodeId) {
      this.deleteNodes([nodeId]);
    },
    deleteSelectedNodes() {
      return this.deleteNodes(this.selectedNodeIds);
    },
    deleteSelectedElements() {
      const deletedNodes = this.deleteNodes(this.selectedNodeIds);
      const deletedEdges = this.deleteEdges(this.selectedEdgeIds);
      return deletedNodes || deletedEdges;
    },
    deleteEdges(edgeIds) {
      const ids = new Set(edgeIds.filter(Boolean));
      if (!ids.size) return false;

      this.edges = this.edges.filter((edge) => !ids.has(edge.id));
      return true;
    },
    deleteNodes(nodeIds) {
      const ids = new Set(nodeIds.filter(Boolean));
      if (!ids.size) return false;

      this.nodes = this.nodes.filter((node) => !ids.has(node.id));
      this.edges = this.edges.filter((edge) => !ids.has(edge.source) && !ids.has(edge.target));

      if (ids.has(this.inspectedNodeId)) {
        this.inspectedNodeId = null;
      }
      if (ids.has(this.selectedNodeId)) {
        this.selectedNodeId = null;
      }
      return true;
    },
    toggleNodeDisabled(nodeId) {
      const node = this.nodes.find((item) => item.id === nodeId);
      if (!node) return;
      node.disabled = !node.disabled;
      node.status = node.disabled ? 'skipped' : 'idle';
    },
    tidyNodes() {
      const positions = buildLinkedLayout(this.nodes, this.edges);
      this.nodes = this.nodes.map((node, index) => ({
        ...node,
        position: positions.get(node.id) || {
          x: 80 + (index % 4) * 300,
          y: 90 + Math.floor(index / 4) * 180,
        },
      }));
    },
    updateSelectedConfig(patch) {
      const node = this.selectedNode;
      if (!node) return;
      node.config = { ...node.config, ...patch };
    },
    renameSelectedNode(nextName) {
      const node = this.selectedNode;
      const cleanName = String(nextName || '').trim();
      if (!node || !cleanName || node.name === cleanName) return;
      const oldName = node.name || node.id;
      node.name = cleanName;
      const tokenPattern = new RegExp(`\\{\\{${escapeRegExp(oldName)}\\.`, 'g');
      this.nodes.forEach((flowNode) => {
        Object.entries(flowNode.config).forEach(([key, value]) => {
          if (typeof value === 'string') {
            flowNode.config[key] = value.replace(tokenPattern, `{{${cleanName}.`);
          }
        });
      });
    },
    setNodeStatus(nodeId, status, warning = '') {
      const node = this.nodes.find((item) => item.id === nodeId);
      if (node) {
        node.status = status;
        node.warning = warning;
      }
    },
  },
});

function buildLinkedLayout(nodes, edges) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const order = new Map(nodes.map((node, index) => [node.id, index]));
  const incoming = new Map(nodes.map((node) => [node.id, []]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return;
    incoming.get(edge.target).push(edge.source);
    outgoing.get(edge.source).push(edge.target);
  });

  const indegree = new Map(nodes.map((node) => [node.id, incoming.get(node.id).length]));
  const layer = new Map(nodes.map((node) => [node.id, 0]));
  const queue = nodes
    .filter((node) => indegree.get(node.id) === 0)
    .sort(compareByCurrentPosition)
    .map((node) => node.id);
  const visited = new Set();

  while (queue.length) {
    const id = queue.shift();
    visited.add(id);

    outgoing.get(id).forEach((targetId) => {
      layer.set(targetId, Math.max(layer.get(targetId), layer.get(id) + 1));
      indegree.set(targetId, indegree.get(targetId) - 1);
      if (indegree.get(targetId) === 0) {
        queue.push(targetId);
        queue.sort((a, b) => order.get(a) - order.get(b));
      }
    });
  }

  nodes.forEach((node) => {
    if (visited.has(node.id)) return;
    const parentLayers = incoming.get(node.id).map((sourceId) => layer.get(sourceId) ?? 0);
    layer.set(node.id, parentLayers.length ? Math.max(...parentLayers) + 1 : 0);
  });

  const layers = new Map();
  nodes.forEach((node) => {
    const layerIndex = layer.get(node.id) || 0;
    if (!layers.has(layerIndex)) layers.set(layerIndex, []);
    layers.get(layerIndex).push(node);
  });

  const positions = new Map();
  [...layers.entries()]
    .sort(([a], [b]) => a - b)
    .forEach(([layerIndex, layerNodes]) => {
      layerNodes.sort((a, b) => {
        const parentDelta = averageParentY(a.id, incoming, nodes) - averageParentY(b.id, incoming, nodes);
        return parentDelta || compareByCurrentPosition(a, b);
      });

      const totalHeight = (layerNodes.length - 1) * 180;
      layerNodes.forEach((node, index) => {
        positions.set(node.id, {
          x: 80 + layerIndex * 310,
          y: 90 + index * 180 - totalHeight / 2,
        });
      });
    });

  return positions;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compareByCurrentPosition(a, b) {
  return (a.position?.y ?? 0) - (b.position?.y ?? 0) || (a.position?.x ?? 0) - (b.position?.x ?? 0);
}

function averageParentY(nodeId, incoming, nodes) {
  const parents = incoming.get(nodeId) || [];
  if (!parents.length) return 0;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return parents.reduce((sum, id) => sum + (byId.get(id)?.position?.y ?? 0), 0) / parents.length;
}
