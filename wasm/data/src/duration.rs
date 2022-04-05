use serde_json::Value;
use iso8601_duration::Duration;
use crate::enums::Placement;

pub fn iso8601_to_duration_str(date: &Value) -> String {
    if date == &Value::Null {
        return "null".to_string();
    }

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
                let value = &duration.get(&path_str);

                match value {
                    None => {
                        result.push(duration.clone());
                    }
                    Some(value) => {
                        let duration_str = iso8601_to_duration_str(&value);

                        let mut clone = duration.clone();
                        clone[&path_str] = Value::from(duration_str);
                        result.push(clone);
                    }
                }
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


pub fn duration_to_seconds(duration: Duration) -> f32 {
    duration.year * 60. * 60. * 24. * 30. * 12.
        + duration.month * 60. * 60. * 24. * 30.
        + duration.day * 60. * 60. * 24.
        + duration.hour * 60. * 60.
        + duration.minute * 60.
        + duration.second
}

pub fn seconds_to_duration(sec: f32) -> Duration {
    let years;
    let mut months;
    let mut days;
    let mut hours;
    let mut minutes;
    let seconds;

    minutes = (sec / 60.).trunc();
    seconds = sec - (minutes * 60.);

    hours = (minutes / 60.).trunc();
    minutes = minutes - (hours * 60.);

    days = (hours / 24.).trunc();
    hours = hours - (days * 24.);

    months = (days / 30.).trunc();
    days = days - (months * 30.);

    years = (months / 12.).trunc();
    months = months - (years * 12.);

    Duration::new(years, months, days, hours, minutes, seconds)
}


#[cfg(test)]
mod test {
    use iso8601_duration::Duration;
    use serde_json::{json, Value};
    use crate::duration::{duration_to_seconds, iso8601_placement, iso8601_to_duration_str, seconds_to_duration};
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
        durations.push(Value::Null);

        let result = iso8601_to_duration_str_batch(durations, None);
        assert_eq!(result.len(), 3);
        assert_eq!(result[0], Value::from("13:21:23:45"));
        assert_eq!(result[1], Value::from("0:21:22:45.97096"));
        assert_eq!(result[2], Value::from("null"));
    }

    #[test]
    fn iso8601_to_duration_str_batch_path_test() {
        let mut durations: Vec<Value> = Vec::new();
        durations.push(json!({"value": "P13DT21H23M45S", "count": 2}));
        durations.push(json!({"value": "P0DT21H22M45.97096S", "count": 3}));
        durations.push(json!({"value": Value::Null, "count": 3}));

        let result = iso8601_to_duration_str_batch(durations, Some("value".to_string()));
        assert_eq!(result.len(), 3);

        assert_eq!(result[0]["count"], Value::from(2));
        assert_eq!(result[0]["value"], Value::from("13:21:23:45"));
        assert_eq!(result[1]["count"], Value::from(3));
        assert_eq!(result[1]["value"], Value::from("0:21:22:45.97096"));
        assert_eq!(result[2]["count"], Value::from(3));
        assert_eq!(result[2]["value"], Value::from("null"));
    }

    fn convert_to_back(year: f32, month: f32, day: f32, hour: f32, min: f32, sec: f32) -> Duration {
        let duration = Duration::new(year, month, day, hour, min, sec);
        let seconds = duration_to_seconds(duration);
        let result = seconds_to_duration(seconds);
        result
    }

    #[test]
    fn seconds_to_duration_40_seconds_test() {
        let result = convert_to_back(0., 0., 0., 0., 0., 40.);
        assert_eq!(result.year, 0.);
        assert_eq!(result.month, 0.);
        assert_eq!(result.day, 0.);
        assert_eq!(result.hour, 0.);
        assert_eq!(result.minute, 0.);
        assert_eq!(result.second, 40.);

        let result = convert_to_back(0., 0., 0., 0., 2., 40.);
        assert_eq!(result.year, 0.);
        assert_eq!(result.month, 0.);
        assert_eq!(result.day, 0.);
        assert_eq!(result.hour, 0.);
        assert_eq!(result.minute, 2.);
        assert_eq!(result.second, 40.);

        let result = convert_to_back(0., 0., 0., 3., 2., 40.);
        assert_eq!(result.year, 0.);
        assert_eq!(result.month, 0.);
        assert_eq!(result.day, 0.);
        assert_eq!(result.hour, 3.);
        assert_eq!(result.minute, 2.);
        assert_eq!(result.second, 40.);

        let result = convert_to_back(0., 0., 1., 3., 2., 40.);
        assert_eq!(result.year, 0.);
        assert_eq!(result.month, 0.);
        assert_eq!(result.day, 1.);
        assert_eq!(result.hour, 3.);
        assert_eq!(result.minute, 2.);
        assert_eq!(result.second, 40.);

        let result = convert_to_back(0., 5., 1., 3., 2., 40.);
        assert_eq!(result.year, 0.);
        assert_eq!(result.month, 5.);
        assert_eq!(result.day, 1.);
        assert_eq!(result.hour, 3.);
        assert_eq!(result.minute, 2.);
        assert_eq!(result.second, 40.);

        let result = convert_to_back(2., 5., 1., 3., 2., 40.);
        assert_eq!(result.year, 2.);
        assert_eq!(result.month, 5.);
        assert_eq!(result.day, 1.);
        assert_eq!(result.hour, 3.);
        assert_eq!(result.minute, 2.);
        assert_eq!(result.second, 40.);
    }
}