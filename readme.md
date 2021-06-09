# CRS Process API

## Introduction

This library provides a basis to develop process driven application where users and developers use the same API to define features.  

The goals are: 

1. Extendable data driven api
2. Allow defining and executing processes using code
3. Allow defining and executing processes using json

This allows application users to define processes for your system using json and execute them at will.

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

1. @context - context object passed to the process
1. @process - process object passed to the system
1. @item - item object passed to the system

@item is used when looping through an array and performing actions on the array item.

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
    target: "@context.property1"
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
                target: "@process.data.value"    
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
                target: "@process.result"
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
