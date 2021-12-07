// 1. aggregate table
// 2. group

use serde_json::Value;
use crate::traits::Aggregate;
use crate::aggregates::{Min, Max, Ave, Sum, Count};

pub fn aggregate_rows(intent: &Value, data: &Value, rows: &Value) -> Value {
    let mut aggregator = create_aggregator(&intent);

    let mut i = 0;
    for row in data.as_array().unwrap() {
        i = 0;
        for (_agg, field) in intent.as_object().unwrap().iter() {
            match row.get(&field.as_str().unwrap()) {
                None => {}
                Some(value) => {
                    aggregator[i].add_value(value);
                }
            }

            i += 1;
        }
    }

    let mut result: Vec<Value> = Vec::new();

    let mut i = 0;
    for (key, value) in intent.as_object().unwrap().iter() {
        let mut summary     = Value::Object(Default::default());
        let field      = value.as_str().unwrap();
        let value       = aggregator[i].value();

        summary["agg"]      = Value::from(key.as_str());
        summary["field"]    = Value::from(field);
        summary["value"]    = Value::from(value);

        result.push(summary);
        i += 1;
    }

    return Value::from(result);
}

fn create_aggregator(intent: &Value) -> Vec<Box<dyn Aggregate>> {
    let mut aggregates: Vec<Box<dyn Aggregate>> = Vec::new();

    for (name, _value) in intent.as_object().unwrap().iter() {
        match name.as_str() {
            "ave"   => aggregates.push(Box::new(Ave::new())),
            "min"   => aggregates.push(Box::new(Min::new())),
            "max"   => aggregates.push(Box::new(Max::new())),
            "sum"   => aggregates.push(Box::new(Sum::new())),
            "count" => aggregates.push(Box::new(Count::new())),
            _ => {}
        }
    }

    return aggregates;
}


#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::aggregate::aggregate_rows;

    fn get_data() -> Value {
        return json!([
            {"id": 0, "code": "A", "value": 10, "isActive": true},
            {"id": 1, "code": "B", "value": 10, "isActive": false},
            {"id": 2, "code": "C", "value": 20, "isActive": true},
            {"id": 3, "code": "D", "value": 20, "isActive": true},
            {"id": 4, "code": "E", "value": 5, "isActive": false}
        ]);
    }

    #[test]
    fn aggregate_test() {
        let intent = json!({
            "min": "value",
            "max": "value",
            "ave": "value"
        });

        let data = get_data();
        let rows = json!([0,1,2,3,4]);

        let result = aggregate_rows(&intent, &data, &rows);

        println!("{:?}", result.to_string());
    }
}