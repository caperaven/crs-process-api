use wasm_bindgen::prelude::*;
use pulldown_cmark;

#[wasm_bindgen]
pub fn markdown_to_html(markdown_input: &str) -> JsValue {
    let parser = pulldown_cmark::Parser::new(markdown_input);

    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);

    JsValue::from_str(html_output.as_str())
}