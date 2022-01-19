use serde_json::Value;
use iso8601_duration::Duration;
use crate::enums::Placement;

pub fn iso8601_to_duration_str(date: &Value) -> String {
    let value = date.as_str().unwrap();
    let result = Duration::parse(value);

    return match result {
        Ok(duration) => {
            format!("{}:{}:{}:{}", duration.day, duration.hour, duration.minute, duration.second)
        }
        Err(err) => {
            err.to_string()
        }
    }
}

pub fn iso8601_to_duration_str_batch(durations: Vec<Value>, path: Option<String>) -> Vec<Value> {
    let mut result: Vec<Value> = Vec::new();

    for duration in durations {
        match path {
            None => {
                let duration_str = iso8601_to_duration_str(&duration);
                result.push(Value::from(duration_str));
            }
            Some(ref path_str) => {
                let value = &duration[&path_str];
                let duration_str = iso8601_to_duration_str(&value);

                let mut clone = duration.clone();
                clone[&path_str] = Value::from(duration_str);
                result.push(clone);
            }
        }
    }

    return result;
}

/// check the evaluate value against the reference value
/// tell me if must come before or after the reference.
/// We evaluate these values ascending so we use the reference object as the base.
/// Does the reference object come before or after the evaluate object
pub fn iso8601_placement(reference: &Value, evaluate: &Value,) -> Placement {
    let evds = match evaluate {
        Value::Null => "PT0S",
        _ => evaluate.as_str().unwrap()
    };

    let rfds = match evaluate {
        Value::Null => "PT0S",
        _ => reference.as_str().unwrap()
    };

    let evd = Duration::parse(evds).unwrap();
    let rfd = Duration::parse(rfds).unwrap();

    if evd.year != rfd.year {
        return match evd.year > rfd.year {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.month != rfd.month {
        return match evd.month > rfd.month {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.day != rfd.day {
        return match evd.day > rfd.day {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.hour != rfd.hour {
        return match evd.hour > rfd.hour {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.minute != rfd.minute {
        return match evd.minute > rfd.minute {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.second != rfd.second {
        return match evd.second > rfd.second {
            true => Placement::Before,
            false => Placement::After
        };
    }

    Placement::After
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::duration::{iso8601_placement, iso8601_to_duration_str};
    use crate::enums::Placement;
    use crate::iso8601_to_duration_str_batch;

    #[test]
    fn value_to_date_string_test() {
        let result = iso8601_to_duration_str(&Value::from("PT100H30M"));
        assert_eq!(result, "0:100:30:0".to_string());

        let result = iso8601_to_duration_str(&Value::from("PT4.927647S"));
        assert_eq!(result, "0:0:0:4.927647".to_string());
    }

    #[test]
    fn iso8601_placement_test() {
        let result = iso8601_placement(&Value::from("PT100H30M"), &Value::from("PT4.927647S"));
        let is_after = match result {
            Placement::Before => false,
            Placement::After => true
        };
        assert_eq!(is_after, true);
    }

    #[test]
    fn iso8601_placement_days_test() {
        let result = iso8601_placement(&Value::from("P0DT21H22M45.97096S"), &Value::from("P13DT21H23M45S"));
        let is_after = match result {
            Placement::Before => false,
            Placement::After => true
        };
        assert_eq!(is_after, false);

        let result = iso8601_placement(&Value::from("P13DT21H23M45S"), &Value::from("P0DT21H22M45.97096S"));
        let is_after = match result {
            Placement::Before => false,
            Placement::After => true
        };
        assert_eq!(is_after, true);
    }

    #[test]
    fn iso8601_to_duration_str_batch_test() {
        let mut durations: Vec<Value> = Vec::new();
        durations.push(Value::from("P13DT21H23M45S"));
        durations.push(Value::from("P0DT21H22M45.97096S"));

        let result = iso8601_to_duration_str_batch(durations, None);
        assert_eq!(result.len(), 2);
        assert_eq!(result[0], Value::from("13:21:23:45"));
        assert_eq!(result[1], Value::from("0:21:22:45.97096"));
    }

    #[test]
    fn iso8601_to_duration_str_batch_path_test() {
        let mut durations: Vec<Value> = Vec::new();
        durations.push(json!({"value": "P13DT21H23M45S", "count": 2}));
        durations.push(json!({"value": "P0DT21H22M45.97096S", "count": 3}));

        let result = iso8601_to_duration_str_batch(durations, Some("value".to_string()));
        assert_eq!(result.len(), 2);

        println!("{:?}",result);

        assert_eq!(result[0]["count"], Value::from(2));
        assert_eq!(result[0]["value"], Value::from("13:21:23:45"));
        assert_eq!(result[1]["count"], Value::from(3));
        assert_eq!(result[1]["value"], Value::from("0:21:22:45.97096"));
    }

}