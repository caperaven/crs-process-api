use serde_json::Value;
use crate::traits::Aggregate;

pub struct Min {
    pub value: f64
}

impl Min {
    pub fn new() -> Min {
        Min {
            value: f64::MAX
        }
    }
}

impl Aggregate for Min {
    fn add_value(&mut self, obj: &Value) {
        let value = obj.as_f64().unwrap();
        if value < self.value {
            self.value = value;
        }
    }

    fn value(&self) -> f64 {
        self.value
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::min::Min;
    use crate::traits::Aggregate;

    #[test]
    fn sum_test() {
        let mut min = Min::new();
        min.add_value(&Value::from(10));
        min.add_value(&Value::from(20));
        min.add_value(&Value::from(5));

        assert_eq!(min.value, 5.);
    }
}