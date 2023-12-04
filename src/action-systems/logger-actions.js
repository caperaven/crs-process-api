export class LoggerActions {
    #store = {
        currentLevel: LoggerActions.Levels.INFO,
        DEBUG: [],
        INFO: [],
        WARNING: [],
        ERROR: []
    };

    static Levels = {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARNING: 'WARNING',
        ERROR: 'ERROR'
    };

    static Order = {
        DEBUG: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4
    };

    get logs() {
        return this.#store;
    }

    #log(level, message) {
        if (LoggerActions.Order[level] >= LoggerActions.Order[this.#store.currentLevel]) {
            const logMessage = `[${new Date().toISOString()}] ${level}: ${message}`;
            this.#store[level].push(logMessage);
        }
    }

    async debug(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        this.#log(LoggerActions.Levels.DEBUG, message);
    }

    async info(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        this.#log(LoggerActions.Levels.INFO, message);
    }

    async warning(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        this.#log(LoggerActions.Levels.WARNING, message);
    }

    async error(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        this.#log(LoggerActions.Levels.ERROR, message);
    }

    async clear() {
        this.#store.DEBUG = [];
        this.#store.INFO = [];
        this.#store.WARNING = [];
        this.#store.ERROR = [];
    }

    async print() {
        console.log(this.#store);
        return this.#store;
    }

    async set_level(step, context, process, item) {
        this.#store.currentLevel = await crs.process.getValue(step.args.level || "INFO", context, process, item);
    }
}

crs.intent.logger = new LoggerActions();