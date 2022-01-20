use chrono::Duration;
//use iso8601_duration::Duration;
use serde_json::Value;
use crate::traits::Aggregate;

pub struct Sum {
    pub value: Value
}

impl Sum {
    pub fn new() -> Sum {
        Sum {
            value: Value::from("PT0S")
        }
    }
}

impl Aggregate<Value> for Sum {
    fn add_value(&mut self, obj: &Value) {
        // let v1 = Duration::parse(self.value.as_str().unwrap()).unwrap();
        // let v2 = Duration::parse(obj.as_str().unwrap()).unwrap();
        //
        // let mut result = Duration::new();
        // result.year = v1.year + v2.year;
        // result.month = v1.month + v2.month;
        // result.day = v1.day + v2.day;
        // result.hour = v1.hour + v2.hour;
        // result.min = v1.min + v2.min;
        // result.second = v1.second + v2.second;
        //
        // self.value = Value::from(result.to_std().)

        let v: Duration;
    }

    fn value(&self) -> Value {
        self.value.clone()
    }
}