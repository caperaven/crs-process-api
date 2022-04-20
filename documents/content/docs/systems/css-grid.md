# CSS Grid

CSS grids is often used for dynamic layout of UI parts.  
This feature allows both schema and JavaScript execution of intent, affecting the CSS grid structure of an HTMLElement.

{{< hint danger >}}
**Not loaded by default**  
Managing css grid layout is a specialist job and not something commonly used everywhere.  
Because of that it is not loaded as part of the default stack.  
If you want this feature, all you need to do is import the `css-grid-actions.js` file.  
This will auto register the intent as `crs.intent.cssgrid`
{{< / hint >}}

{{< hint warning >}}
**Display**  
The element must have a display of "grid".  
If you are creating the element dynamically or just want to ensure it is a css grid, use the init function at the start of your process.
{{< /hint >}}

{{< hint info >}}
Before we continue please **note**:  
The element property for these calls can either refer to:

1. The actual HTMLElement from the dom
2. The query string used by `document.querySelector` to get that element.

From the javascript side you could pass on either.  
From the schema side it is most likely the query string.
{{< / hint >}}

## Actions

1. [init](#init)
2. [set_columns](#set_columns)
3. [set_rows](#set_rows)
4. [add_columns](#add_columns)
5. [remove_columns](#remove_columns)
6. [set_column_width](#set_column_width)
7. [add_rows](#add_rows)
8. [remove_rows](#remove_rows)
9. [set_row_height](#set_row_height)
10. [set_regions](#set_regions)
11. [column_count](#column_count)
12. [row_count](#row_count)

## init
Ensure that the given element has the css display of "grid"

| property | description | required |
| :------- | :---------- | :--------: |
| element  | target element | true |

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "init",
    "args"   : {
        "element": "#grid"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("cssgrid", "init", {
    element: this.gridElement
});
{{< / highlight >}}

## set_columns

This sets the [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) css property.  
If you had existing values on that property it will be overwritten.  

| property | description | required |
| :------- | :---------- | :--------: |
| element  | target element | true |
| columns  | string value used to set the css columns | true |

**columns example**
{{< highlight js >}}
"1fr 1fr 3rem"
{{< / highlight >}}

**json**

{{< highlight js >}}
"step"   : {
    "type"   : "cssgrid",
    "action" : "set_columns",
    "args"   : {
        "element" : "#grid"
        "columns" : "1fr 1fr 1fr"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("cssgrid", "set_columns", {
    element: this.gridElement,
    columns: "1fr 1fr 1fr"
});
{{< / highlight >}}

## set_rows

This sets the [grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows) css property.  
If you had existing values on that property it will be overwritten.  

| property | description | required |
| :------- | :---------- | :--------: |
| element  | target element | true |
| rows     | string value used to set the css rows | true |

**rows example**
{{< highlight js >}}
"1fr 1fr 3rem"
{{< / highlight >}}

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "set_rows",
    "args"   : {
        "element" : "#grid"
        "rows"    : "1fr 1fr 1fr"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("cssgrid", "set_rows", {
    element : this.gridElement,
    rows    : "repeat(4, max-content)"
});
{{< / highlight >}}

## add_columns

This function adds columns to existing columns. 

| property | description | required | default value |
| :------- | :---------- | :--------: |:--------: |
| element  | target element | true |
| width    | single width value or array of values | true |
| position | "front" or "end" or index value | false | "end" |

If width is an array, a column will be added for each width in the array.  
The width values must be css width values.

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "add_columns",
    "args"   : {
        "element"  : "#grid"
        "width"    : "20px",
        "position" : "front"
    }
}
{{< / highlight >}}

Other width examples

{{< highlight js >}}
"width": ["20px", "5rem", "3%", "1fr"]
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("cssgrid", "add_columns", {
    element  : this.gridElement,
    width    : "2rem",
    position : 2
});
{{< / highlight >}}

## remove_columns

Remove a number of columns based on the position defined and the number of columns to remove.  

| property | description | required | default value |
| :------- | :---------- | :--------: |:--------: |
| element  | target element | true |
| position | "front" or "end" or index value | false | "end" |
| count | the number of columns to remove | false | 1 |

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "remove_columns",
    "args"   : {
        "element"  : "#grid"
        "position" : "end",
        "count"    : 2
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("cssgrid", "remove_columns", {
    element  : this.gridElement,
    position : 2,
    count    : 2
});
{{< / highlight >}}

## set_column_width

Set a column's width.  
For this feature you need to provide the index of the column to resizes.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | target element | true |
| position | index value | true
| width    | the width to set the column too | true | 

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "set_column_width",
    "args"   : {
        "element"  : "#grid"
        "width"    : "2rem",
        "position" : 2
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("cssgrid", "set_column_width", {
    "element"  : "#grid"
    "width"    : "2rem",
    "position" : 2
});
{{< / highlight >}}

## add_rows

Add rows works exactly the same as [add_columns](#add_columns).  
The only difference is that instead of using `width` you now set the `height`.
The step action to use is "add_rows".

## remove_rows

This works the same as [remove_columns](#remove_columns).

## set_row_height

This works the same as [set_column_width](#set_column_width).  
Replace with `width` property with `height`

## set_regions

On a css grid element set the [areas](https://www.w3schools.com/cssref/pr_grid-area.asp) for the grid.  
Areas are marked using the following object structure:

{{< highlight js >}}
{
start: {col: 0, row: 0},
end  : {col: 1, row: 0},
name : "area_name"
}
{{< / highlight >}}


| property  | description                         | required | defaults |
|:----------|:------------------------------------|:--------:| :------- |
| element   | target element                      |   true   |          |
| areas     | array of area objects               |   true   |          |
| auto_fill | create and add divs to each reagion |  false   |  false   |

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "set_regions",
    "args"   : {
        "element" : "#grid",
        "areas": [
            { start: {col: 0, row: 0}, end: {col: 1, row: 1}, name: "area1" },
            { start: {col: 2, row: 0}, end: {col: 2, row: 1}, name: "area2" },
            { start: {col: 0, row: 2}, end: {col: 2, row: 2}, name: "area3" }
        ]       
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const count = crs.call("cssgrid", "set_regions", {
    "element" : "#grid",
    "areas": [
        { start: {col: 0, row: 0}, end: {col: 1, row: 1}, name: "area1" },
        { start: {col: 2, row: 0}, end: {col: 2, row: 1}, name: "area2" },
        { start: {col: 0, row: 2}, end: {col: 2, row: 2}, name: "area3" }
    ]
});
{{< / highlight >}}


## column_count

For the given element, return how many columns it has.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | target element | true |

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "column_count",
    "args"   : {
        "element" : "#grid"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const count = crs.call("cssgrid", "column_count", {
    "element" : "#grid"
});
{{< / highlight >}}

## row_count

For the given element, return how many rows it has.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | target element | true |

**json**

{{< highlight js >}}
"step": {
    "type"   : "cssgrid",
    "action" : "row_count",
    "args"   : {
        "element" : "#grid"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const count = crs.call("cssgrid", "row_count", {
    "element" : "#grid"
});
{{< / highlight >}}

