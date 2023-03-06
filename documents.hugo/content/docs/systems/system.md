# System

This contains system or environmental functions.  

## Actions

1. [copy_to_clipboard](#copy_to_clipboard)
2. [sleep](#sleep)
3. [pause](#pause)
4. [resume](#resume)
5. [abort](#abort)
6. [is_mobile](#is_mobile)
7. [is_portrait](#is_portrait)
8. [is_landscape](#is_landscape)

## copy_to_clipboard

Copy a given value to clipboard for system paste functions.

**properties**

| property | description                   | required |
|:---------|:------------------------------| :--------: |
| source   | value to add to the clipboard | true |

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "copy_to_clipboard",
    "args": {
        "source": "$context.value",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("array", "copy_to_clipboard", { source: "hello world" });
{{< / highlight >}}

## sleep

Set a delay before executing further.  
This is typically used for testing purposes.  
Ideally you should not use this in operational processes.

**properties**

| property  | description                 | required |
|:----------|:----------------------------|:--------:|
| duration  | milliseconds to delay with  |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "sleep",
    "args": {
        "duration": 100,
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("array", "sleep", { duration: 100 });
{{< / highlight >}}

## pause

Pause a running process, waiting for other input before continuing.
This is most often used to pause a process while getting user input via an async form.
The process's status is set to "wait"

A "resume" function is attached to the process to continue when needed.

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "pause"
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("array", "pause");
{{< / highlight >}}

## resume

This will call the resume function that was created during the pause operation.  
From this point forward the process will run as normal again.

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "resume"
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("array", "resume");
{{< / highlight >}}

## abort

Given an error property, throw a new error with that as the message.

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "abort", 
    "args": {
        "error": "oops something went wrong"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
await crs.call("array", "resume", { "error": "oops something went wrong" });
{{< / highlight >}}

## is_mobile

Check if the device is a mobile device and if so, return `true` else `false`

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "is_mobile"
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = await crs.call("array", "is_mobile");
{{< / highlight >}}

## is_portrait

Check if a device's orientation is `portrait` and if so, return `true` else `false`

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "is_portrait"
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = await crs.call("array", "is_portrait");
{{< / highlight >}}

## is_landscape

Check if a device's orientation is `landscape` and if so, return `true` else `false`

**json**

{{< highlight js >}}
"step": {
    "type": "system",
    "action": "is_landscape"
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = await crs.call("array", "is_landscape");
{{< / highlight >}}

