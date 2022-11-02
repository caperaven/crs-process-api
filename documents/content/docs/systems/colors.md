# Colors

Color conversion actions.

## Actions
1. [hex_to_rgb](#hex_to_rgb)
2. [hex_to_rgba](#hex_to_rgba)
3. [hex_to_normalised](#hex_to_normalised)
4. [rgb_to_hex](#rgb_to_hex)
5. [rgba_to_hex](#rgba_to_hex)
6. [rgb_text_to_hex](#rgb_text_to_hex)
7. [css_to_hex](#css_to_hex)
8. [css_to_normalized](#css_to_normalized)
9. [](#)

## hex_to_rgb
This action will convert a hexidecimal color/value to a rgb color/value.

| property | description      | required |
|:---------|:-----------------| :--------: |
| hex      | hex string value | true |

**json**

{{< highlight js >}}
"step": {
    "type" : "colors",
    "action" : "hex_to_rgb",
    "args" : {
        "hex" : "#000000"
    }
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "hex_to_rgb", {
    hex : "#000000"
})
{{< / highlight >}}


## hex_to_rgba
This action will convert a hexidecimal color/value to a rgba color/value.

| property | description      | required |
|:---------|:-----------------| :--------: |
| hex      | hex string value | true |

**json**

{{< highlight js >}}
"step": {
"type" : "colors",
"action" : "hex_to_rgb",
"args" : {
"hex" : "#000000"
}
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "hex_to_rgb", {
hex : "#000000"
})
{{< / highlight >}}



## hex_to_normalised
This action will convert a Hexidecimal value to a Normalised Value.

| property | description      | required |
|:---------|:-----------------| :--------: |
| hex      | hex string value | true |


**json**

{{< highlight js >}}
"step": {
    "type" : "colors",
    "action" : "hex_to_normalised",
    "args" : {
        "hex": "#000000"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("colors", "hex_to_normalised",{
    hex: "#000000"
})
{{< / highlight >}}



## rgb_to_hex
This action will convert an RGB color-value to a Hexidecimal value

| property | description           | required |
|:---------|:----------------------|:--------:|
| r        | value between 0 & 255 |  false   |
| g        | value between 0 & 255 |  false   |
| b        | value between 0 & 255 |  false   |

**json**

{{< highlight js >}}
"step": {
    "type" : "colors",
    "action" : "rgb_to_hex",
    "args" : {
        "r": "255",
        "g": "255",
        "b": "255"
    }
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "rgb_to_hex",{
    r: "255",
    g: "255",
    b: "255"
    })
{{< / highlight >}}


## rgba_to_hex
This action will convert an RGBA color-value to a Hexidecimal value

| property | description             | required |
|:---------|:------------------------| :--------: |
| r        | value between 0 & 255   |  false   |
| g        | value between 0 & 255   |  false   |
| b        | value between 0 & 255   |  false   |
| a        | value between 0.0 & 1.0 |  false   |

**json**

{{< highlight js >}}
"step":{
    "type": "colors",
    "action": "rgba_to_hex",
    "args": {
        "r": "255",
        "g": "0",
        "b": "255",
        "a": "0.5"
    }
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "rgba_to_hex", {
    r: "255",
    g: "100",
    b: "255",
    a: "0.5"
})
{{< / highlight >}}


## rgb_text_to_hex
This action will take an RGB text value and convert it to a Hexidecimal value.


| property | description    | required |
|:---------|:---------------| :--------: |
| value    | RGB text value | true |

**json**

{{< highlight js >}}
"step": {
    "type" : "colors",
    "action" : "rgb_text_to_hex",
    "args" : {
        "value" : "rgb(255, 255, 255)" 
    }
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "rgb_text_to_hex", {
    value : "rgb(255, 255, 255)"
})
{{< / highlight >}}




## css_to_hex
This action will take an existing CSS color-value and convert it to a Hexidecimal value.

| property | description | required |
|:---------|:------------| :--------: |
|       |             |  |

**json**

{{< highlight js >}}
"step":{
    "type": "colors",
    "action": "css_to_hex",
    "args": {
        
    }
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "css_to_hex",{
    
})
{{< / highlight >}}

## css_to_normalized
This action will take an existing CSS color-value and convert it to a Normalized Value.

| property | description      | required |
|:---------|:-----------------|:--------:|
|          |  |          |

**json**

{{< highlight js >}}
"step":{
    "type": "colors",
    "action": "css_to_normalized",
    "args": {

    }
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "css_to_hex",{

})
{{< / highlight >}}