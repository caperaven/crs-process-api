use chrono::{DateTime, FixedOffset, MIN_DATETIME, TimeZone};
use serde_json::Value;
use crate::traits::Aggregate;

pub struct Max {
    pub value: DateTime<FixedOffset>
}

impl Max {
    pub fn new() -> Max {
        Max {
            value: DateTime::from(MIN_DATETIME)
        }
    }
}

impl Aggregate<DateTime<FixedOffset>> for Max {
    fn add_value(&mut self, obj: &Value) {
    }

    fn value(&self) -> DateTime<FixedOffset> {
        self.value
    }
}

#[cfg(test)]
mod test {
    use chrono::{DateTime, Local, NaiveDateTime};
    use serde_json::Value;

    #[test]
    fn sum_test() {
        let date_str = "2020/04/12 22:10:57";
        let naive_datetime = NaiveDateTime::parse_from_str(date_str, "%Y/%m/%d %H:%M:%S").unwrap();
        println!("{:?}", naive_datetime);
    }
}