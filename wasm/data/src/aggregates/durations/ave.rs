use iso8601_duration::Duration;
use serde_json::Value;
use crate::duration::duration_to_seconds;
use crate::traits::Aggregate;

pub struct Ave {
    pub sum: f32,
    pub count: f32
}

impl Ave {
    pub fn new() -> Ave {
        Ave {
            sum: 0.,
            count: 0.
        }
    }
}

impl Aggregate for Ave {
    fn add_value(&mut self, obj: &Value) {
        let value = obj.as_str().unwrap();
        let result = Duration::parse(value);

        if result.is_ok() {
            let result = result.unwrap();
            let seconds = duration_to_seconds(result);
            self.sum += seconds;
            self.count += 1.;
        }

    }

    fn value(&self) -> Value {
        Value::from(self.sum / self.count)
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::durations::Ave;
    use crate::traits::Aggregate;

    #[test]
    fn ave_test() {
        let mut instance = Ave::new();
        instance.add_value(&Value::from("PT1M"));
        instance.add_value(&Value::from("PT3M"));

        let value = instance.value();
        assert_eq!(value, Value::from(120.0));
    }
}