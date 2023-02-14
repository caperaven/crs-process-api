# Drag and Drop

This system allows for drag and drop operations based on a parent element.  
There are two main parts to it:

1. container element
2. options

The mouse down event is limited to the container element thought the drag operation is screen wide.
The important part is the options object.

All the details pertaining the drag and drop operations are defined in the options object.

## Options properties

1. drag
2. drop
3. autoScroll

## drag properties

1. placeholderType
2. clone

### placeholderType

This defines what should happen to the space that you start the drag operation on.  
It can have one of the following settings:

1. "none" - do nothing, leave it as it is
2. "standard" - leave a placeholder element instead of the original element.
3. "opacity" - set the original object as semi opaque.

### clone

Clone defines what object will be created for the drag and drop operation.  
By default it is the "element".  
If you want to create something other than the source, you need to set the clone to "template".

If clone is set to template, the drag element must have a `data-template` attribute.
This data-template attribute contains the id of the template to clone for the drag operation.

{{< highlight html >}}
<div class="card small" draggable="true" data-template="tplInput">None</div>
{{< / highlight >}}

## drop properties

1. action - "copy" or "move" the drag element
2. allowCallback - function to allow or deny drop operations
3. callback - notify after the drop has been made

### action

This defines that happens when you drop the element.
The values for this includes:

1. "copy"
2. "move"

the default is "move".

"move", moves the element from its current parent to the next.
"copy", creates a copy of the element at the new parent.

### callbacks

Both "allowCallback" and "callback" are functions.  
Both of them have two parameters.

1. dragElement
2. targetElement

"allowCallback" is called before the drop is made.
You can override if the drop is allowed in this callback.
Set the result too false to prevent the drop and true to allow the drop.

## Example

{{< highlight html >}}
await crs.call("dom_interactive", "enable_dragdrop", {
    element: "#divStartOpacity",
    options: {
        drag: {
            placeholderType: "opacity",
        },
        drop: {
            allowCallback: (dragElement, target) => {
                console.log(dragElement, target);
                return true;
            },
            action: "copy",
            callback: (element, target) => { console.log(element, target) }
        }
    }
})
{{< / highlight >}}