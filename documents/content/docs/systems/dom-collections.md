# DOM Collections
DOM collections is very useful for filtering and toggle selection of elements.

## Actions
1. [filter_children](#filter_children)
2. [toggle_selection](#toggle_selection)

## filter_children

Perform a dom filter a given element's children.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| filter   | string to filter on | true |

The children must have a data-tags attribute.  
The data-tags attribute will be used for the text comparison.  
If the tags are not a match the element will be set as hidden.

To clear the filter set the filter string to "".

**json**

{{< highlight js >}}
"step": {
"type": "dom",
"action": "filter_children",
"args": {
"element" : "#element",
"filter"  : "$binding.filter"
}
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "filter_children", {
"element": "#element",
"filter" : ""
});
{{< / highlight >}}

## toggle_selection

Perform a element selection (sets aria-selected = true) given a selected target element.

| property   | description | required |
|:-----------|:------------| :--------: |
| target     | element     | true |

The element passed can be a selected target (e.g. event.target)

**json**
{{< highlight js >}}
"step": {
    "type" : "dom",
    "action" : "toggle_selection",
    "args" : {
        "target" : "event.target"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "toggle_selection", {
"target" : "event.target",
});
{{< / highlight >}}