use serde_json::Value;
use crate::duration::iso8601_placement;
use crate::enums::Placement;
use crate::traits::Aggregate;

pub struct Max {
    pub value: Value
}

impl Max {
    pub fn new() -> Max {
        Max {
            value: Value::from("PT0S")
        }
    }
}

impl Aggregate for Max {
    fn add_value(&mut self, obj: &Value) {
        match iso8601_placement(obj, &self.value) {
            Placement::Before => {}
            Placement::After => {
                self.value = obj.clone()
            }
        }
    }

    fn value(&self) -> Value {
        self.value.clone()
    }
}