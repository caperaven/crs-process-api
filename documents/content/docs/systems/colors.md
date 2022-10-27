# Colors

Color conversion actions.

## Actions
1. [hex_to_rgb](#hex_to_rgb)
2. [hex_to_normalised](#hex_to_normalised)
3. [rgb_to_hex](#rgb_to_hex)
4. [rgba_to_hex](#rgba_to_hex)
5. [css_to_hex](#css_to_hex)
6. [css_to_normalized](#css_to_normalized)
7. [](#)

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
"hex" : #hex_value (#000000)
}
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "hex_to_rgb", {
hex : this.hexValue
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

}
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("colors", "hex_to_normalised",{

})
{{< / highlight >}}



## rgb_to_hex
This action will convert an RGB color-value to a Hexidecimal value

| property | description      | required |
|:---------|:-----------------| :--------: |
| hex      | hex string value | true |

**json**

{{< highlight js >}}
"step": {
"type" : "colors",
"action" : "rgb_to_hex",
"args" : {
r: "",
g: "",
b: ""
}
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "rgb_to_hex",{
r: "",
g: "",
b: ""
})
{{< / highlight >}}


## rgba_to_hex
This action will convert an RGBA color-value to a Hexidecimal value

| property | description      | required |
|:---------|:-----------------| :--------: |
| hex      | hex string value | true |

**json**

{{< highlight js >}}
"step":{
"type": "colors",
"action": "rgba_to_hex",
"args": {
r: "",
g: "",
b: "",
a: ""
}
}
{{< / highlight >}}


**javascript**

{{< highlight js >}}
crs.call("colors", "rgba_to_hex", {
r: "",
g: "",
b: "",
a: ""
})
{{< / highlight >}}


## css_to_hex
This action will take an existing CSS color-value and convert it to a Hexidecimal value.

| property | description      | required |
|:---------|:-----------------| :--------: |
| hex      | hex string value | true |

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

{{< / highlight >}}

## css_to_normalized
This action will take an existing CSS color-value and convert it to a Normalized Value.

| property | description      | required |
|:---------|:-----------------| :--------: |
| hex      | hex string value | true |

**json**

{{< highlight js >}}

{{< / highlight >}}


**javascript**

{{< highlight js >}}

{{< / highlight >}}