import { defineStore } from 'pinia';

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [],
  }),
  actions: {
    setAccounts(accounts) {
      this.accounts = accounts;
    },
  },
});
