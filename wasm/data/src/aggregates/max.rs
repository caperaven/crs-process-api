use serde_json::Value;
use crate::traits::Aggregate;

struct Max {
    value: f64
}

impl Max {
    pub fn new() -> Max {
        Max {
            value: f64::MIN
        }
    }
}

impl Aggregate for Max {
    fn add_value(&mut self, obj: &Value) {
        let value = obj.as_f64().unwrap();
        if value > self.value {
            self.value = value;
        }
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::max::Max;
    use crate::traits::Aggregate;

    #[test]
    fn sum_test() {
        let mut max = Max::new();
        max.add_value(&Value::from(10));
        max.add_value(&Value::from(20));
        max.add_value(&Value::from(5));

        assert_eq!(max.value, 20.);
    }
}