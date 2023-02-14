---
title: Introduction
type: docs
---

# Files to CRS Process API documentation
Files to crs process feature documentation.  
The systems as documented provide json schema and javascript execute features.  
The purpose is for streamline execution of intent on extendable applications.

## API

### Javascript vs JSON

There are two ways you can call the process api.  
Using a JSON schema the intent is to define an execution process.  
This allows non-technical people to define custom processes.  
These schemas can be saved on the server and executed on request.

Processes are build up using process steps.  
Steps represent intended action to take.  
Since steps need to follow up on each other, you will need to define what the next step is.  
This is done by setting the "next_step" property on the [step](#step)

Calling functions from JavaScript.  
We want the ability to call intent from javascript because it provides us with continuity.
The code that gets executed during a schema process is the same as the developer will use to execute the same intent.

The api objects are located on globalThis as crs.

Each feature is defined as a system on the intent property.  
It is called the intent as, "this is what I intend to do".  
The feature has a number of functions you can call as part of that feature.  
The functions be relevant to the context of the system.

crs-process-api is extendable by adding new functions to existing systems and, you can also [create your own](/docs/create).

{{< highlight js >}}
crs.intent.system.action(step, context, process, item);
{{< / highlight >}}

{{< hint danger >}}
**calling intent directly**  
Though you can it is not recommended that you run the intent directly.
Instead, use the **crs.call** function.
{{< /hint >}}

{{< highlight js >}}
crs.call("system_name", "function_name", args, context, process, item)
{{< / highlight >}}

All functions on a system has four parameters.

1. step
2. context
3. process
4. item

It is important to note that you only have to define the context, process and item if you are calling this from javascript.
If you are executing your process from a json schema file, you will only define the step.

### step
The step is an object that defines what to do.  
You can see the [schema example](/docs/example/#step-parts) for more detail.

### context
The context is an object that defines the context object for the process.    
This is referenced using the "$context" prefix.

### process
The process is the master object that defines the process to execute.    
This is referenced using the "$process" prefix.

### item
When you are using a loop, item is the current reference object in the loop.  
This is referenced using the "$item" prefix.

Enjoy process api