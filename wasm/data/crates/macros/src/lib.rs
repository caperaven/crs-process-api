extern crate proc_macro;

use proc_macro::TokenStream;
use syn::{parse_macro_input, DeriveInput};
use quote::quote;

#[proc_macro_attribute]
pub fn evaluate(args: TokenStream, input: TokenStream) -> TokenStream {
    let input= parse_macro_input!(input as DeriveInput);
    let name= input.ident;
    let _operator= args.into_iter().next().unwrap();

    let result = quote! {
        struct #name {}

        impl Eval for #name {
            fn evaluate(obj1: Value, obj2: Value) -> bool {
                false
            }
        }
    };

    TokenStream::from(result)
}
