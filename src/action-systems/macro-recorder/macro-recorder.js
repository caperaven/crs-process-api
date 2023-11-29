class MacroRecorder {
    #steps = [];
    #clickHandler = this.#click.bind(this);
    #dblClickHandler = this.#dblClick.bind(this);
    #keyDownHandler = this.#keyDown.bind(this);
    #keyUpHandler = this.#keyUp.bind(this);
    #focusInHandler = this.#focusIn.bind(this);
    #focusOutHandler = this.#focusOut.bind(this);

    dispose() {
        this.#steps.length = 0;
    }

    async #enableListeners() {}
    async #disableListeners() {}

    async #click(event) {}
    async #dblClick(event) {}
    async #keyDown(event) {}
    async #keyUp(event) {}
    async #focusIn(event) {}
    async #focusOut(event) {}


    /**
     * Start recording process
     * @returns {Promise<void>}
     */
    async start() {}

    /**
     * Stop recording process
     * @returns {Promise<void>}
     */
    async stop() {}

    /**
     * Pass the recording so that it can be resumed later
     * @returns {Promise<void>}
     */
    async pause() {}

    /**
     * Resume recording process
     * @returns {Promise<void>}
     */
    async resume() {}

    /**
     * Clear all recorded steps
     * @returns {Promise<void>}
     */
    async clear() {}

    /**
     * Save recorded steps to a json object
     * @returns {Promise<void>}
     */
    async save() {}

    /**
     * Load recorded steps from a json object
     * @returns {Promise<void>}
     */
    async load() {}
}