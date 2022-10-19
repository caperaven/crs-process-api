use chrono::NaiveDateTime;
use serde_json::Value;
use crate::traits::Aggregate;

pub struct Min {
    pub value: NaiveDateTime
}

impl Min {
    pub fn new() -> Min {
        Min {
            value: NaiveDateTime::MAX
        }
    }
}

impl Aggregate for Min {
    fn add_value(&mut self, obj: &Value) {
         match obj {
             Value::Null => {}
             _ => {
                 let date_str = obj.as_str().unwrap();
                 let date = NaiveDateTime::parse_from_str(date_str, "%Y/%m/%d %H:%M:%S").unwrap();
                 self.value = self.value.min(date);
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
    use crate::aggregates::DateMin;
    use crate::traits::Aggregate;

    #[test]
    fn test() {
        let mut min: DateMin = DateMin::new();
        min.add_value(&Value::from("2020/01/01 00:00:00"));
        min.add_value(&Value::from("2022/01/01 00:00:00"));
        min.add_value(&Value::from("1970/01/01 00:00:00"));

        let result = min.value();
        let result_str = result.as_str().unwrap();
        assert_eq!(result_str, "1970/01/01 00:00:00");
    }
}