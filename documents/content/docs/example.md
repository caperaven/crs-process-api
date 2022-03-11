# JSON schema processes example

{{< highlight js >}}

{
    "id": "my_schema_id",

    "process1": {
        "parameters_def": {
            "bId"    : { type: "number", required: true },
            "taskId" : { type: "string", required: true },
        },
        "data": {
            "count": 10
        },
        "steps": {
            "start": {
                "type": "math",
                "action": "add",
                "args": {
                    "value1": "$data.count",
                    "value2": 20,
                    "target": "$data.count"
                },
                "binding_before": {
                    "currentStep": "adding values"
                },
                "next_step": "print"
            },
            "print": {
                "type": "console",
                "action": "log",
                "args": {
                    "message": "$data.count"
                }
                "binding_before": {
                    "currentStep": "logging values"
                },
            }
        }
    }
}

{{< /highlight>}}

## Schema Parts

A schema can have more than one process.  
The schema should have an id property that uniquely identifies the schema.  
When you call processes from other processes this id is used as a reference on where to look for the process you defined.

All other properties on the schema are processes where the property name is the schema name.  
In the above example we have a schema with the name "process1"

## Process Parts

The purpose of this example is not to be exhaustive but an overview of the core parts.  
See the system documentation for details on particular steps.  
Some steps my differ slightly from this example, but the fast majority follows the same pattern.

### parameters_def

Optional property set if you want to pass data onto a process.  
This is done when the execution of the process requires additional, external information.  
"parameters_def" defines what the parameters object on the process will contain.  
To access the parameter values, use the "$parameters" [prefix](/docs/prefixes/).

### data

Optional property where you can store data during the execution of the process.
To access the parameter values, use the "$data" [prefix](/docs/prefixes/).

### steps

Every process must have a "steps" property.  
This object must also have a "start" property.  
When a process is executed it always executes "start" first.  
Each property on the "steps" object defines a process step.  
The property name defines the step name.  
Use the step name in the "next_step", "pass_step" and "fail_step" properties.  
See [the conditions system](/docs/systems/condition) for details on the "pass_step" and "fail_step" usage.

### step parts

#### type

This is a required property.
Type defines the intent type you want to execute.
This could be array functions, data actions, anything on the `crs.intent` object.  
In the start step we want to use the "math" intent actions.  
In the log step we use the "console" intent actions.

#### action

This is mostly required but on special cases not required.
The action property defines the function on the intent that you want to execute.  
In the start step we want to call the "add" function and in the console step we want to call the "log" function.
The action property is on most intent systems but not all.  
[Action](/docs/systems/actions) and [condition](/docs/systems/condition) for example do not have intent actions, so the action property is omitted.

#### args

This is a required property.
The args object defines the parameters used by intent actions to execute the intent.  
The properties will differ from intent to intent but, there are a number of standard ones.  
When creating new systems it is important to retain the standard names for consistency purposes.

1. source: the origin of data to use
2. target: the destination where the result must be copied too

#### binding_after

This is an optional property.
[crs-process-api](https://github.com/caperaven/crs-process-api) uses [crs-binding](https://github.com/caperaven/crs-binding) under the hood and allows binding access as part of your process execution.  
This is often used to:

1. Update UI
2. Get data from binding contexts
3. Set data on binding contexts

`binding_after` is used for setting properties on the binding context.  
For this to work you must have the "bId" parameter defined on the process.  
See the `parameter_def` property for details.

This binding operation happens after the step has executed.

#### binding_before

This is the same as `binding_after` except, it executes before the step is run.

#### next_step

This defines the next step on the same process to execute.  
If no `next_step` is defined the process will end at the end of the current step.