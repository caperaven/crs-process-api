# Random

Create random numbers using either `integer` or `float` functions.
Though you can call this from both schema and code, it is mostly used from code.
Both functions you can provide a standard target path in the args so you can call it from schema if you need.

**json**

{{< highlight js >}}
"step": {
    "type": "random",
    "action": "integer",
    "args": {
        "target": "$context.value"
    }
}
{{< / highlight >}}

**js**
{{< highlight js >}}
const value = crs.call("random", "integer");
{{< / highlight >}}


