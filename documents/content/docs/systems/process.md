# Process

This allows you to call processes as a step within a different process.  
Sub processes are mainly a schema feature.

The step has some basic requirements

1. action name of the process to execute
2. schema name that the process is in

{{< highlight js >}}
step: {
    type: "process",
    action: "create_ui",
    args: {
        schema: "dom-example",
        parameters: {
            "key": "value"
        }
    },
    next_step: "set_attributes"
}
{{< / highlight >}}

Processes can have input to those processes called parameters.  
You can pass the parameters to the process you are calling by setting a parameters' property on the args object.