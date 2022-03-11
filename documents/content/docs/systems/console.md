# Console

Console logging is a very useful way to debug processes.  
The main goal here to provide a debugging tool for schema processes.  

{{< hint danger >}}
You should not have console actions as part of deployed code.  
Be it JavaScript or schema.
{{< /hint >}}

Since this is intended for schemas we will not show a JavaScript equivalent.  
All the actions also have the same parameters.

| property | description | required |
| :------- | :---------- | :--------: |
| message  | single string message to console | false |
| messages | an array of messages to console  | false |

You must have either a message or messages property on args.

## Actions

1. [log](#log)
2. [error](#error)
3. [warn](#warn)
4. [table](#table)

## log
This is the equivalent of `console.log` in JavaScript.

{{< highlight js >}}
"step": {
    "type": "console",
    "action": "log",
    "args": {
        "message": "Hello World"
    }
}
{{< / highlight >}}

## error
This is the equivalent of `console.error` in JavaScript.

{{< highlight js >}}
"step": {
    "type": "console",
    "action": "error",
    "args": {
        "messages": ["Error 1", "Error 2"]
    }
}
{{< / highlight >}}

## warn
This is the equivalent of `console.warn` in JavaScript.

{{< highlight js >}}
"step": {
    "type": "console",
    "action": "warn",
    "args": {
        "message": "$context.be_warned"
    }
}
{{< / highlight >}}

## table
This is the equivalent of `console.table` in JavaScript.

{{< highlight js >}}
"step": {
    "type": "console",
    "action": "table",
    "args": {
        "message": "$context.records"
    }
}
{{< / highlight >}}
