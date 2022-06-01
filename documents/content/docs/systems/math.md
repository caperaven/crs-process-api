# Math

This allows you to run math operations.

There are a number of standard functions that process two values.

1. add
2. subtract
3. multiply
4. divide

In javascript you should just the normal math functions.  
This module is aimed specifically to do math operations as part of a schema process.  

Each of the above operations has the following properties.

| property | description              | required |
|:---------|:-------------------------| :--------: |
| value1   | number                   | true |
| value2   | number                   | true |
| target   | where to copy the result | true |

For example

{{< highlight js >}}
step: {
    type: "math",
    action: "subtract",
    args: {
        value1: 10,
        value2: 11,
        target: "$process.result"
    }
}
{{< / highlight >}}

You can also execute any function on the javascript Math object.  
For this you need to define two properties.

| property | description                              | required |
|:---------|:-----------------------------------------| :--------: |
| value    | array of values to send to math function | true |
| target   | where to copy the result                 | true |

The value argument will differ from function to function.  
The "Math.sin" function only has one parameter for the angle.

{{< highlight js >}}
step: {
    type: "math",
    action: "sin",
    args: {
        value: [90],
        target: "$process.result"
    }
}
{{< / highlight >}}

"Math.max" on the other hand has two parameters, one for the min and another for max value.

{{< highlight js >}}
step: {
    type: "math",
    action: "max",
    args: {
        value: ["$process.data.max", 90],
        target: "$process.data.max"
    }
}
{{< / highlight >}}
