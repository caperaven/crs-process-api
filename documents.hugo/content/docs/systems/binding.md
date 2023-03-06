# Binding

This allows you to work more directly with [crs-binding](https://github.com/caperaven/crs-binding) features.  
We are not going to explain binding features here, you can read the [binding documentation](https://github.com/caperaven/crs-binding-documentation) for more about that.  

## Actions

1. [create_context](#create_context)
2. [free_context](#free_context)
3. [get_property](#get_property)
4. [set_property](#set_property)
5. [get_data](#get_data)
6. [set_errors](#set_errors)

## create_context
Binding contexts are used when you have UI in your process.  
If you don't have an existing context to lean on you can create one.  
This means that when you set a template, you can pass the context on.  
This is generally referred to as the `bId` and, you can pass this to other processes using the process parameters.
By using this function the resulting `bId` is automatically added to the `process.parameters.bId` property.
From that point forward you can refer to that value using the `$bId` [prefix](/docs/prefixes/).

| property  | description | required | defaults too |
| :-------  | :---------- | :------: | :----------:
| context_id | name of the context to be used | false | process_context |

**json**

{{< highlight js >}}
"step": {
    "type": "binding",
    "action": "create_context",
    "args": {
        context_id: "my_context"
    }
}
{{< / highlight >}}

{{< hint danger >}}
**javascript**  
This is not really recommended.  
If you really need to use this, call the binding engine directly.  
{{< /hint >}}

## free_context

This removes the binding context created using [create_context](#create_context).  

{{< hint warning >}}
This function assumes that the process has a parameter called `bId`.
{{< /hint >}}

**json**

{{< highlight js >}}
"step": {
    "type"   : "binding",
    "action" : "free_context"
}
{{< / highlight >}}

{{< hint danger >}}
**javascript**  
Use binding engine directly
{{< /hint >}}

## get_property

Get the property value for a given property on the current process binding context.

{{< hint warning >}}
This function assumes that the process has a parameter called `bId`.
{{< /hint >}}

| property  | description | required | 
| :-------  | :---------- | :------: | 
| property  | property name to get the value from | true | 
| target    | where the result is copied too | schema |

{{< highlight js >}}
"step": {
    "type"   : "binding",
    "action" : "get_property",
    "args"   : {
        "property": "code",
        "target": "$context.code"
    }
}
{{< / highlight >}}

{{< hint danger >}}
**javascript**  
Use binding engine directly
{{< /hint >}}

## set_property

Set the property value for a given property on the current process binding context.

{{< hint warning >}}
This function assumes that the process has a parameter called `bId`.
{{< /hint >}}

| property  | description | required | 
| :-------  | :---------- | :------: | 
| property  | property name to set the value on | true | 
| value     | the value to set on the property | true |

{{< highlight js >}}
"step": {
    "type"   : "binding",
    "action" : "set_property",
    "args"   : {
        "property": "code",
        "value"   : "$context.code"
    }
}
{{< / highlight >}}

{{< hint danger >}}
**javascript**  
Use binding engine directly
{{< /hint >}}

## get_data

Get the binding data object for the current process binding context.

{{< hint warning >}}
This function assumes that the process has a parameter called `bId`.
{{< /hint >}}

| property  | description | required | 
| :-------  | :---------- | :------: | 
| target    | where the result is copied too | schema |

{{< highlight js >}}
"step": {
    "type"   : "binding",
    "action" : "get_data",
    "args"   : {
        "target": "$context.data"
    }
}
{{< / highlight >}}

{{< hint danger >}}
**javascript**  
Use binding engine directly
{{< /hint >}}

## set_errors

Save a list of errors to the current binding context using either a defined store name or "errors".  
This is mostly used when you have UI that you want to bind errors too.  

{{< hint warning >}}
This function assumes that the process has a parameter called `bId`.
{{< /hint >}}

| property  | description | required | default value |
| :-------  | :---------- | :------: | :------------ |
| store     | property name that will contain errors on the current binding context | false | "errors" |
| source    | an array of error message strings | true |


{{< highlight js >}}
"step": {
    "type"   : "binding",
    "action" : "set_errors",
    "args"   : {
        "target": "$context.data"
    }
}
{{< / highlight >}}

{{< hint danger >}}
**javascript**  
Use binding engine directly
{{< /hint >}}