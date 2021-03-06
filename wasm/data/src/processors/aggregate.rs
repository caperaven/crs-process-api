use serde_json::Value;
use crate::traits::Aggregate;
use crate::aggregates;
use crate::utils::flood_indexes;

/// Create aggregate objects based on the rows and data provided
pub fn aggregate_rows(intent: &Value, data: &[Value], rows: Option<Vec<usize>>) -> Value {
    let rows = match rows {
        Some(array) => array,
        None => flood_indexes(&data)
    };

    let mut aggregator = create_aggregator_from_intent(&intent);
    let data_array = data;

    let mut i;
    for row_index in rows {
        i = 0;
        let row = &data_array[row_index];

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

fn create_aggregator_from_intent(intent: &Value) -> Vec<Box<dyn Aggregate>> {
    let mut aggregates: Vec<Box<dyn Aggregate>> = Vec::new();

    for (name, _value) in intent.as_object().unwrap().iter() {
        match name.as_str() {
            "ave"   => aggregates.push(Box::new(aggregates::Ave::new())),
            "min"   => aggregates.push(Box::new(aggregates::Min::new())),
            "max"   => aggregates.push(Box::new(aggregates::Max::new())),
            "sum"   => aggregates.push(Box::new(aggregates::Sum::new())),
            "count" => aggregates.push(Box::new(aggregates::Count::new())),

            "ave:duration" => aggregates.push(Box::new(aggregates::DurationAve::new())),
            "min:duration" => aggregates.push(Box::new(aggregates::DurationMin::new())),
            "max:duration" => aggregates.push(Box::new(aggregates::DurationMax::new())),
            "sum:duration" => aggregates.push(Box::new(aggregates::DurationSum::new())),

            "max:date" => aggregates.push(Box::new(aggregates::DateMax::new())),
            "min:date" => aggregates.push(Box::new(aggregates::DateMin::new())),
            _ => {}
        }
    }

    return aggregates;
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::aggregate::{aggregate_rows};
    use random_data::generate_data;

    fn get_data() -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();
        result.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true}));
        result.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false}));
        result.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true}));
        result.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true}));
        result.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false}));
        return result;
    }

    #[test]
    fn count_durations_test() {
        let count: i64 = 10000;
        let data = generate_data(count as usize);

        let intent = json!({
            "count": "duration"
        });

        let result = aggregate_rows(&intent, &data, None);

        let array = result.as_array().unwrap();
        let agg = (&array[0]["value"]).as_array().unwrap();

        let mut sum = 0;
        for i in 0..agg.len() {
            let value: i64 = *&agg[i]["count"].as_i64().unwrap();
            sum += value
        }
        assert_eq!(sum, count)
    }

    #[test]
    fn aggregate_simple_test() {
        let intent = json!({
            "sum": "value"
        });

        let data = get_data();
        let mut rows = Vec::new();
        rows.push(0);
        rows.push(1);
        let result = aggregate_rows(&intent, &data, Some(rows));

        assert_eq!(result[0]["value"], Value::from(20.));
    }

    #[test]
    fn aggregate_test() {
        let intent = json!({
            "min": "value",
            "max": "value",
            "ave": "value"
        });

        let data = get_data();
        let mut rows = Vec::new();
        rows.push(0);
        rows.push(1);
        rows.push(2);
        rows.push(3);
        rows.push(4);

        let result = aggregate_rows(&intent, &data, Some(rows));

        assert_eq!(result.as_array().unwrap().len(), 3);
        assert_eq!(result[0]["value"], 13.);
        assert_eq!(result[1]["value"], 20.);
        assert_eq!(result[2]["value"], 5.);
    }
}