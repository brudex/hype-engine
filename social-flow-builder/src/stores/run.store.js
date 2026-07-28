import { defineStore } from 'pinia';

export const useRunStore = defineStore('run', {
  state: () => ({
    status: 'idle',
    mode: 'test',
    context: {
      trigger: {
        status: 'success',
        output: {
          body: { productId: 'demo-launch', platform: 'x' },
        },
        meta: {
          triggeredAt: new Date().toISOString(),
        },
        error: null,
      },
    },
    log: [],
  }),
  actions: {
    start(mode) {
      this.mode = mode;
      this.status = 'running';
      this.context = {
        trigger: {
          status: 'success',
          output: {
            body: { productId: 'demo-launch', platform: 'x' },
          },
          meta: {
            triggeredAt: new Date().toISOString(),
          },
          error: null,
        },
      };
      this.log = [];
    },
    addLog(entry) {
      this.log.unshift({
        at: new Date().toISOString(),
        ...entry,
      });
    },
    clear() {
      this.status = 'idle';
      this.log = [];
    },
    setNodeOutput(nodeId, contextEntry) {
      this.context[nodeId] = contextEntry;
    },
    finish(status = 'success') {
      this.status = status;
    },
  },
});
