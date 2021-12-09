# HTML and template functions / features

## Instantiate schema template

1. I have a UI schema.
2. I have a template int the templates object
3. Add that template to the binding engine templates under this context as group and give me a instance back

## getHTML to support functions

args: {
    id: "dialog-ui",
    html: "$template.process-dialog",
    url: "$context.get_template()" // context.get_template(args)
},

args: {
    id: "dialog-ui",
    html: "$template.process-dialog",
    url: "get_template()" // crs.url.get_template(args)
},

1. url property drives the navigation
1.1 url: "$template.template.html" -> get template in templates folder
1.2 url: "get_template()" -> calls get_template(args) on crs.get_template() -> can use path expression
1.3 url: "$context.get_template()" calls function as path expression on the context object.