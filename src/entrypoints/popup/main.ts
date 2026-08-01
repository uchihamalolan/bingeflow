import { render } from "solid-js/web";

import App from "./App";

const target = document.getElementById("app");
if (!target) throw new Error("Target container 'app' not found");

render(() => App(), target);
