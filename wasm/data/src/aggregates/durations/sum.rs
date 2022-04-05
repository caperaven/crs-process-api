use iso8601_duration::Duration;
use serde_json::Value;
use crate::duration::{duration_to_seconds};
use crate::traits::Aggregate;

pub struct Sum {
    pub value: f32
}

impl Sum {
    pub fn new() -> Sum {
        Sum {
            value: 0.0
        }
    }
}

impl Aggregate for Sum {
    fn add_value(&mut self, obj: &Value) {
        let value = obj.as_str().unwrap();
        let result = Duration::parse(value);

        if result.is_ok() {
            let result = result.unwrap();
            let seconds = duration_to_seconds(result);
            self.value += seconds;
        }
    }

    fn value(&self) -> Value {
        Value::from(self.value)
    }
}

#[cfg(test)]
mod test {
    use serde_json::{Value};
    use crate::aggregates::durations::Sum;
    use crate::traits::Aggregate;

    #[test]
    fn max_test() {
        let mut instance = Sum::new();
        instance.add_value(&Value::from("PT1H"));
        instance.add_value(&Value::from("PT1M"));

        let value = instance.value();
        assert_eq!(value, Value::from(3660.0));
    }
}