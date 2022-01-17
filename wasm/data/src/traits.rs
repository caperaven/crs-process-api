use serde_json::Value;

pub trait Eval {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool;
}

pub trait Aggregate<T> {
    fn add_value(&mut self, obj: &Value);
    fn value(&self) -> T;
}