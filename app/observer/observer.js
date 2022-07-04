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

        this.id1 = await crs.call("component", "observe", {
            element: this,
            properties: ["data-observer", "loaded-observer"],
            callback: this.callback
        })

        this.id2 = await crs.call("component", "observe", {
            element: this,
            properties: ["data-observer", "loaded-observer", "loaded2-observer"],
            callback: this.callback2
        })

        await super.connectedCallback();

        requestAnimationFrame(() => {
            this.data = [];
        })
    }

    callback() {
        crsbinding.data.setProperty(this, "title", "observer is ready");
    }

    async callback2() {
        crsbinding.data.setProperty(this, "title2", "observer2 is ready");

        await crs.call("component", "unobserve", {
            element: this,
            ids: [this.id1, this.id2]
        })
    }

    ready() {
        crsbinding.data.setProperty(this, "loaded-observer", true);
    }

    ready2() {
        crsbinding.data.setProperty(this, "loaded2-observer", true);
    }
}