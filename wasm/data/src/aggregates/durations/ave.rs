use serde_json::Value;
use crate::traits::Aggregate;

pub struct Ave {
    pub value: Value
}

impl Ave {
    pub fn new() -> Ave {
        Ave {
            value: Value::from("PT0S")
        }
    }
}

impl Aggregate for Ave {
    fn add_value(&mut self, obj: &Value) {
    }

    fn value(&self) -> Value {
        self.value.clone()
    }
}