use serde_json::Value;
use crate::traits::Aggregate;

struct Count {
    value: f64
}

impl Count {
    pub fn new() -> Count {
        Count {
            value: 0.
        }
    }
}

impl Aggregate for Count {
    fn add_value(&mut self, _obj: &Value) {
        self.value += 1.
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::count::Count;
    use crate::traits::Aggregate;

    #[test]
    fn sum_test() {
        let mut count = Count::new();
        count.add_value(&Value::from(10));
        count.add_value(&Value::from(20));
        count.add_value(&Value::from(5));

        assert_eq!(count.value, 3.);
    }
}