import { createApp } from 'vue';
import { createPinia } from 'pinia';
import FlowBuilderApp from './FlowBuilderApp.vue';
import { useConfigStore } from './stores/config.store';
import { useAccountsStore } from './stores/accounts.store';
import './styles/base.css';

export function mount(selector, config = {}) {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`FlowBuilder: no element for "${selector}"`);
  }

  const app = createApp(FlowBuilderApp);
  const pinia = createPinia();
  app.use(pinia);

  const cfg = useConfigStore(pinia);
  cfg.init({ ...config, mode: 'embedded' });

  const accounts = useAccountsStore(pinia);
  accounts.setAccounts(config.accounts || []);

  app.mount(el);

  return {
    app,
    unmount: () => app.unmount(),
  };
}

if (typeof window !== 'undefined') {
  window.FlowBuilder = { mount };
}
