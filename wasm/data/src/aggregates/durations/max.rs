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

#[cfg(test)]
mod test {
    use serde_json::{Value};
    use crate::aggregates::durations::Max;
    use crate::traits::Aggregate;

    #[test]
    fn max_test() {
        let mut instance = Max::new();
        instance.add_value(&Value::from("PT2.2S"));
        instance.add_value(&Value::from("PT3.2S"));
        instance.add_value(&Value::from("PT1.2S"));

        let value = instance.value();
        assert_eq!(value, Value::from("PT3.2S"));
    }
}