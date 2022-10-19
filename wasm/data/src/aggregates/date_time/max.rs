use chrono::NaiveDateTime;
use serde_json::Value;
use crate::traits::Aggregate;

pub struct Max {
    pub value: NaiveDateTime
}

impl Max {
    pub fn new() -> Max {
        Max {
            value: NaiveDateTime::MIN
        }
    }
}

impl Aggregate for Max {
    fn add_value(&mut self, obj: &Value) {
        match obj {
            Value::Null => {}
            _ => {
                let date_str = obj.as_str().unwrap();
                let date = NaiveDateTime::parse_from_str(date_str, "%Y/%m/%d %H:%M:%S").unwrap();
                self.value = self.value.max(date);
            }
        }
    }

    fn value(&self) -> Value {
        let result = self.value.format("%Y/%m/%d %H:%M:%S").to_string();
        Value::from(result)
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::aggregates::DateMax;
    use crate::traits::Aggregate;

    #[test]
    fn test() {
        let mut max: DateMax = DateMax::new();
        max.add_value(&Value::from("2020/01/01 00:00:00"));
        max.add_value(&Value::from("2022/01/01 00:00:00"));
        max.add_value(&Value::from("1970/01/01 00:00:00"));

        let result = max.value();
        let result_str = result.as_str().unwrap();
        assert_eq!(result_str, "2022/01/01 00:00:00");
    }
}