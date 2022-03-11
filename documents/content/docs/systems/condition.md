# Condition

This allows you to run if statements in the process.  
From a javascript perspective you should not be using this.  
Since this is meant for schema driven processes, all the examples will be json only.  
Conditions is one of those special cases again where it does not have functions.

## Expressions

The first thing you need to understand is that we try and follow a javascript syntax for expressions.  
The expressions result in a boolean true or false.  
If the result of the expression is true the [pass_step](#pass_step) will be executed.  
If the expression is false the [fail_step](#fail_step) will be executed.

All the standard [prefixes](/docs/prefixes/) still apply.

**simple example**
{{< highlight js >}}
$context.isValid == true && $context.value > 10
{{< / highlight >}}

**more complex example**
{{< highlight js >}}
($item.code == "C") || ($context.isValid == true && $item.code == "A")
{{< / highlight >}}


## pass_step

This property on the step defines what must execute if the expression passes.
This is an optional property.  
If the expression passes but no pass_step is defined, the process will stop.

The pass_step can either be the name of the next step to execute 

{{< highlight js >}}
{
    ...
    "next_step": "do_something"
}
{{< / highlight >}}

or, the actual step object.

{{< highlight js >}}
{
    ...
    "next_step": {
        type: "console",
        action: "log",
        args: {
            message: "success!"
        }
    }
}
{{< / highlight >}}


## fail_step

This property on the step defines what must execute if the expression fails.
This is an optional property. If the expression fails but no fail_step is defined, the process will stop.

{{< hint info >}}
Like the pass_step, the fail_step can either be the name of the next step or a step object.
{{< /hint >}}

## example
{{< highlight js >}}
{
    type: "condition",
    args: {
        condition: "$context.records.length > 0"
    },
    pass_step: "print_records",
    fail_step: {
        type: "console",
        action: "error",
        args: {
            message: "No records to print!"
        }
    }
}
{{< / highlight >}}