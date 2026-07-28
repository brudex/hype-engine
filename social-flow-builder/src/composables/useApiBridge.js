import axios from 'axios';
import { useConfigStore } from '../stores/config.store';

export function useApiBridge() {
  const config = useConfigStore();

  function resolveFlowId(id) {
    return id || config.flowId;
  }

  function client() {
    return axios.create({
      baseURL: config.apiBaseUrl || '/api/flow-builder',
      timeout: 15000,
      withCredentials: true,
      headers: config.userId ? { 'x-user-id': config.userId } : {},
    });
  }

  return {
    saveFlow: (flow) => {
      const wid = resolveFlowId();
      if (!wid) {
        return Promise.reject(new Error('flowId is required to save (create a flow first, e.g. from the dashboard)'));
      }
      const endpoint = `/flows/save/${encodeURIComponent(wid)}`;
      const headers = config.userId ? { 'x-user-id': config.userId } : {};

      console.groupCollapsed('[Flow Builder] Save flow request');
      console.log('method', 'POST');
      console.log('baseURL', config.apiBaseUrl || '/api/flow-builder');
      console.log('endpoint', endpoint);
      console.log('flowId', wid);
      console.log('headers', headers);
      console.log('payload', flow);
      console.groupEnd();

      return client().post(endpoint, flow);
    },
    loadFlow: (id) => client().get(`/flows/${resolveFlowId(id)}`),
    runFlow: (id, payload) => client().post(`/flows/${resolveFlowId(id)}/run`, payload),
    runNode: (type, payload) => client().post(`/nodes/${type.replace('_', '-')}`, payload),
  };
}
