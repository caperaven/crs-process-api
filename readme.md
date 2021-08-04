# CRS Process API

## Introduction

This library provides a basis to develop process driven application where users and developers use the same API to define features.  
It has a dependency on [crs-binding](https://github.com/caperaven/crs-binding).

The goals are: 

1. Extendable data driven api
2. Allow defining and executing processes using code
3. Allow defining and executing processes using json

This allows application users to define processes for your system using json and execute them at will.    
A process is a sequence of steps that follow up on each other.    
The system does not assume sequential execution.  

Using the properties:

1. next_step
1. pass_step
1. fail_step

you indicate what the next step must be.

With this system you can perform simple single step actions or scenarios like this.

1. Get a list of records from the server
1. Loop through those records and perform a check on each record.
1. If the condition passes copy that record to an array (result array)
1. Once you have looped through the records save the result array to file

The idea behind the process api is part of the [dynamic application](https://caperaven.github.io/pages/documents/dynamic-applications.html) goal.

## Executing a process
There are two ways to run a process.

1. Run the entire process
1. Run a particular process step

<strong>Running the entire process</strong>
```js
const process = {...};
await crs.process.run(context, process);
```
<strong>Running a process step</strong>
```js
const process = {...};
await crs.process.runStep(step, context, process);
```

See the step section for more detail on steps.

## Target keywords

1. $context - context object passed to the process
1. $process - process object passed to the system
1. $item - item object passed to the system

$item is used when looping through an array and performing actions on the array item.

## Step
Each process step has the same basic structure.

```js
{
    type: "console", 
    action: "log", 
    args: {
        ... details
    }
}
```

Each action has different args that defines the details for that step to execute.  
Some process steps need to copy the value of the step to a variable.  
The property "target" in args define where that value must be copied too.

Use the target keywords to define the location as required.
```js
...
args: {
    target: "$context.property1"
}
```

A convention you can use on the process is to have a "data" property where you can save results to during the process execution.

```js
const process = {
    data: {},
    steps: {
        start: { next_step: "doSomething" },
        doSomething: {
            ...
            args: {
                target: "$process.data.value"    
            }           
        }
    }
}
```
## Default process structure

A process is just an object literal.   
Each process has a "steps" property that is also an object literal.  
You can decorate the process with additional properties such as:

1. version
1. description ...

Each process has a required step called "start".  
Start only has one property called "next_step".  
The process can't assume what step to start with so "next_step" defines what that starting point is.

```js
const process = {
    steps: {
        start: {
            next_step: "subtract"
        },
        subtract: {
            type: "math",
            action: "subtract",
            args: {
                value1: 10,
                value2: 11,
                target: "$process.result"
            }
        }
    }
}
```

## Common intent

The process engine ships with some basic intent.    
Intent is defined on `globalThis.crs.intent`.  

Default intent are:

1. array
1. condition
1. console
1. loop
1. object
1. action
1. math
1. process
1. module

Each of these has the same functional entry point called "perform".  
They all have the same parameters.  

1. step
1. context
1. process
1. item

## Extending an intent
For this section lets say we want to add a function to the array intent called "sum".

```js
crs.intent.array.sum = (step, context, process, item) => {
    // perform action
}
```

There are two helper functions that you need to take note of.

1. getValue
1. setValue

<strong>getting a value</strong>
```js
const value = await crs.process.getValue(step.args.source, context, process, item);
```
<strong>setting a value</strong>
This is particularly important if you want your step to support writing results to a target.
```js
await crs.process.setValue(step.args.target, result, context, process, item);
```

## Adding your own process action support
 
```js
export class MyActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }
    
    static async customAction(step, context, process, item) {
        // you can access the args of the step on the step parameter
    }
}

crs.intent.myActions = MyActions;
```

The step can be access as:

```js
stepName: {
    type: "myAction",
    action: "customAction",
    args: {
        ...
    }    
}
```

## Action Intent

```js
crs.intent.action
```

This intent allows you to execute a function on either

1. $context
1. $process
1. $item

```js
const step = {
    type: "action",
    action: "$context.log",
    args: {
        parameters: ["Hello World"]
    }
}
```

The target args property will copy the function results to the specified location.  
Executing the action will also return you the value of the function you called.

## Array Intent

```js
crs.intent.array
```

This intent provides simple array access. 

The default functions are:

1. add - add a value or object to array
1. field_to_csv - using an array of objects, export a csv text for a given property on the stored objects.

<strong>add step</strong>
```js
const step = {
    type: "array",
    action: "add", 
    args: {
        target: "$context.values", 
        value: "Hello World"
    }
}
```

You can also use this directly.

```js
const values = [];
await crs.intent.array.perform({action: "add", args: {target: values, value: "Hello World"}});
```

<strong>field_to_csv step</strong>
```js
const step = {
    type: "array",
    action: "field_to_csv",
    args: {
        source: "$context.values",  // what array to use 
        target: "$context.result",  // where to copy the result
        delimiter: ";",             // what delimeter to use
        field: "value"              // what is the property name to use for the values
    }
}
```

## Condition Intent

```js
crs.intent.condition
```

This intent allows you to perform an "if" statement.  
The condition will either pass or fail on you need to indicate what step to take should the condition pass or fail.  
To do this you need to define the next step in either:

1. pass_step - perform this step if the condition passes
1. fail_step - perform this step if the condition fails

Pass and fail steps need to point to root level objects or a process step object
The step for this does not require an action property.

```js
const step = {
    type: "condition",
    args: {
        condition: "$context.value === 10",
    },
    pass_step: "doSomething",
    fail_step: "end"
}
```

The condition is a standard javascript expression.

## Console Intent

```js
crs.intent.console
```

This intent exposes basic browser console features.  
In a standard process I don't think it adds much value but when debugging a process can come in handy.

The actions exposed on this intent are:

1. log  - console.log
1. error - console.error
1. warn - console.warn
1. table - console.table

```js
const step = {
    type: "console",
    action: "log",              // or eror, warn, table
    args: {
        message: "Hello World"  // or $context.value / $process.value / $item.value
    }
}
```

## Loop Intent

```js
crs.intent.loop
```

This intent allows you to loop through an array and works a little different to the other steps.

```js
const step = {
    type: "loop",
    args: {
        source: "$context.records",
        steps: {
            copy_to_array: {
                type: "array",
                action: "add",
                args: {
                    target: "$context.result",
                    value: "$item"
                }
            }
        }
    }
}
```
The above example loops through an array found at "$context.records".
For each item we copy that array item "$item" to an array at "$context.result".

As you can see in the above example the loop args has a steps property that define what steps to take.
These steps execute top down so if you have more than one step, it will execute step 1 then 2 then 3 ...
It is at this point where the "$item" comes into play.

If you look at a standard intent entry point:

As part of the loop args you can also define a target property.  
When you do that, it will save the current item to that property path.  
You can then use it later as a reference for other operations.  
For example: 

```js
const context = {
    records: [{value: 1}, {value: 2}, {value: 3}],
    result: []
}

const step = {
    type: "loop",
    args: {
        source: "$context.records",
        target: "$context.current",
        steps: {
            copy: {
                type: "array",
                action: "add",
                args: {
                    target: "$context.result",
                    value: "$context.current.value"
                }
            }
        }
    }
};
```

```js
static async perform(step, context, process, item)
```

You will notice that three parameters are always passed for access.

1. context
1. process
1. item

In most all cases "item" is not defined.  
When executing a process as part of a loop the current array item is the item accessed through "$item".

## Math Intent

```js
crs.intent.math
```

This intent allows for math operations.
It exposes basic arithmetic functions but also access to the Math system object for more complex functions.

Basic arithmetic functions are:

1. add
1. subtract
1. multiply
1. divide

```js
const step = {
    type: "math",
    action: "multiply",
    args: {
        value1: 10,
        value2: 1,
        target: "$process.result"
    }
}
```

When dealing with add, subract, multiply or divide your args needs two properties.

1. value1
1. value2

When using the Math object you need something more dynamic because different functions require different arguments.  
For these scenarios you only have a value property of type array.

```js
const step = {
    type: "math",
    action: "max",
    args: {
        value: ["$process.data.max", 90],
        target: "$process.data.max"
    },
    next_step: "do_something"
}
```

The above example can also be used in a loop to find the max value of a collection.

## Module Intent

```js
crs.intent.module
```

If you are using [crs-modules](https://github.com/caperaven/crs-modules) this intent allows you to execute operations exposed by crs-modules.

This intent only exposes three actions but does a little more.

1. call - call an exported or default function on a defined module
1. create_class - create an instance of a defined or default exposed class
1. get_constant - get a constant value defined on that module.

In terms of crs-modules a module is just a javascript file that is registered with a particular key on the module system.
Using crs-modules in tandom with crs-process-api is a great way to dynamically extend the api capability.  
Since modules only load the files when and if you use it, it is also relatively light weight.

<strong>call function step</strong>
```js
const step = {
    type: "module",
    action: "call",
    args: {
        module: "utils",
        fnName: "updateMessage",
        parameters: "Hello World",
        target: "$context.result",
        context: "$context"
    }
}
```

The context property in args here defines what the "this" object in the function call will be.  
Under the hood it uses the `function.call` language feature using the context as the "this" object;

When the function is exported as the default the args parameters change a bit.

```js
args: {
    module: "default-function",
    default: true,
    target: "$context.result",
    context: "$context"
}
```

Instead of the fnName property, you just need to define that it is the default by setting the "default" property to true.
The same concept applies when creating a class.

<strong>create class step</strong>
```js
const step = {
    type: "module",
    action: "create_class",
    args: {
        module: "class",
        class: "MyClass",
        target: "$context.instance"
    }
}
```

```js
args: {
    module: "class",
    default: true,
    target: "$context.instance"
}
```

<strong>get constant step</strong>
```js
const step = {
    type: "module",
    action: "get_constant",
    args: {
        module: "utils",
        name: "GLOBAL_VALUE",
        target: "$context.instance"
    }
}
```

## Object intent

```js
crs.intent.object
```

The object intent exposes several utility functions to work with objects.

1. set - set a property on path with a defined value
1. get - get the value on a object path
1. create - create a object literal at a given path
1. assign - copy the properties from one object to another. uses Object.assign in the background
1. clone - create a copy of the object.

<strong>set step</strong>
```js
set_value: {
    type: "object",
    action: "set",
    args: {
        target: "$item.code",
        value: "$item.code.toUpperCase()"
    }
}
```

<strong>get step</strong>
```js
const step = {
    type: "object",
    action: "get",
    args: {
        source: "$context.source",
        target: "$context.result"
    }
}
```

<strong>create step</strong>
```js
const step = {
    type: "object",
    action: "clone",
    args: {
        source: "$context.source",
        target: "$context.result"
    }
}
```

<strong>clone step</strong>

```js
const step = {
    type: "object",
    action: "clone",
    args: {
        source: "$context.source",
        target: "$context.result",
        fields: ["code"]
    }
}
```

If you leave the "fields" property out it will clone the entire object.  
If you define the "fields" it will create a new object that contains only the fields you defined.

<strong>assign step</strong>

```js
const step = {
    type: "object",
    action: "assign",
    args: {
        source: "$context.source",
        target: "$context.result",
    }
};
```

## Process intent

```js
crs.intent.process
```

This intent allows for sub processes.   
In other words, running a different process as a step in the current process.  
This can go n levels deep.

```js
const step = {
    type: "process",
    action: "sub_process_name", // property name on the process schema object that you want to execute.
    args: {
        schema: "schema_registry_key", // id property on the process schema object. see below
        parameters: {
            value: 10
        },
        target: "$context.result"
    }
}
```

Take special note on parameters.  
You need a way to transfer values between processes.  
Parameters is the way that is done.
The values defined in the above parameters object will be passed to the sub process as its parameters.

A process defines it's required input using a property called "parameters_def".  
parameters_def is also used to define what parameters are required and what default values are if the parameter is not provided.

Use the "target" args parameter to store the result of the sub process.

```js
const process = {
    parameters_def: {
        value1: {type: "number", required: true},
        value2: {type: "number", required: true, default: 0}
    },
    steps: {
        ...
    }
}
```

"parameters_def" is just a definition and not accessed directly in the process.  
Each process that has parameters can be accessed through the "parameters" property created at runtime.

```js
const step = {
    type: "math",
    action: "add",
    args: {
        value1: "$process.parameters.value1",
        value2: "$process.parameters.value2",
        target: "$process.result"
    },
}
```

A process's "result" must be set on the "result" property of the process object as can be seen above.

An important part of running sub processes is the `process schema registry`.

```js
crs.processSchemaRegistry
```

This object acts as a registry and aggregator of processes.  
A schema is a JSON object that contains one or more processes.

```js
export const processes = {
    id: "loop_sub",
    process1: {   // process called "process1"
        data: {}, // data object on the process for storing values
        steps: {} // steps of the process
    },
    process2: {   // process called "process2"
        data: {}, // data object on the process for storing values
        steps: {} // steps of the process
    }
}
```

Processes are object properties on the schema object.  
Each schema object must have a unique id property.
The id will be the name used to define what schema the process is on when executing a process step.

## SchemaRegistry

```js
crs.processSchemaRegistry
```

This only has two public functions:

1. add
1. remove

processSchemaRegistry stores process objects on a private object called _schemas.  
The id of the schema defines the property name on _schemas.

If you want to execute a process on the registry, you need to use event aggregation.

```js
const step = {
    action: "process1",
    args: {
        schema: "loop_sub"
    }  
}

await crsbinding.events.emitter.emit("run-process", {
    step: step,             // define what schema and process to run
    context: context,       // what object to use as $context
    process: process,       // what object to use as $process
    item: item,             // what object to use as $item
    parameters: parameters  // parameters to use in the process you are calling.
});
```

## Hooks
There are several hooks that you need to take note of.

1. fetch   - used to fetch profiles from remote locations when it is not registered on the processSchemaRegistry
1. onError - used to handle error messages from the process.

```js
crs.process.fetch = (step) => { return ... fetch code };
crs.process.onError = (error) => { console.error(error) };
```