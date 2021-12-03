use serde_json::Value;
use crate::traits::Aggregate;

pub struct Sum {
    value: f64
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
        self.value += obj.as_f64().unwrap();
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::sum::Sum;
    use crate::traits::Aggregate;

    #[test]
    fn sum_test() {
        let mut sum = Sum::new();
        sum.add_value(&Value::from(10));
        sum.add_value(&Value::from(11));
        sum.add_value(&Value::from(12));

        assert_eq!(sum.value, 33.);
    }
}