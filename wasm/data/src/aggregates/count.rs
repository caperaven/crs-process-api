use serde_json::Value;
use crate::traits::Aggregate;
use hashbrown::HashMap;

pub struct Count {
    pub values: HashMap<String, i8>
}

impl Count {
    pub fn new() -> Count {
        Count {
            values: Default::default()
        }
    }
}

impl Aggregate for Count {
    fn add_value(&mut self, obj: &Value) {
        let key = match obj {
            Value::Null => String::from("null"),
            _ => obj.to_string()
        };

        let mut count = 1;
        let key_ptr = key.as_str();

        if self.values.contains_key(key_ptr) {
            count = self.values.get(key_ptr).unwrap() + 1;
        }

        self.values.insert(key.to_string(), count);
    }

    fn value(&self) -> Value {
        let mut result: Vec<Value> = Vec::new();

        for (key, val) in self.values.iter() {
            let mut item = Value::Object(Default::default());
            item[key] = Value::from(val.clone());
            result.push(item);
        }

        return Value::from(result);
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::aggregates::count::Count;
    use crate::traits::Aggregate;

    #[test]
    fn sum_test() {
        let mut count = Count::new();
        count.add_value(&Value::from(10));
        count.add_value(&Value::from(20));
        count.add_value(&Value::from(5));
        count.add_value(&Value::from(10));


        let result = count.value();
        let value = result.as_array().unwrap();
        for val in value {
            if val["20"] != json!(null) {
                assert_eq!(val["20"], Value::from(1))
            }
            if val["10"] != json!(null) {
                assert_eq!(val["10"], Value::from(2))
            }
            if val["5"] != json!(null) {
                assert_eq!(val["5"], Value::from(1))
            }
        }
    }
}