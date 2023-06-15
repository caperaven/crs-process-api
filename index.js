import "./packages/crs-binding/crs-binding.js";
import "./packages/crs-modules/crs-modules.js";
import {initialize} from "./src/index.js";
import "./components/view-loader/view-loader.js";
await initialize("/src");
