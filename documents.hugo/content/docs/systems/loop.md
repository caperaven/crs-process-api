# Loop

Looping allows you to implement a for loop through an array.  
There are a number of exceptions to how the normal system works.

The loop step is defined by setting the type to "loop" but does not have any action property.

There are two required arguments for the loop action.

1. source - the array to loop through
2. steps - the steps to execute on each record

***basic loop structure***
{{< highlight js >}}
{
    "type": "loop",
    "args": {
        "source": "$context.records",
        "steps": {
            // ... steps to execute on each record
        }
    }
}
{{< / highlight >}}

***NB:*** during the loop, the current record is defined as "$item".  
In a loop action, it's steps are executed in sequence of how it is defined.

Consider the following array structure:

{{< highlight js >}}
context.records = [
    { value: 10 },
    { value: 20 },
    { value: 30 }
]
{{< / highlight >}}

When you want to access the property "value" on "$item" you would access it using the path expression "```$item.value```"

## Loop example

Loop through an array of records.  
Get the value of each item.  
If the value is less or equal to 20 add it to the low_items array.  
If it is greater, add it to the high_items array.

{{< highlight js >}}
{
    "result": {
        low_items: [],
        high_items: []
    },
    "steps": {
        "start": {
            "type": "loop",
            "args": {
                "source": "$context.records",
                "steps": {
                    "small_check": {
                        "type": "condition",
                        "args": {
                            "condition": "$item.value <= 20",
                            "pass_step": {
                                "type": "array",
                                "action": "add",
                                "args": {
                                    "target": "$process.result.low_items",
                                    "value": "$item"
                                }
                            }
                        }
                    },

                    "large_check": {
                        "type": "condition",
                        "args": {
                            "condition": "$item.value > 20",
                            "pass_step": {
                                "type": "array",
                                "action": "add",
                                "args": {
                                    "target": "$process.result.high_items",
                                    "value": "$item"
                                }
                            }
                        }
                    }
                }
            }
            next_step: "done"
        },

        "done": {
            "type": "console",
            "action": "log",
            "args": {
                messages: ["$process.result.low_items", "$process.result.high_items"]
            }
        }
    }
}
{{< / highlight >}}


"small_check" will execute first because it was defined first.  
"large_check" will be executed after that.  
At the end of the process we log the two different arrays.
