import "./packages/crs-binding/crs-binding.js";
import "./packages/crs-binding/events/event-emitter.js";
import "./packages/crs-binding/classes/bindable-element.js";
import "./packages/crs-binding/expressions/code-factories/if.js";
import "./packages/crs-modules/crs-modules.js";
import './packages/crs-schema/crs-schema.js';
import {HTMLParser} from "./packages/crs-schema/html/crs-html-parser.js";
import {initialize} from "./src/index.js";
import "./components/view-loader/view-loader.js";
await initialize("/src");

export class IndexViewModel {
    #bid;
    constructor() {
        this.#bid = crs.binding.data.addObject(this.constructor.name);
        crs.binding.data.addContext(this.#bid, this);
        crs.binding.dom.enableEvents(this);
        crs.binding.parsers.parseElements(document.body.children, this);
        crs.call("schema", "register", {
            id: "html",
            parser: HTMLParser,
            providers: []
        })
    }

    dispose() {
        this.#bid = null;
    }
}

globalThis.indexViewModel = new IndexViewModel();