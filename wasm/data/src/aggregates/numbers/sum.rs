use serde_json::Value;
use crate::traits::Aggregate;

pub struct Sum {
    pub value: f64
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
        let value: f64 = match obj {
            Value::Null => 0.,
            _ => obj.as_f64().unwrap()
        };

        self.value += value;
    }

    fn value(&self) -> f64 {
        self.value
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::Sum;
    use crate::traits::Aggregate;

    #[test]
    fn sum_test() {
        let mut sum = Sum::new();
        sum.add_value(&Value::from(10));
        sum.add_value(&Value::from(11));
        sum.add_value(&Value::from(12));
        sum.add_value(&Value::Null);

        assert_eq!(sum.value, 33.);
    }
}