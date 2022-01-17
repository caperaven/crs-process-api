use std::collections::HashMap;
use serde_json::{Value};
use crate::aggregates;
use crate::traits::Aggregate;

trait Processor {
    fn process(&mut self, value: &Value);
    fn to_value(&mut self, obj: &mut Value);
}

pub struct NumberField {
    name: String,
    unique_values: HashMap<String, i64>,
    min_aggregate: aggregates::Min,
    max_aggregate: aggregates::Max,
    ave_aggregate: aggregates::Ave,
    sum_aggregate: aggregates::Sum,
}

impl NumberField {
    pub fn new(name: String) -> NumberField {
        NumberField {
            name,
            unique_values: HashMap::new(),
            min_aggregate: aggregates::Min::new(),
            max_aggregate: aggregates::Max::new(),
            ave_aggregate: aggregates::Ave::new(),
            sum_aggregate: aggregates::Sum::new()
        }
    }
}

impl Processor for NumberField {
    fn process(&mut self, value: &Value) {
        self.min_aggregate.add_value(value);
        self.max_aggregate.add_value(value);
        self.ave_aggregate.add_value(value);
        self.sum_aggregate.add_value(value);

        let _ = &self.unique_values.entry(value.to_string())
            .and_modify(|count| *count += 1)
            .or_insert(1);
    }

    fn to_value(&mut self, obj: &mut Value) {
        obj[&self.name] = Value::Object(Default::default());
        let instance = obj.get_mut(&self.name).unwrap();
        instance["min"] = Value::from(self.min_aggregate.value);
        instance["max"] = Value::from(self.max_aggregate.value);
        instance["ave"] = Value::from(self.ave_aggregate.value);
        instance["sum"] = Value::from(self.sum_aggregate.value);
    }
}

pub struct DateField {
    name: String,
    unique_values: HashMap<String, i64>,
    min_aggregate: aggregates::DateMin,
    max_aggregate: aggregates::DateMax
}

impl DateField {
    pub fn new(name: String) -> DateField {
        DateField {
            name,
            unique_values: HashMap::new(),
            min_aggregate: aggregates::DateMin::new(),
            max_aggregate: aggregates::DateMax::new()
        }
    }
}

impl Processor for DateField {
    fn process(&mut self, value: &Value) {
        self.min_aggregate.add_value(value);
        self.max_aggregate.add_value(value);

        let _ = &self.unique_values.entry(value.to_string())
            .and_modify(|count| *count += 1)
            .or_insert(1);
    }

    fn to_value(&mut self, obj: &mut Value) {
        obj[&self.name] = Value::Object(Default::default());
        let instance = obj.get_mut(&self.name).unwrap();
        instance["min"] = Value::from(self.min_aggregate.value);
        instance["max"] = Value::from(self.max_aggregate.value);
    }
}

pub struct DurationField {
    name: String,
    unique_values: HashMap<String, i64>,
    min_aggregate: aggregates::DurationMin,
    max_aggregate: aggregates::DurationMax,
    ave_aggregate: aggregates::DurationAve,
    sum_aggregate: aggregates::DurationSum
}

impl DurationField {
    pub fn new(name: String) -> DurationField {
        DurationField {
            name,
            unique_values: HashMap::new(),
            min_aggregate: aggregates::DurationMin::new(),
            max_aggregate: aggregates::DurationMax::new(),
            ave_aggregate: aggregates::DurationAve::new(),
            sum_aggregate: aggregates::DurationSum::new()
        }
    }
}

impl Processor for DurationField {
    fn process(&mut self, value: &Value) {
        self.min_aggregate.add_value(value);
        self.max_aggregate.add_value(value);
        self.ave_aggregate.add_value(value);
        self.sum_aggregate.add_value(value);

        let _ = &self.unique_values.entry(value.to_string())
            .and_modify(|count| *count += 1)
            .or_insert(1);
    }

    fn to_value(&mut self, obj: &mut Value) {
        obj[&self.name] = Value::Object(Default::default());
        let instance = obj.get_mut(&self.name).unwrap();
        instance["min"] = Value::from(self.min_aggregate.value);
        instance["max"] = Value::from(self.max_aggregate.value);
        instance["ave"] = Value::from(self.ave_aggregate.value);
        instance["sum"] = Value::from(self.sum_aggregate.value);
    }
}

#[cfg(test)]
mod test {
    use serde_json::{Value};
    use crate::processors::structures::{NumberField, DateField, DurationField};
    use crate::processors::structures::summary::Processor;

    #[test]
    fn number_field_test() {
        let mut number_field = NumberField::new("value".to_string());
        number_field.process(&Value::from(10));
        number_field.process(&Value::from(20));
        number_field.process(&Value::from(30));

        let mut result = Value::Object(Default::default());
        number_field.to_value(&mut result);

        assert_eq!(result.pointer("/value/min").unwrap(), &Value::from(10.));
        assert_eq!(result.pointer("/value/max").unwrap(), &Value::from(30.));
        assert_eq!(result.pointer("/value/ave").unwrap(), &Value::from(20.));
        assert_eq!(result.pointer("/value/sum").unwrap(), &Value::from(60.));
    }

    #[test]
    fn date_field_test() {
        let mut date_field = DateField::new("value".to_string());

        date_field.process(&Value::from(10));
        date_field.process(&Value::from(20));
        date_field.process(&Value::from(30));

        let mut result = Value::Object(Default::default());
        date_field.to_value(&mut result);

        assert_eq!(result.pointer("/value/min").unwrap(), &Value::from(10.));
        assert_eq!(result.pointer("/value/max").unwrap(), &Value::from(30.));
    }

    #[test]
    fn duration_field_test() {
        let mut duration_field = DurationField::new("value".to_string());

        duration_field.process(&Value::from(10));
        duration_field.process(&Value::from(20));
        duration_field.process(&Value::from(30));

        let mut result = Value::Object(Default::default());
        duration_field.to_value(&mut result);

        assert_eq!(result.pointer("/value/min").unwrap(), &Value::from(10.));
        assert_eq!(result.pointer("/value/max").unwrap(), &Value::from(30.));
        assert_eq!(result.pointer("/value/ave").unwrap(), &Value::from(20.));
        assert_eq!(result.pointer("/value/sum").unwrap(), &Value::from(60.));
    }
}
