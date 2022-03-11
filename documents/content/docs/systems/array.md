# Array

Working with array features.  
For the most part performing array actions in javascript is simple enough and, you don't need to use the process api for this.
The documentation will show how you could use the api to do it but know that the main goal here was for the execution using json schema. 
The source or target properties that refers to arrays can be either a path or an array object.

## Actions

1. [add](#add)
2. [field_to_csv](#field_to_csv)
3. [concat](#concat)
4. [change_values](#change_values)
5. [get_value](#get_value)
6. [map_objects](#map_objects)
7. [get_records](#get_records)
8. [get_range](#get_range)
9. [calculate_paging](#calculate_paging)

## add

Add an item to an existing array.

**properties**

| property | description | required |
| :------- | :---------- | :--------: |
| target   | the array to add too | true |
| value    | the value to add to the array | true |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "add",
    "args": {
        "target": "$context.collection",
        "value": "item"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("array", "add", {
    target: "$context.collection",
    value: "item"
}, context);
{{< / highlight >}}

## field_to_csv

Convert an array of objects to a string of values separated by a delimiter.

**properties**

| property  | description | required |
| :-------  | :---------- | :------: |
| source    | array of objects that must be converted | true |
| target    | where the result is copied too | schema |
| delimiter | the separator between the values | true |
| field     | the field who's value will make up the result | true |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "field_to_csv",
    "args": {
        "source"    : "$context.collection",
        "target"    : "$context.csv",
        "delimiter" : ";",
        "field"     : "value"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("array", "field_to_csv", {
    source    : "$context.collection",
    delimiter : ";",
    field     : "value"
}, context)
{{< / highlight >}}

## concat

Combine two or more arrays into one.

| property  | description | required |
| :-------  | :---------- | :------: |
| sources   | array of paths for arrays to combine | true |
| target    | where the result is copied too | schema |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "concat",
    "args": {
        "sources": ["$context.collection1", "$context.collection1"],
        "target" : "$context.result"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("array", "concat", {
    sources: ["$context.collection1", "$context.collection1"],
}, context)
{{< / highlight >}}

## change_values

Loop through a defined array and change each item's properties as defined.

| property  | description | required |
| :-------  | :---------- | :------: |
| sources   | array to change | true |
| changes   | object that defines the values to change | true |

The changes object represents a key value pair of changes to be made.  
You can define N properties this way.

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "concat",
    "args": {
        "sources": "$context.collection",
        "changes": {
            value1: 10,
            status: "done"
        }
    }
}
{{< / highlight >}}

**javascript**
{{< highlight js >}}
const result = crs.call("array", "change_values", {
    sources: "$context.collection",
    changes: {
        value1: 10,
        status: "done"
    }
}, context)
{{< / highlight >}}

At the end of this, each item in the array will have a value1 of 10 and a status of "done".

## get_value

Given an array of objects, get the value of a property from the object at the defined position.

| property  | description | required |
| :-------  | :---------- | :------: |
| source    | array to work with | true |
| index     | index of the object to get the value from | true |
| field     | the field name to get the value from | true |
| target    | where the result is copied too | schema |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "get_value",
    "args": {
        "sources" : "$context.collection",
        "index"   : 0,
        "field"   : "value",
        "target"  : "$context.value"
    }
}
{{< / highlight >}}

**javascript**
{{< highlight js >}}
const result = crs.call("array", "get_value", {
    sources : "$context.collection",
    index   : 0,
    field   : "value",
}, context)
{{< / highlight >}}

## map_objects

Given an array of objects, get an array values back based on a given fields.  
The resulting array is a flat list of values.
Consider the following array of objects.

{{< highlight js >}}
const values = [
    { v1: 1, v2: 2, v3: 3 }, 
    { v1: 4, v2: 5, v3: 6 }, 
    { v1: 7, v2: 8, v3: 9 }
];
{{< / highlight >}}

If we map it out using properties: "v1" and "v3" the result will contain both the values of "v1" and "v3".
{{< highlight js >}}
[1, 3, 4, 6, 7, 9];
{{< / highlight >}}

| property  | description | required |
| :-------  | :---------- | :------: |
| source    | array to work with | true |
| fields    | array of field names | true |
| target    | where the result is copied too | schema |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "map_objects",
    "args": {
        "source" : "$context.collection",
        "fields" : ["v1", "v3"],
        "target" : "$context.value"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("array", "map_objects", {
    source : "$context.collection",
    fields : ["v1", "v3"]
}, context)
{{< / highlight >}}

## get_range
This function gets the min and max value from an array of objects.  
The result is an object literal with a "min" and "max" property.

| property  | description | required |
| :-------  | :---------- | :------: |
| source    | array to work with | true |
| field     | field to get value from | true |
| target    | where the result is copied too | schema |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "get_range",
    "args": {
        "source" : "$context.collection",
        "field"  : "value",
        "target" : "$context.range"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("array", "get_range", {
    source : "$context.collection",
    field  : "value,
}, context)
{{< / highlight >}}


## get_records
This function gets a batch of records from a source array.  
You can use this function in conjunction with `calculate_paging`.

| property  | description | required |
| :-------  | :---------- | :------: |
| source      | array to work with | true |
| page_number | what is the page number you want to get | true |
| page_size   | how big is a page | true |
| target    | where the result is copied too | schema |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "get_records",
    "args": {
        "source"      : "$context.collection",
        "page_number" : 1,
        "page_size"   : 10
        "target"      : "$context.page"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("array", "get_records", {
    source      : "$context.collection",
    page_number : 1,
    page_size   : 10
}, context)
{{< / highlight >}}

## calculate_paging

Calculate the paging of a given collection.  
The result is an object literal with two properties.

1. record_count
2. page_count

You can use this to manage getting batches of records for virtualization.

| property  | description | required |
| :-------  | :---------- | :------: |
| source      | array to work with | true |
| page_size   | how big is a page | true |
| target    | where the result is copied too | schema |

**json**

{{< highlight js >}}
"step": {
    "type": "array",
    "action": "calculate_paging",
    "args": {
        "source"      : "$context.collection",
        "page_size"   : 10,
        "target"      : "$context.size"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("array", "calculate_paging", {
    source      : "$context.collection",
    page_size   : 10
}, context)
{{< / highlight >}}