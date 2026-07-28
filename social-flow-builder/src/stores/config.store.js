import { defineStore } from 'pinia';

function readPageValue(selector) {
  if (typeof document === 'undefined') {
    return '';
  }
  const element = document.querySelector(selector);
  const value = element?.value;
  return typeof value === 'string' ? value.trim() : '';
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    mode: 'standalone',
    apiBaseUrl: '/api/flow-builder',
    userId: '',
    flowId: null,
    enabledNodes: ['input', 'http_request', 'http_response', 'rest_api', 'prompt', 'javascript', 'post', 'condition'],
    theme: {},
  }),
  actions: {
    init(config = {}) {
      const pageBaseUrl = readPageValue('#x-base-url');
      const pageFlowId = readPageValue('#x-flow-uuid');
      const pageUserId = readPageValue('#x-user-uuid');

      this.mode = config.mode || this.mode;
      this.apiBaseUrl = pageBaseUrl || config.apiBaseUrl || this.apiBaseUrl;
      this.userId = pageUserId || config.userId || this.userId;
      this.flowId = pageFlowId || config.flowId || this.flowId;
      this.enabledNodes = config.enabledNodes || this.enabledNodes;
      this.theme = config.theme || {};
    },
  },
});
