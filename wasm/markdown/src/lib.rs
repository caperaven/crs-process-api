use wasm_bindgen::prelude::*;
use pulldown_cmark::{Parser, Options, html};
use ammonia::clean;

#[wasm_bindgen]
pub fn markdown_to_html(markdown_input: &str) -> JsValue {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES );
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TASKLISTS);
    options.insert(Options::ENABLE_SMART_PUNCTUATION);

    let parser = Parser::new_ext(markdown_input, options);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    let safe_html = clean(&html_output);

    JsValue::from_str(safe_html.as_str())
}