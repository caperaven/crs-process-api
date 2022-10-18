# Fixed Layout

Fixed layout sets a element as `position: fixed` and displays it relative to a target element or point.  
You can position the element:

1. top
2. bottom
3. left
4. right

You can also anchor the element so that the sides of the target and moved element matches.  
You can anchor the elements sides on:

1. left
2. right
3. bottom
4. top
5. middle

The allowed anchor depends on the location.  
If the location is `bottom` or `top` you can anchor the elements on the `left` or `right`.  
In the same way, if the location is `left` or `right` you can anchor it at the `top` or `bottom`.
The exception to this rule is middle.  
Regardless of the location and can lay it out so that the middle of the source and the middle of that target match.

{{< hint info >}}
Note: you must set either the target or the point parameter.
{{< / hint >}}

This has a single function, `set`.

| property | description                                                   | required |
|:---------|:--------------------------------------------------------------|:--------:|
| element  | the element to move                                           |   true   |
| target   | the target element to place it around                         |  false   |
| point    | {x: 0, y: 0} object based on screen pixels                    |  false   |
| at       | where to place the object: "top", "bottom", "left" or "right" |   true   |
| anchor  | the sides anchor values, same as at values                    |   true   |
| margin  | how many piexels to place beween the move element and target  |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "fixed_layout",
    "action": "set",
    "args": {
        "element": "#move",
        "target": "#target",
        "at": "bottom",
        "anchor": "left",
        "margin": 2
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("fixed_layout", "set", {
    "element": "#move",
    "target": "#target",
    "at": "bottom",
    "anchor": "left",
    "margin": 2
})
{{< / highlight >}}

