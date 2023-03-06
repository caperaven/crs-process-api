# Object

This will allow you to work with objects.  
Be it getting or setting values, making copies or cloning.

## Actions

1. [set](#set)
2. [get](#get)
3. [delete](#delete)
4. [copy_on_path](#copy_on_path)
5. [create](#create)
6. [assign](#assign)
7. [clone](#clone)
8. [json_clone](#json_clone)
9. [assert](#assert)

## set

Set properties on objects from a base object be it the context, process or item.  
One of these must be provided.

The properties object is a object literal where the property name is the path and the value, the value to set.

**properties**

| property   | description                      | required |
|:-----------|:---------------------------------|:--------:|
| properties | the properties and values to set |   true   |

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "set",
    "args": {
        "properties": {
            "$context.value": "hello world",
            "$item.subObj.value": "$context.value.toUpperCase()"
        }
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
await crs.call("object", "set", {
    "properties": {
        "$context.value": "hello world",
        "$item.subObj.value": "$context.value.toUpperCase()"
    }, context, process, item)
{{< / highlight >}}

**NB:** if you dont define "$context" or "$process" or "$item", "$context" is assumed.  
For example "value" = "$context.value".  
This means that you must pass the object you want to make changes to as the context.

## get

Get a single or batch of values from object paths using either, context, process or item.

**properties**

| property   | description                     | required |
|:-----------|:--------------------------------|:--------:|
| properties | array of paths to get values of |   true   |
| target     | where to copy the values        |  false   |


**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "get",
    "args": {
        "properties": [
            "value", 
            "subObj/value"
        ]   
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
const results = await crs.call("object", "get", {
    properties: [
        "value",           // assumed context
        "$context/value",  // explicit context
        "subobj?/value",   // conditional path expression
        "subObj/value"     // assumed context with sub objects
    ]
}, context)
{{< / highlight >}}

## delete
Delete properties on paths be it context, process or item.

**properties**

| property   | description              | required |
|:-----------|:-------------------------|:--------:|
| properties | array of paths to delete |   true   |


**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "delete",
    "args": {
        "properties": [
            "value",
            "subObj/value"
        ]   
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
const results = await crs.call("object", "delete", {
    properties: [ "value","subObj/value"]
}, context)
{{< / highlight >}}

## copy_on_path

Copy the values of one object to another object.

**properties**

| property   | description                     | required |
|:-----------|:--------------------------------|:--------:|
| source     | object to copy the values from  |   true   |
| target     | object to copy the values too   |   true   |
| properties | array of property paths to copy |   true   |

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "copy_on_path",
    "args": {
        "source": "$context.obj1",
        "target": "$context.obj2",
        "properties": [
            "value",
            "subObj/value"
        ]   
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
await crs.call("object", "copy_on_path", {
    source: obj,
    target: obj2,
    properties: ["subObj/value1"]
})
{{< / highlight >}}

## create

Create an object literal on the target item.  
In javascript just use the normal object literal syntax but this allows you to do the same in a schema.

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "create",
    "args": {
        "target": "$context.obj2"
    }
}
{{< / highlight >}}

## assign

Assign the properties of one object to another.  
This allows the `Object.assign` feature in schemas.

**properties**

| property   | description                     | required |
|:-----------|:--------------------------------|:--------:|
| source     | object to copy the values from  |   true   |
| target     | object to copy the values too   |   true   |

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "assign",
    "args": {
        "source": "$context.obj1",
        "target": "$context.obj2"
    }
}
{{< / highlight >}}

## clone

Create a clone of an object by creating a new object literal and copying either all or a subset of properties from the source.
If target is defined (in schema should be) the new object is attached to that target.  
If no properties are defined, all fields will be copied over.  
**NB:** these are shallow copies and does not support paths.
 
**properties**

| property   | description                    | required |
|:-----------|:-------------------------------|:--------:|
| source     | object to copy the values from |   true   |
| target     | object to copy the values too  |  false   |
| properties | array of fields to copy        |  false   |

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "clone",
    "args": {
        "source": "$context.obj1",
        "target": "$context",
        "properties": ["id", "code", "description"]
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
const clone = await crs.call("object", "clone", {
    source: obj,
    properties: ["id", "copy", "description"]
})
{{< / highlight >}}

## json_clone

This clone function makes an exact copy of the object including paths using JSON parsing.  
This is the preferred clone function for deep cloning objects.
If the target is defined the new object will be set on the target path.

**properties**

| property   | description                    | required |
|:-----------|:-------------------------------|:--------:|
| source     | object to copy the values from |   true   |
| target     | object to copy the values too  |  false   |

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "json_clone",
    "args": {
        "source": "$context.obj1",
        "target": "$context.obj2"
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
const clone = await crs.call("object", "json_clone", { 
    source: obj
})
{{< / highlight >}}

## assert

Assert that the source object properties has a value not `null` or `undefined`.  
If either the source object or any of the properties defined is null the result will be false.
Properties is an array of paths, thus you can check sub object's values.

**properties**

| property   | description                    | required |
|:-----------|:-------------------------------|:--------:|
| source     | object to copy the values from |   true   |
| properties | properties to check            |   true   |
| target     | object to copy the values too  |  false   |

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "assert",
    "args": {
        "source": "$context.obj1",
        "properties": ["property1", "subObj/value"],
        "target": "$context.isValid"
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
const isValid = await crs.call("object", "assert", {
    source: obj
    properties: ["property1", "subObj/value"],
})
{{< / highlight >}}