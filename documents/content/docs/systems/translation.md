# Translation

Use the binding engine's translation features as part of your process or code.  
Read the [crsbinding translation](https://github.com/caperaven/crs-binding-documentation/blob/master/18.%20Translations.md) documentation.

## Actions

1. [add](#add)
2. [get](#get)
3. [delete](#delete)
4. [translate_elements](#translate_elements)
5. [format](#format)

## add

Add translation values to the binding engine for use.

**properties**

| property     | description                           | required |
|:-------------|:--------------------------------------|:--------:|
| translations | translations object to add            |   true   |
| context      | context name to use for translation   |   true   |

The context  is important if you want to delete translations when you are done with it.  
The context is used to identify what to delete.  
The context should be unique.  

**json**

{{< highlight js >}}
"step": {
    "type": "translations",
    "action": "add",
    "step": {
        "translations": {
            "buttons": {
                "save": "Save"
                "new": "New"
            }
        },
        "context": "buttons"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = await crs.call("translations", "add", {"translations": {
    "buttons": {
        "save": "Save"
        "new": "New"
    }
});
{{< / highlight >}}

## get

Get translation values from the binding engine.

**properties**

| property | description                   | required |
|:---------|:------------------------------|:--------:|
| key      | what translation value to get |   true   |
| target   | where to copy that value too  |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "translations",
    "action": "get",
    "step": {
        "key": "buttons/save",
        "target": "$context.value"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = await crs.call("translations", "get", { "key": "buttons/save" });
{{< / highlight >}}

## delete

Delete translation objects from binding engine.  
You need to use the context used during the add operation.

**properties**

| property | description                 | required |
|:---------|:----------------------------|:--------:|
| context  | context used during the add |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "translations",
    "action": "delete",
    "step": {
        "context": "buttons"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = await crs.call("translations", "delete", { "context": "buttons" });
{{< / highlight >}}

## translate_elements

Perform translation inflation on a HTMLElement and replace translation markup with translation values.  
Read the html [documentation for details](https://github.com/caperaven/crs-binding-documentation/blob/master/18.%20Translations.md#marking-translations-in-the-html).
The bottom line is that when you have a HTMLElement that contains translation markup and you want to bring in the values, this is the function to use.

**properties**

| property | description          | required |
|:---------|:---------------------|:--------:|
| element  | element to translate |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "translations",
    "action": "translate_elements",
    "step": {
        "element": "#target"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("translations", "translate_elements", { element: element });
{{< / highlight >}}

## format

You can have a format string in the translations.  
Error messages being a example of that.  
You can have some base text and then some values you want to inflate in there.

For example:
`"User should be older than ${age}"`

You want to translate the text but have the inflation markers in place to inject values from the data.
This function allows you to do that.  
Get the string from the translations based on the key provided and then inflate it with values.

**properties**

| property   | description                                | required |
|:-----------|:-------------------------------------------|:--------:|
| key        | translation key to use                     |   true   |
| parameters | object that contains the translation keys. |   true   |
| target     | where to copy the result too               |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "translations",
    "action": "format",
    "step": {
        "key": "messages/age_error",
        "parameters": {
            "age": 20
        },
        "target": "$context.result"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("translations", "format", { 
    key: "messages/age_error",
    parameters: { age: 20 }
});
{{< / highlight >}}
