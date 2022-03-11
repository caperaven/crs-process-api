# Actions System

This allows you to execute functions on either the context, process or item.  
Most often it is used to execute a function on the context or a path based on the context.    
This is one of those example where it makes more sense from a schema perspective.  

| property  | description | required |
| :-------  | :---------- | :------: |
| parameters | array of values passed in as parameters | false |

**json**

{{< highlight js >}}
"step": {
    "type": "action",
    "action": "$context.log",
    "args": {
        parameters: ["hello world"]
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("action", "$context.log", {
    parameters: ["hello world"]
}, context)
{{< / highlight >}}

