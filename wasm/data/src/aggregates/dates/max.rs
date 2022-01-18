use chrono::{DateTime, Local, MIN_DATETIME, TimeZone};
use serde_json::Value;
use crate::traits::Aggregate;

pub struct Max {
    pub value: DateTime<Local>
}

impl Max {
    pub fn new() -> Max {
        Max {
            value: Local.timestamp(0, 0)
        }
    }
}

impl Aggregate<DateTime<Local>> for Max {
    fn add_value(&mut self, obj: &Value) {
    }

    fn value(&self) -> DateTime<Local> {
        self.value
    }
}

#[cfg(test)]
mod test {
    use chrono::{DateTime, Local};
    use serde_json::Value;

    #[test]
    fn sum_test() {
        //const date: DateTime<Local> = DateTime::parse_from_str("2022/01/17 10:01:40.712", "");
    }
}