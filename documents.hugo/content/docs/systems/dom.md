# Dom

The dom feature allows common dom manipulation features.  
This can be called from both the schema and javascript.  

## Actions
1. [call_on_element](#call_on_element)
2. [get_property](#get_property)
3. [set_properties](#set_properties)
4. [set_attribute](#set_attribute)
5. [get_attribute](#get_attribute)
6. [add_class](#add_class)
7. [remove_class](#remove_class)
8. [set_style](#set_style)
9. [set_styles](#set_styles)
10. [get_style](#get_style)
11. [set_text](#set_text)
12. [get_text](#get_text)
13. [create_element](#create_element)
14. [remove_element](#remove_element)
15. [clear_element](#clear_element)
16. [show_widget_dialog](#show_widget_dialog)
17. [show_form_dialog](#show_form_dialog)
18. [set_widget](#set_widget)
19. [clear_widget](#clear_widget)
20. [move_element](#move_element)
21. [move_element_down](#move_element_down)
22. [move_element_up](#move_element_up)
23. [open_tab](#open_tab)
24. [clone_for_movement](#clone_for_movement)
25. [elements_from_template](#elements_from_template)
26. [create_inflation_template](#create_inflation_template)
27. [get_element](#get_element)
28. [get_animation_layer](get_animation_layer)
29. [clear_animation_layer](clear_animation_layer)
30. [remove_animation_layer](remove_animation_layer)
31. [highlight](highlight)


## call_on_element

Call a function on an element.  
This is often used when you want to call a function on a custom component.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| action   | the function to call | true |
| parameters | array of values to pass in as parameters to the function | false |
| target    | where the result is copied too | false |

**json**

{{< highlight js >}}
"step": {
    "type"  : "dom",
    "action": "call_on_element",
    "args"  : {
        "element"    : "#element",
        "action"     : "doSomething",
        "parameters" : ["hello world"]
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "call_on_element", {
    "element"    : "#element"
    "action"     : "doSomething",
    "parameters" : ["hello world"]
});
{{< / highlight >}}

## get_property

Get a property value for a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| property | property name to get the value from | true |
| target    | where the result is copied too | false |

**json**

{{< highlight js >}}
"step": {
    "type"  : "dom",
    "action": "get_property",
    "args"  : {
        "element"  : "#element",
        "property" : "value"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "get_property", {
    "element": "#element",
    "value"  : "value"
});
{{< / highlight >}}

## set_properties

Set one or more properties on a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| properties | object that defines property value pairs | true |

**json**

{{< highlight js >}}
"step": {
    "type"  : "dom",
    "action": "set_properties",
    "args"  : {
        "element": "#element",
        "properties": {
            "property1": "value1",
            "property2": "value2"
        }
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "set_properties", {
    "element": "#element",
    "properties": {
        "property1": "value1",
        "property2": "value2"
    }
});
{{< / highlight >}}

## set_attribute

Set a attribute value on a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| attr     | the attribute name | true |
| value    | value to set | true |

**json**

{{< highlight js >}}
"step": {
    "type"  : "dom",
    "action": "set_attribute",
    "args"  : {
        "element" : "#element",
        "attr"    : "aria-role",
        "value"   : "menu"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "set_attribute", {
    "element" : "#element",
    "attr"    : "aria-role",
    "value"   : "menu"
});
{{< / highlight >}}

## get_attribute

Get a attribute value from a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| attr     | the attribute name | true |
| target    | where the result is copied too | false |

**json**

{{< highlight js >}}
"step": {
    "type"  : "dom",
    "action": "get_attribute",
    "args"  : {
        "element" : "#element",
        "attr"    : "aria-role",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "get_attribute", {
    "element" : "#element",
    "attr"    : "aria-role",
});
{{< / highlight >}}

## add_class

Add a css class to a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| value    | array of class names or a single class name (string) | true |

**json**

{{< highlight js >}}
"step": {
    "type"  : "dom",
    "action": "add_class",
    "args"  : {
        "element": "#element",
        "value"  : "class1" 
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "add_class", {
    "element": "#element",
    "value"  : ["class1", "class2"]
});
{{< / highlight >}}

## remove_class

Remove a css class from a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| value    | array of class names or a single class name (string) | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "remove_class",
    "args": {
        "element": "#element",
        "value"  : "class1"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "remove_class", {
    "element": "#element",
    "value"  : ["class1", "class2"]
});
{{< / highlight >}}

## set_style

Set a style value on a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| style    | js style name on styles object | true |
| value    | value to set on style | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "set_style",
    "args": {
        "element": "#element",
        "style"  : "background",
        "value"  : "#ff0090"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "set_style", {
    "element": "#element",
    "style"  : "background",
    "value"  : "#ff0090"
});
{{< / highlight >}}

## set_styles

Set a number of style values on a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| styles   | object with key value pairs of styles to set | true | 

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "set_styles",
    "args": {
        "element": "#element",
        "styles" : {
            "background": "#ff0090",
            "color": "white"
        }
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "set_styles", {
    "element": "#element"
    "styles" : {
        "background": "#ff0090",
        "color": "white"
    }
});
{{< / highlight >}}

## get_style

Get a value from a style on a element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| style    | style property name go get value of | true |
| target    | where the result is copied too | false |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "get_style",
    "args": {
        "element": "#element",
        "style"  : "background"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "get_style", {
    "element": "#element",
    "style"  : "background"
});
{{< / highlight >}}

## set_text

Set the textContent value of a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| value    | the text to set as the content | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "set_text",
    "args": {
        "element": "#element",
        "value"  : "Hello World"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "set_text", {
    "element": "#element",
    "value"  : "Hello World"
});
{{< / highlight >}}

## get_text

Get a textContent value for a given element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| target    | where the result is copied too | false |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "get_text",
    "args": {
        "element": "#element",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "get_text", {
    "element": "#element"
});
{{< / highlight >}}

## create_element

Create an element for a given tag and set other values on the element such as:

1. attributes
2. styles
3. classes
4. dataset attributes
5. text content
6. id
7. children

| property | description | required |
| :------- | :---------- | :--------: |
| parent   | element or query selector of where to add the element | true |
| tag_name | tag name of element to create | true |
| target   | where the result is copied too | false |
| id       | id of the new element | false |
| attributes | attributes key value pairs | false |
| styles   | styles key value pairs | false |
| classes  | array of class names | false |
| dataset  | data-attributes key value pairs | false |
| text_content | value to set on element's textContent property | false |
| children | array of objects that will also use create_element so shares these properties | false |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "create_element",
    "args": {
        "parent"    : "#parent",
        "tag_name"  : "my-component",
        "id"        : "component1",
        "attributes": {
            for="#that"
        },
        "styles"    : {
            "background": "silver"
        },
        "classes"   : ["class1"],
        "dataset"   : {
            id: "test-id"
        },
        "text_content": "Hello World",
        "children": [
            {
                "element": "div",
                "text_content": "child"
            }
        ]   
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "create_element", {
    "parent"    : "#parent",
    "tag_name"  : "div"
});
{{< / highlight >}}

## remove_element

Remove a element from the dom.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "remove_element",
    "args": {
        "element": "#element",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "remove_element", {
    "element": "#element"
});
{{< / highlight >}}

## clear_element  

Clear all the children from a given element and release any bindings on it.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "clear_element",
    "args": {
        "element": "#element",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "clear_element", {
    "element": "#element"
});
{{< / highlight >}}

## show_widget_dialog

Set a widget's html and context for binding after adding it to the UI as a dialog.

| property | description | required |
| :------- | :---------- | :--------: |
| id       | id of created element | true |
| html     | template id to use | true |
| url      | where to fetch the HTML data if the template does not exists yet. | true |

The url can be a path or a function.

1. path : "/templates/dialog.html"
2. url  : "$fn.getTemplate"

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "show_widget_dialog",
    "args": {
        "id"      : "test",
        "html"    : "$template.process-dialog",
        "url"     : "$fn.getTemplate"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "show_widget_dialog", {
    "id"      : "test",
    "html"    : "$template.process-dialog",
    "url"     : "$fn.getTemplate"
});
{{< / highlight >}}

## show_form_dialog

Show a form UI from template as a dialog including an ok and cancel button.
Validation is done on the form when pressing OK but will not close until the validation passes.

| property | description | required |
| :------- | :---------- | :--------: |
| id       | id of created element | true |
| html     | template id to use | true |
| url      | where to fetch the HTML data if the template does not exists yet. | true |
| error_store | the name where errors must be saved on the binding context | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "show_form_dialog",
    "args": {
        "id"      : "test",
        "html"    : "$template.process-dialog",
        "url"     : "$fn.getTemplate"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "show_form_dialog", {
    "id"      : "test",
    "html"    : "$template.process-dialog",
    "url"     : "$fn.getTemplate"
});
{{< / highlight >}}

## set_widget

Set html and context on an existing widget component.

| property | description | required |
| :------- | :---------- | :--------: |
| query  | element or query selector | true |
| context  | the context object to set on the widget | true |
| html     | template id to use | true |
| url      | where to fetch the HTML data if the template does not exists yet. | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "set_widget",
    "args": {
        "query"   : "#element",
        "context" : "$context.model",
        "html"    : "$template.process-dialog",
        "url"     : "$fn.getTemplate"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "set_widget", {
    "query"   : "#element",
    "context" : "$context.model",
    "html"    : "$template.process-dialog",
    "url"     : "$fn.getTemplate"
});
{{< / highlight >}}

## clear_widget

Clear a existing widget so that it does not have any content or context.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "clear_widget",
    "args": {
        "element": "#element",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "clear_widget", {
    "element": "#element"
});
{{< / highlight >}}

## move_element

Move an element from one parent to another.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| target   | element or query selector to where the element will be moved | true |
| position | where must this be moved | false |

**position options**
1. null: will append element on parent.
2. "before": will add element on target's parent before the target.
3. "after" : will add element on target's parent after the target.

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "move_element",
    "args": {
        "element": "#element",
        "target" : "#parent"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "move_element", {
    "element"  : "#element",
    "target"   : "#item",
    "position" : "before"
});
{{< / highlight >}}

## move_element_down

Move an existing element below its next sibling.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "move_element_down",
    "args": {
        "element": "#element",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "move_element_down", {
    "element": "#element"
});
{{< / highlight >}}

## move_element_up

Move an element above its previous sibling.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "move_element_up",
    "args": {
        "element": "#element",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "move_element_up", {
    "element": "#element"
});
{{< / highlight >}}

## open_tab

Open a URL in a new browser tab.

| property | description | required |
| :------- | :---------- | :--------: |
| url      | url to navigate | true |
| parameters | key value pair of parameters and values to inflate on url | false |

The parameters use the [String](/docs/systems/string/) action's [inflate](/docs/systems/string/#inflate) function.

***parameterized url***
{{< highlight js >}}
url         = "#input/${id}?type='tasks'&typeId='${typeId}'"
parameters  = {id: 1000, typId: "$context.typeId"}
{{< / highlight >}}
**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "open_tab",
    "args": {
        "url": "https://www.google.com"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "open_tab", {
    url: "#input/${id}?type='tasks'&typeId='${typeId}'",
    parameters: {
        id: 1000,
        typeId: "$context.typeId"
    }
});
{{< / highlight >}}

## clone_for_movement

Clone an element and put it on an animation layer for the purpose of moving it on the screen.

| property | description | required | default value |
| :------- | :---------- | :--------: | :--------- |
| element  | element or query selector | true |
| parent   | parent element or query to copy clone too | true |
| position | object with x and y properties for location | false | {x: 0, y: 0} |
| attributes | attributes to set on clone | false |
| styles | styles to set on clone | false |
| classes | classes to add to clone | false |

Position css property is set to "absolute" by default with a transform property set to "translate" on x and y.

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "clone_for_movement",
    "args": {
        "element": "#element",
        "parent" : "#parent"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "clone_for_movement", {
    "element": "#element"
    "parent" : "#parent"
});
{{< / highlight >}}

## elements_from_template

Given an array of objects
1. Create a fragment containing elements based on a template.
2. Add the fragment to a parent element if defined
3. Return fragment to caller

| property | description | required | default value |
| :------- | :---------- | :--------: | :--------- |
| template_id  | template id to use from the binding engine's template manager | true |
| data | array of objects that for whom we need to create elements | true |
| template | template to use if the required template id does not exists | false |
| remove_template | remove template when done | false | false |
| recycle | recycle existing children in a element | false | false |
| row_index | what row to start with during recycle | false | 0 |
| parent | parent element that elements will be on | schema |

There are a lot of properties there for specialized usage but the simple use case looks like this.

{{< highlight js >}}
await crs.intent.dom.elements_from_template({ args: {
    template_id     : "tpl_generated",
    data            : batch,
    parent          : "#inflation-grid"
}}, this)
{{< / highlight >}}


**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "elements_from_template",
    "args": {
        "element": "#element",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "elements_from_template", {
    "element": "#element"
});
{{< / highlight >}}


## create_inflation_template

Use an object literal as the source to generate a template for inflation.
For complex templates use the element from template.
Function is better for scenarios like cell generation.
It automatically registers the template on the inflation engine

| property | description | required | default |
| :------- | :---------- | :--------: | :---------- |
| element  | element or query selector | true |
| source  | object to use for generation | true |
| tag_name  | element tag name to use for each property | true |
| ctx  | the context name to use in the inflation manager | false | "context" |
| wrapper  | wrap these elements in a parent element of this tag type | false |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "create_inflation_template",
    "args": {
        "element": "#element",
        "source" : {
            "property": "value"
        },
        "tag_name": "li",
        "wrapper" : "ul"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "create_inflation_template", {
    "element": "#element",
    "source" : {
        "property": "value"
    },
    "tag_name": "li",
    "wrapper" : "ul"
});
{{< / highlight >}}

## get_element

Get a element from the dom based on a query or element.

| property | description | required |
| :------- | :---------- | :--------: |
| element  | element or query selector | true |
| target    | where the result is copied too | false |

**json**

{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "get_element",
    "args": {
        "element": "#element",
        "target" : "$context.element"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("dom", "get_element", {
    "element": "#element"
});
{{< / highlight >}}

## get_animation_layer

There can only be one animation layer.  
This function either creates it for you if it does not exist or returns the existing one.  
The animation layer is full screen and does not accept pointer events.

The only parameter is the standard "target" parmaeter

**json**
{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "get_animation_layer",
    "args": {
        "target" : "$context.layer"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const layer = crs.call("dom", "get_animation_layer");
{{< / highlight >}}

## clear_animation_layer

If the animation layer exists clear it of all children.

**json**
{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "clear_animation_layer",
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const layer = crs.call("dom", "clear_animation_layer");
{{< / highlight >}}


## remove_animation_layer

Remove the animation layer from the dom.

**json**
{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "remove_animation_layer",
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const layer = crs.call("dom", "remove_animation_layer");
{{< / highlight >}}


## highlight

This feature creates a highlight region around a defined element.  
This can be either a standard styled div or an instance of a template.  
If you do use a template it is important that you only have one child as this child will be sized to the size of the highlighted element.
A highlight can be permanent until you clear the animation layer or, you can define its timeout by setting the delay.

I can use this with a existing animation layer but, you don't need to.
Once you call this it will first create the animation layer if it does not already exist.
It will however not automatically remove the animation layer once done.

| property | description                                        | required | default |
|:---------|:-------------------------------------------------- |:--------:|:--------|
| target   | element or query selector                          |  true    |         | 
| classes  | array of css classes to use on hightlight element  |  false   |         |
| duration | how long must the highlight show for (0 = infinite)|  false   | 0       |
| template | if you want a custom UI, pass this on via the      |  false   |         |

**json**
{{< highlight js >}}
"step": {
    "type": "dom",
    "action": "highlight",
    "args": {
        target: event.target,
        classes: ["highlight"],
        duration: 500,
        template: template
    }
}
{{< / highlight >}}

**js**

{{< highlight js >}}
await crs.call("dom", "highlight", {
    target: event.target,
    classes: ["highlight"],
    duration: 500,
    template: template
})
{{< / highlight >}}
