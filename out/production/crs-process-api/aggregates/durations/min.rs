use iso8601_duration::Duration;
use serde_json::Value;
use crate::duration::{duration_to_seconds};
use crate::traits::Aggregate;

pub struct Min {
    pub value: f32
}

impl Min {
    pub fn new() -> Min {
        Min {
            value: f32::MAX
        }
    }
}

impl Aggregate for Min {
    fn add_value(&mut self, obj: &Value) {
        let value = obj.as_str().unwrap();
        let result = Duration::parse(value);

        if result.is_ok() {
            let result = result.unwrap();
            let seconds = duration_to_seconds(result);
            if seconds < self.value {
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
    use crate::aggregates::durations::Min;
    use crate::traits::Aggregate;

    #[test]
    fn max_test() {
        let mut instance = Min::new();
        instance.add_value(&Value::from("PT2.2S"));
        instance.add_value(&Value::from("PT3.2S"));
        instance.add_value(&Value::from("PT1.2S"));

        let value = instance.value();
        assert_eq!(value, Value::from(1.2000000476837158));
    }
}