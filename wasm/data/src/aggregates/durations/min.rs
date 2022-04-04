use serde_json::Value;
use crate::duration::iso8601_placement;
use crate::enums::Placement;
use crate::traits::Aggregate;

pub struct Min {
    pub value: Value
}

impl Min {
    pub fn new() -> Min {
        Min {
            value: Value::from("P10000Y")
        }
    }
}

impl Aggregate for Min {
    fn add_value(&mut self, obj: &Value) {
        match iso8601_placement(obj, &self.value) {
            Placement::Before => {
                self.value = obj.clone()
            }
            Placement::After => {}
        }
    }

    fn value(&self) -> Value {
        self.value.clone()
    }
}