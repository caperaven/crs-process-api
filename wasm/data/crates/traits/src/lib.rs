use serde_json::Value;

pub trait Eval {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool;
}