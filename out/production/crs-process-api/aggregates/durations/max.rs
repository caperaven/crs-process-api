use iso8601_duration::Duration;
use serde_json::Value;
use crate::duration::{duration_to_seconds};
use crate::traits::Aggregate;

pub struct Max {
    pub value: f32
}

impl Max {
    pub fn new() -> Max {
        Max {
            value: f32::MIN
        }
    }
}

impl Aggregate for Max {
    fn add_value(&mut self, obj: &Value) {
        let value = obj.as_str().unwrap();
        let result = Duration::parse(value);

        if result.is_ok() {
            let result = result.unwrap();
            let seconds = duration_to_seconds(result);
            if seconds > self.value {
                self.value = seconds;
            }
        }
    }

    fn value(&self) -> Value {
        Value::from(self.value)
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
        assert_eq!(value, Value::from(3.200000047683716));
    }
}