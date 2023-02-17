# Files

Loading and saving files

## Actions

1. [load](#load)
2. [save](#save)
3. [save_canvas](#save_canvas)

## load

Launch the file selection dialog, select files and return file information including a bite array of content.
The result is an array of objects with the following properties:

1. name - file name
2. ext - file extension
3. type - the type of file
4. value - array buffer (file content)

**properties**

| property | description                                           | required |
|:---------|:------------------------------------------------------|:--------:|
| dialog   | set true of you want to launch the file select dialog |  false   |
| files    | list of file URL to fetch                             |  false   |

**json**

{{< highlight js >}}
"step": {
"type": "files",
    "action": "load",
    "args": {
        "dialog": true
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
let data = await crs.call("files", "load", { dialog: true })
{{< / highlight >}}

## save
Save file content by downloading it in the browser.

This has only one property called "details".
This must be the same structure as you would have gotten from the load function.
See load for more details.

This action will cause a download of the file allowing you to save it to the current machine.

**json**

{{< highlight js >}}
"step": {
    "type": "files",
    "action": "save",
    "args": {
        "details": "$context.details"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("files", "save", {
    details: data
})
{{< / highlight >}}

## save_canvas

Save a canvas element's drawing as a image to your local system using the browsers download feature.

**properties**

| property | description                  | required | default |
|:---------|:-----------------------------|:--------:|:--------|
| source   | canvas element               |   true   |
| name     | name to use on download file |  false   | "image" |

**json**

{{< highlight js >}}
"step": {
    "type": "files",
    "action": "save_canvas",
    "args": {
        "source": "$context.canvasElement",
        "name": "my_image"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("files", "save_canvas", {"source": canvasElement});
{{< / highlight >}}
