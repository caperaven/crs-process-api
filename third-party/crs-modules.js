export class Modules {
    constructor() {
        this.registry = {};
    }

    async dispose() {
        await this.clear();
        this.registry = null;
    }

    async clear() {
        const keys = Object.keys(this.registry);
        for (let key of keys) {
            delete this.registry[key];
        }
    }

    async add(key, file) {
        if (this.registry[key] == null) {
            this.registry[key] = file;
        }
    }

    async remove(key) {
        delete this.registry[key];
    }

    async get(key) {
        if (this.registry[key] == null) return;

        let result = this.registry[key];
        if (typeof result == "string") {
            result = await import(result);
            this.registry[key] = result;
        }
        return result;
    }

    async getDefault(key) {
        return (await this.get(key))?.default;
    }

    async getConstant(key, name) {
        const module = await this.get(key);
        return module?.[name];
    }

    async getPrototype(key, className) {
        const module = await this.get(key);
        return module?.[className || key];
    }

    async getInstanceOf(key, className, ...args) {
        const result = await this.getPrototype(key, className || key);
        return result ? new result(...args) : null;
    }

    async getInstanceOfDefault(key, ...args) {
        const proto = await this.getDefault(key);
        return proto ? new proto(...args) : null;
    }

    async call(key, thisObj, fnName, ...args) {
        const module = await this.get(key);
        const fn = module?.[fnName || key];
        return await fn?.call(thisObj, ...args);
    }

    async callDefault(key, thisObj, ...args) {
        const fn = await this.getDefault(key);
        return await fn?.call(thisObj, ...args);
    }
}

globalThis.crs = globalThis.crs || {};
globalThis.crs.modules = new Modules();

globalThis.crs.modules.enableBinding = async (modules) => {
    for (let module of modules || []) {
        await globalThis.crs.modules.add(module[0], module[1]);
    }

    if (globalThis.crsbinding != null) {
        globalThis.crs.modules._parseElement = globalThis.crsbinding.parsers.parseElement;
        globalThis.crsbinding.parsers.parseElement = async (element, context, options) => {
            await globalThis.crs.modules._parseElement(element, context, options);
            globalThis.crs.modules.get(element.nodeName.toLowerCase());
        }
    }
}

