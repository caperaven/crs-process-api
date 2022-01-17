use std::collections::HashMap;
use serde_json::{Number, Value};
use crate::aggregates;
use crate::traits::Aggregate;

trait Processor {
    fn process(&mut self, value: &Value);
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