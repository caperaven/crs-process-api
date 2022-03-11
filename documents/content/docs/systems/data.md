# Data

These functions perform data functions helping you build data perspectives.

{{< hint danger >}}
**Not loaded by default**  
This uses web assembly so it is not loaded by default.
If you want this feature, all you need to do is import the `data-actions.js` file.  
This will auto register the intent as `crs.intent.data`
{{< / hint >}}

## Actions

1. [filter_data](#filter_data)
2. [sort](#sort)
3. [group](#group)
4. [aggregate](#aggregate)
5. [aggregateGroup](#aggregateGroup)
6. [in_filter](#in_filter)
7. [unique_values](#unique_values)
8. [debug](#debug)
10. [perspective](#perspective)
11. [iso8601_to_string](#iso8601_to_string)
12. [iso8601_batch](#iso8601_batch)

## filter_data
Filter data based on filter expressions and return an array of indexes of records that match that filter.  

**result example**
{{< highlight js >}}
[1, 3, 5, 20]
{{< / highlight >}}

| property | description | required |
| :------- | :---------- | :--------: |
| source  | array of records or a json string | true |
| filter  | array of filter objects | true |

**filter object example**

{{< highlight js >}}
{ "field": "site", "operator": "==", "value": "site 1" }
{{< / highlight >}}

**list of supported operator values**

| operator | description | data types |
| :------- | :---------- | :---------- | 
| ">", "gt"         | greater than | all |
| ">=", "ge"        | greater or equal too | all |
| "<", "lt"         | less than | all |
| "<=", "le"        | less or equal too | all |
| "==", "=", "eq"   | equals | all |
| "!=", "<>", "ne"  | not equal too | all |
| "is_null"         | is null | all |
| "not_null"        | not null | all |
| "like"            | like | string |
| "not_like"        | not like | string |
| "in"              | one of / in collection | array of values |
| "between"         | greater than value 1 and less than value 2| all |
| "startswidth"     | string starts with substring | string |
| "endswidth"       | string ends with substring | string |

Filter expressions also support "or", "and" and "not".  
"and" is the default so if you don't define it, the expressions are chained by default using "and".  
That means that each expression must pass to return a "true" result.

| operator      | description |
| :-------      | :---------- | 
| "and", "&&"   | and |
| "or",  "\|\|" | or  |
| "not", "!"    | invert of expression |

### simple_filter_example

This example is true for one to N filter expressions using the "and" operator.

{{< highlight js >}}
filter: [
    { "field": "site", "operator": "==", "value": "site 1" },
    { "field": "value", "operator": "gt", "value": 10}
]
{{< / highlight >}}

### not_expression

{{< highlight js >}}
filter: {
    "operator": "not",
    "expressions": [
        { "field": "site", "operator": "==", "value": "site 1" },
        { "field": "value", "operator": "gt", "value": 10}
    ]   
}
{{< / highlight >}}

"and" the two expressions and return the inverse of that.

### or_expression

{{< highlight js >}}
filter: {
    "operator": "or",
    "expressions": [
        { "field": "site", "operator": "==", "value": "site 1" },
        { "field": "value", "operator": "gt", "value": 10}
    ]   
}
{{< / highlight >}}

Either one of the two expressions must be true for the expression to pass.

### complex_nexted_statement

{{< highlight js >}}
filter: {
    "operator": "not",
    "expressions": [
        {
            "operator": "and",
            "expressions": [
                {
                    "operator": "or",
                    "expressions": [
                        {"value", "eq", 1},
                        {"value", "eq", 2},
                    ]
                },
                {"value2", "eq", 3},
            ]
        }
    ]
}
{{< / highlight >}}

| property | description | required | default value
| :------- | :---------- | :--------: | :--------: |
| source  | the array of data to filter | true |
| filter  | filter expressions as seen above | true |
| case_sensitive  | the array of data to filter | false | true |

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "filter",
    "args"   : {
        "source": "$context.data",
        "filter": [{ "field": "site", "operator": "==", "value": "site 1" }],
        "case_sensitive": false
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "filter", {
    "source": "$context.data",
    "filter": [{ "field": "site", "operator": "==", "value": "site 1" }],
    "case_sensitive": false
});
{{< / highlight >}}

## sort

Sort the data according to sort definition.  
The result, same as the filter is an array of indexes.

| property | description | required | default value
| :------- | :---------- | :--------: | :--------: |
| source  | the array of data to sort | true |
| sort    | array of sort definition (see examples below) | true |

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "sort",
    "args"   : {
        "source": "$context.data",
        "sort"  : [
            { "name": "site", "direction": "dec" },
            { "name": "value", "direction": "asc" },
        ]       
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "sort", {
    "source": "$context.data",
    "sort"  : [
        { "name": "site", "direction": "dec" },
        { "name": "value", "direction": "asc" },
    ]       
});
{{< / highlight >}}

## group

Create a group object that defines how data is grouped based on group definition.  

| property | description | required | default value
| :------- | :---------- | :--------: | :--------: |
| source  | the array of data to group | true |
| fields  | array of field names that define the grouping | true |

Group by first field, then the next field, and so on...

**result structure**

{{< highlight js >}}
{
    "root": {
        "child_count": 3,
        "children": {
            "Site 1": {
                "child_count": 1, 
                "field": "value",
                "row_count": 1,
                "rows": [1]
            },
            ...
        },
        "row_count": 3
    }
}
{{< / highlight >}}

A couple of notes:

1. There will always be a root object.
2. Each grouping has a `children` property.
3. The root level item has a `rows` property, an array of indexes to the rows in the data.
4. The child count indicates the number of children on the next level.
5. The row count indicates how many records are represented on this branch.

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "group",
    "args"   : {
        "source": "$context.data",
        "fields"  : ["site", "value"]       
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "group", {
    "source": "$context.data",
    "fields"  : ["site", "value"]
});
{{< / highlight >}}

## aggregate

Calculate aggregate values from the data source.

| property  | description | required | default value
| :-------  | :---------- | :--------: | :--------: |
| source    | the array of data to sort | true |
| aggregate | object defining key value pairs for grouping | true |

The key in the aggregate definition is the aggregate function to use.  
The value is the field name of the value to use in the calculation.

Supported aggregate functions are:

1. min   
2. max   
3. ave   
4. sum   
5. count 

You can aggregate using different fields in the same call.  
The example below aggregates three different fields, "value", "value2" and "value3" using different aggregate functions.

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "aggregate",
    "args"   : {
        "source"    : "$context.data",
        "aggregate" : {
            "min": "value",
            "ave": "value",
            "ave": "value2",
            "ave": "value3"
        }     
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "aggregate", {
    "source": "$context.data",
    "aggregate" : {
        "min": "value",
        "ave": "value",
        "ave": "value2",
        "ave": "value3"
    }
});
{{< / highlight >}}

## aggregateGroup

If you have a grouping result object, you may want to calculate aggregates for records for a given group of sub-group.
The call looks exactly like the above (aggregate rows)(#aggregate_rows) with two differences.

1. the action to call is "aggregate_group".
2. in the args you need to pass on the group object you want to aggregate.

So when we say, pass on the group, what are we talking about?  
Consider the [group](#group_data) result example above, you can get the group as:

{{< highlight js >}}
const group = mygroup["root"].children["Site 1"];
{{< / highlight >}}

## in_filter

This function checks if a defined source object fits in a filter expression.  
This is often used when you have an existing filter but have incoming data.  
Do you render the new record or leave it out?  
This function helps you decide if the object is visible based on the filter definition.

| property  | description | required | default value
| :-------  | :---------- | :--------: | :--------: |
| source    | object to check | true |
| filter    | filter definition, same as used in filter action | true |
| case_sensitive | is the filter case sensitive or not | false | true |

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "in_filter",
    "args"   : {
        "source"    : "$context.record",
        "filter": [
            { "field": "site", "operator": "==", "value": "site 1" },
            { "field": "value", "operator": "gt", "value": 10}
        ]
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "in_filter", {
    "source" : "$context.record",
    "filter" : [
        { "field": "site", "operator": "==", "value": "site 1" },
        { "field": "value", "operator": "gt", "value": 10}
    ]
});
{{< / highlight >}}

## unique_values

For a given array of objects, get the unique values and count for given fields.  
There are a number of use cases for this.  
One would be to get an understanding of how the records are distributed between values.  
It is also used as part of filters visualizations.

| property  | description | required | 
| :-------  | :---------- | :--------: |
| source    | array of objects to use | true |
| fields    | field definition object | true |

The field definition object exists out of two properties.

1. name
2. type

Supported types are:

1. string
2. duration
3. long
4. number
5. boolean

If none is defined it will default to string.

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "unique_values",
    "args"   : {
        "source" : "$context.record",
        "fields" : [
            {"name": "isActive", type: "boolean"},
            {"name": "external_code"}
        ]
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "unique_values", {
    "source" : "$context.record",
    "fields" : [
        {"name": "isActive", type: "boolean"},
        {"name": "external_code"}
    ]
});
{{< / highlight >}}

## debug

This is used for debugging.  
If something goes wrong with your web assembly call and, you want to get debug information back, use this function before making your problematic call.
The error will now contain stack data.

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "debug"
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "debug"});
{{< / highlight >}}


## perspective

This function is a single call to build a perspective.  
The result will change based on the parts of the perspective.  
If you have aggregates defined, you will get an aggregate result.  
If you define grouping, you will get a grouping result.  
If you only define filter and or sort, you will get an array of index back.

The properties of the perspective object will define what this will do.  
If you add a filter property, a filter will ba applied, add a sort property to perform a sort and so forth.
The example will show all of them, but know that you can have any subset.

**perspective example**

{{< highlight js >}}
{
    "filter"     : [{ "field": "site", "operator": "==", "value": "site 1" }],
    "sort"       : ["field1", "field2"],
    "group"      : ["field1", "field2"],
    "aggregates" : {"min": "value", "max": "value"}
}
{{< / highlight >}}

| property  | description | required | 
| :-------  | :---------- | :--------: |
| source    | array of objects to use | true |
| perspective | perspective object as shown above | true |

**json**

{{< highlight js >}}
"step": {
    "type"   : "data",
    "action" : "perspective",
    "args"   : {
        "source"      : "$context.record",
        "perspective" : { ... }
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("data", "perspective", {
    "source"      : "$context.record",
    "perspective" : { ... }
});
{{< / highlight >}}