use serde_json::Value;
use iso8601_duration::Duration;
use crate::enums::Placement;

pub fn iso8601_to_duration_str(date: &Value) -> String {
    let value = date.as_str().unwrap();
    let result = Duration::parse(value);

    return match result {
        Ok(duration) => {
            format!("{}:{}:{}:{}:{}", duration.month, duration.day, duration.hour, duration.minute, duration.second)
        }
        Err(err) => {
            err.to_string()
        }
    }
}

/// check the evaluate value against the reference value
/// tell me if must come before or after the reference
pub fn iso8601_placement(evaluate: &Value, reference: &Value) -> Placement {
    let evd = Duration::parse(evaluate.as_str().unwrap()).unwrap();
    let rfd = Duration::parse(reference.as_str().unwrap()).unwrap();

    if evd.month > rfd.month || evd.day > rfd.day || evd.hour > rfd.hour || evd.minute > rfd.minute || evd.second > rfd.second {
        return Placement::After
    }

    return Placement::Before
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::duration::{iso8601_placement, iso8601_to_duration_str};
    use crate::enums::Placement;

    #[test]
    fn value_to_date_string_test() {
        let result = iso8601_to_duration_str(&Value::from("PT100H30M"));
        assert_eq!(result, "0:0:100:30:0".to_string());

        let result = iso8601_to_duration_str(&Value::from("PT4.927647S"));
        assert_eq!(result, "0:0:0:0:4.927647".to_string());
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
}