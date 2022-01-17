use serde_json::Value;
use crate::traits::Aggregate;

pub struct Ave {
    pub value: f64,
    sum: f64,
    count: f64
}

impl Ave {
    pub fn new() -> Ave {
        Ave {
            value: 0.,
            sum: 0.,
            count: 0.
        }
    }
}

impl Aggregate for Ave {
    fn add_value(&mut self, obj: &Value) {
        let value: f64 = match obj {
            Value::Null => 0.,
            _ => obj.as_f64().unwrap()
        };

        self.sum += value;
        self.count += 1.;
        self.value = self.sum / self.count;
    }

    fn value(&self) -> f64 {
        self.value
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::Ave;
    use crate::traits::Aggregate;

    #[test]
    fn sum_test() {
        let mut ave = Ave::new();
        ave.add_value(&Value::from(10));
        ave.add_value(&Value::from(20));
        ave.add_value(&Value::from(30));
        ave.add_value(&Value::Null);

        assert_eq!(ave.value, 15.);
    }
}