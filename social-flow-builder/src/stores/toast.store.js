import { defineStore } from 'pinia';

let toastId = 0;

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: [],
  }),
  actions: {
    show({ title, message = '', type = 'success', duration = 4200 }) {
      const id = `toast_${Date.now()}_${toastId++}`;
      this.items.push({ id, title, message, type });

      if (duration > 0) {
        window.setTimeout(() => {
          this.dismiss(id);
        }, duration);
      }

      return id;
    },
    dismiss(id) {
      this.items = this.items.filter((item) => item.id !== id);
    },
  },
});
