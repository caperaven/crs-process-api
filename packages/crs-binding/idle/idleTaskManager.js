import "./idleCallback.js";
class IdleTaskManager {
  #list = [];
  constructor() {
    this.processing = false;
  }
  dispose() {
    this.#list = null;
  }
  async #processQueue() {
    this.processing = true;
    try {
      requestIdleCallback(async () => {
        while (this.#list.length > 0) {
          const fn = this.#list.shift();
          try {
            await fn();
          } catch (e) {
            console.error(e);
          }
        }
      }, { timeout: 1e3 });
    } finally {
      this.processing = false;
    }
  }
  async add(fn) {
    if (typeof fn != "function")
      return;
    if (requestIdleCallback == null)
      return await fn();
    this.#list.push(fn);
    if (this.processing == true)
      return;
    await this.#processQueue();
  }
}
export {
  IdleTaskManager
};
