# Notes 

## Binding
See the fragment html for context sharing bindable elements

<strong>Getting template</strong>
```js
this.innerHTML = await crsbinding.templates.get(this.constructor.name, this.html);
```