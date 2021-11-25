extern crate proc_macro;

use proc_macro::TokenStream;
use syn::{parse_macro_input, AttributeArgs, DeriveInput};

#[proc_macro_attribute]
pub fn evaluate(args: TokenStream, input: TokenStream) -> TokenStream {
    let args = parse_macro_input!(args as AttributeArgs);
    let input = parse_macro_input!(input as DeriveInput);
    let name = input.ident;



    TokenStream::new()
}