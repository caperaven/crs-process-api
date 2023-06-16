import "./packages/crs-binding/crs-binding.js";
import "./packages/crs-modules/crs-modules.js";
import './packages/crs-schema/crs-schema.js';
import {HTMLParser} from "./packages/crs-schema/html/crs-html-parser.js";
import {initialize} from "./src/index.js";
import "./components/view-loader/view-loader.js";
await initialize("/src");

export class IndexViewModel {
    #bid;
    constructor() {
        this.#bid = crsbinding.data.addObject(this.constructor.name);
        crsbinding.data.addContext(this.#bid, this);
        crsbinding.dom.enableEvents(this);
        crsbinding.parsers.parseElements(document.body.children, this.#bid);
        crs.call("schema", "register", {
            id: "html",
            parser: HTMLParser,
            providers: []
        })
    }
}

globalThis.indexViewModel = new IndexViewModel();