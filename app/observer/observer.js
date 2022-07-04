export default class Observer extends crsbinding.classes.ViewBase {
    set data(newValue) {
        this._data = newValue;
        crsbinding.data.setProperty(this, "data-observer", true);
    }

    get data() {
        return this._data;
    }

    async connectedCallback() {
        this.id = "observer_viewmodel";

        crs.call("component", "observe", {
            element: this,
            properties: ["data-observer", "loaded-observer"],
            callback: this.callback
        })

        crs.call("component", "observe", {
            element: this,
            properties: ["data-observer", "loaded-observer, loaded2-observer"],
            callback: this.callback
        })

        await super.connectedCallback();

        requestAnimationFrame(() => {
            this.data = [];
        })
    }

    callback() {
        crsbinding.data.setProperty(this, "title", "observer is ready");
    }

    ready() {
        crsbinding.data.setProperty(this, "loaded-observer", true);
    }
}