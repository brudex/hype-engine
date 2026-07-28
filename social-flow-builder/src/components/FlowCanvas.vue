<template>
  <section class="fb-canvas" @dragover.prevent @drop="onDrop">
    <VueFlow
      :nodes="flow.nodes"
      :edges="flow.edges"
      :node-types="nodeTypes"
      :elements-selectable="true"
      :select-nodes-on-drag="true"
      :selection-key-code="true"
      :multi-selection-key-code="['Meta', 'Control']"
      selection-mode="partial"
      :pan-on-drag="[1, 2]"
      :delete-key-code="null"
      :min-zoom="0.1"
      :max-zoom="2"
      @nodes-change="flow.onNodesChange"
      @edges-change="flow.onEdgesChange"
      @connect="flow.onConnect"
      @node-click="onNodeClick"
      @nodeDoubleClick="onNodeDoubleClick"
    >
      <Background pattern-color="#2f2f33" :gap="24" />
    </VueFlow>
    <div class="fb-canvas-controls" aria-label="Canvas controls">
      <button type="button" title="Zoom to fit" @click="zoomToFit">⛶</button>
      <button type="button" title="Zoom in" aria-label="Zoom in" @click="zoomInCanvas">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.3 15.3 21 21" />
          <path d="M10.5 7.5v6" />
          <path d="M7.5 10.5h6" />
        </svg>
      </button>
      <button type="button" title="Zoom out" aria-label="Zoom out" @click="zoomOutCanvas">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.3 15.3 21 21" />
          <path d="M7.5 10.5h6" />
        </svg>
      </button>
      <button type="button" title="Reset zoom" @click="resetZoom">↺</button>
      <button class="is-accent" type="button" title="Tidy up" @click="tidyUp">⌁</button>
    </div>
  </section>
</template>

<script setup>
import { markRaw, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { useFlowStore } from '../stores/flow.store';
import InputNode from '../nodes/InputNode.vue';
import HttpRequestNode from '../nodes/HttpRequestNode.vue';
import HttpResponseNode from '../nodes/HttpResponseNode.vue';
import RestApiNode from '../nodes/RestApiNode.vue';
import PromptNode from '../nodes/PromptNode.vue';
import JavascriptNode from '../nodes/JavascriptNode.vue';
import PostNode from '../nodes/PostNode.vue';
import ConditionNode from '../nodes/ConditionNode.vue';

const flow = useFlowStore();
const { screenToFlowCoordinate, fitView, zoomIn, zoomOut, setViewport } = useVueFlow();
const didFitLoadedFlow = ref(false);

const nodeTypes = {
  input: markRaw(InputNode),
  http_request: markRaw(HttpRequestNode),
  http_response: markRaw(HttpResponseNode),
  rest_api: markRaw(RestApiNode),
  prompt: markRaw(PromptNode),
  javascript: markRaw(JavascriptNode),
  post: markRaw(PostNode),
  condition: markRaw(ConditionNode),
};

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown);
});

watch(
  () => flow.nodes.length,
  async (nodeCount, previousCount) => {
    if (didFitLoadedFlow.value || previousCount !== 0 || nodeCount === 0) return;
    didFitLoadedFlow.value = true;
    await nextTick();
    await waitForCanvasPaint();
    fitView({ padding: 0.2 });
  },
);

function onNodeClick({ node }) {
  flow.selectNode(node.id);
}

function onNodeDoubleClick({ node }) {
  flow.inspectNode(node.id);
}

function onDrop(event) {
  const type = event.dataTransfer.getData('application/x-flow-node');
  if (!type) return;

  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY,
  });

  flow.addNode(type, position);
}

function onKeyDown(event) {
  if (!['Backspace', 'Delete'].includes(event.key)) return;
  if (isTypingTarget(event.target)) return;
  const deleted = flow.deleteSelectedElements();
  if (deleted) {
    event.preventDefault();
  }
}

function isTypingTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable;
}

function zoomToFit() {
  fitView({ padding: 0.2 });
}

function zoomInCanvas() {
  zoomIn();
}

function zoomOutCanvas() {
  zoomOut();
}

function resetZoom() {
  setViewport({ x: 0, y: 0, zoom: 1 });
}

function waitForCanvasPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

async function tidyUp() {
  flow.tidyNodes();
  await nextTick();
  await waitForCanvasPaint();
  fitView({ padding: 0.2 });
}
</script>

<style scoped>
.fb-canvas {
  position: relative;
  min-width: 0;
  min-height: 0;
  height: 100%;
  background:
    radial-gradient(circle at 18% 16%, rgba(0, 239, 255, 0.08), transparent 28%),
    radial-gradient(circle at 84% 78%, rgba(188, 0, 255, 0.08), transparent 30%),
    var(--fb-bg);
}

.fb-canvas :deep(.vue-flow) {
  height: 100%;
}

.fb-canvas-controls {
  position: absolute;
  left: 28px;
  bottom: 28px;
  z-index: 8;
  display: flex;
  gap: 12px;
}

.fb-canvas-controls button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  background: #151519;
  cursor: pointer;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
}

.fb-canvas-controls button:hover {
  border-color: var(--fb-accent);
  color: var(--fb-accent);
}

.fb-canvas-controls button.is-accent {
  border-color: rgba(220, 53, 69, 0.72);
  color: #ff9b92;
  background: rgba(220, 53, 69, 0.22);
}

.fb-canvas-controls svg {
  width: 25px;
  height: 25px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
