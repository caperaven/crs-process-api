# Object

This will allow you to work with objects.  
Be it getting or setting values, making copies or cloning.

## Actions

1. [set](#set)
2. [set_on_path](#set_on_path)
3. [get](#get)
4. [get_on_path](#get_on_path)
5. [delete](#delete)
6. [delete_on_path](#delete_on_path)
7. [copy_on_path](#copy_on_path)
8. [create](#create)
9. [assign](#assign)
10. [clone](#clone)
11. [json_clone](#json_clone)
12. [assert](#assert)

## set

On a target object set either one or N property values.
There are two possible scenarios on how this is used.

1. Defining a path and value
2. Defining a target object and properties

**properties**

| property   | description                      | required |
|:-----------|:---------------------------------|:--------:|
| target     | object to set properties on      |   true   |
| value      | the value to add to the array    |  false   |
| properties | the properties and values to set |  false   |

**json**
{{< highlight js >}}
"step": {
    "type": "object",
    "action": "set",
    "args": {
        "target": "$context.value",
        "value": "hello world"
    }
}

"step": {
    "type": "object",
    "action": "set",
    "args": {
        "target": "$context.object",
        "properties": {
            "value1": 1,
            "value2": "hello world"
        }
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
await crs.call("object", "set", {
    target: "$context.value", 
    value: "hello world"}
)

await crs.call("object", "set", {
    target: "$context.object",
    properties: {
        value1: 1,
        value2: "hello world"
    }
})
{{< / highlight >}}

## set_on_path

For a given object, set the value/s on a given property path or paths.

**properties**

| property | description                      | required |
|:---------|:---------------------------------|:--------:|
| target   | object to set properties on      |   true   |
| path     | property path to set value on    |  false   |
| value    | value to set on path             |  false   |
| paths    | the properties and values to set |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "object",
    "action": "set_on_path",
    "args": {
        "target": "$context",
        "path": "obj/value",
        "value": "test"
    }
}
{{< / highlight >}}


## get

## get_on_path

## delete

## delete_on_path

## copy_on_path

## create

## assign

## clone

## json_clone

## assert