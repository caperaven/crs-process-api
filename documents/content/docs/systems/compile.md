# Compile

Compile functions to use as part of value evaluations.  
Based on expressions, create a function to use in process logic.  
All these functions will generate a function for you to use.  
You can define a `target` on the args if you want this function to be set on either the context, process or item.

## Actions
1. [if_value](#if_value)
2. [case_value](#case_value)

## if_value

This will generate a function that will perform an if or an if / else statement based on the expression provided
There is only one required property, `exp` that defines the if expression using standard ternary expressions.

**json**

{{< highlight js >}}
"step": {
    "type": "compile",
    "action": "if_value",
    "args": {
        "exp": "value == 10 ? true : false"
    }
}
{{< / highlight >}}

**javascript**
{{< highlight js >}}
await crs.call("compile", "if_value", {exp: "value == 10 ? true : false"});
{{< / highlight >}}

The else part of the ternary is optional, if you leave it out and the if expression does not pass it will return undefined.  
For example:  
`exp: "value == 10 ? true"`

## case_value

This will generate a function that will perform and "case" statement based on the expression.  
You can have one expression per case, but you can have multiple expressions, separated by a ",".
For example:
`"value < 10: 'yes', value < 20: 'ok', default: 'no'"`

Note that the default is always defined as the last item but is optional and can be left out if you require an undefined result if no expressions match.

{{< highlight js >}}
"step": {
    "type": "compile",
    "action": "case_value",
    "args": {
        "exp": "value < 10: 'yes', value < 20: 'ok', default: 'no'"
    }
}
{{< / highlight >}}

**javascript**
{{< highlight js >}}
await crs.call("compile", "case_value", {exp: "value < 10: 'yes', value < 20: 'ok', default: 'no'"});
{{< / highlight >}}

Note that the code that is generated is not an actual case statement, but early returning if statements.  
This gives is a lot more flexibility but allowing you to define more than just an if / else statement.