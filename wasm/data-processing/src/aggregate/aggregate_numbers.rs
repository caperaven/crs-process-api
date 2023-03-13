use wasm_bindgen::{JsValue};

pub struct NumberAggregator {
    total: f64,
    min: f64,
    max: f64,
    count: f64
}

impl NumberAggregator {
    pub fn new() -> NumberAggregator {
        NumberAggregator {
            total: 0.0,
            min: f64::MAX,
            max: f64::MIN,
            count: 0.0
        }
    }
    
    pub fn add(&mut self, value: f64) {
        self.total += value;

        if self.min > value {
            self.min = value;
        }

        if self.max < value {
            self.max = value;
        }

        self.count += 1.;
    }

    pub fn value(&self) -> Result<js_sys::Object, JsValue> {
        let min = self.min;
        let max = self.max;
        let sum = self.total;
        let ave = self.total / self.count;

        let obj = js_sys::Object::new();
        js_sys::Reflect::set(&obj,&JsValue::from("min"), &JsValue::from(min))?;
        js_sys::Reflect::set(&obj,&JsValue::from("max"), &JsValue::from(max))?;
        js_sys::Reflect::set(&obj,&JsValue::from("sum"), &JsValue::from(sum))?;
        js_sys::Reflect::set(&obj,&JsValue::from("ave"), &JsValue::from(ave))?;

        Ok(obj)
    }
}