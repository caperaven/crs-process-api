# Creating your own system

## Basics

A system is a standard javascript class that contains static async functions.

{{< highlight js >}}
export class MyActions {
    // this is a required function with required parameters
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }
}
{{< / highlight >}}

The "perform" function is called by the process runner and is required to be there.  
Now that you have the class you need to add it to the intent.

{{< highlight js >}}
crs.intent.myactions = MyActions;
{{< / highlight >}}

Some systems don't have functions and the "perform" function is sufficient.  
In those cases you can read the intent from the step and execute it as required.  

Let's add a function to "MyActions" and perform some standard operations.

{{< highlight js >}}
export class MyActions {
    // this is a required function with required parameters
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async do_something(step, context, process, item) {
        const value = crs.process.getValue(step.args.value, context, process, item);

        // .. so stuff
        const result = stuff(value);

        if (step.args.target != null) {
            crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}
{{< / highlight >}}

Some important things to note.

1. Don't assume that the args properties contains the final value.  The value could be [prefixed](/docs/prefixes/).  Use `crs.process.getValue`.
2. Always check if the step has a target set and if so, set the target using `crs.process.setValue`.
3. Always return the result (if the step has one) so that you can use the step from JavaScript.
4. Your function parameters should always contain the "step", "context", "process", "item" parameters

That is pretty much the basics of it.  
Next up we will look at some conventions for more complicated tasks.

## Complex operations

There are times when the action you are executing has a lot of code too it.  
In those cases you want to use the system's function to extract information and call an external function or method passing on the required data as parameters.

{{< highlight js >}}
static async do_something(step, context, process, item) {
    const value1 = crs.process.getValue(step.args.value1, context, process, item);
    const value2 = crs.process.getValue(step.args.value2, context, process, item);

    const result = doComplexStuff(value1, value2);

    if (step.args.target != null) {
        crs.process.setValue(step.args.target, result, context, process, item);
    }

    return result;
}
{{< / highlight>}}

## Enable / Disable Feature

Some scenarios require a operations class.  
Before you can use the required actions you need to enable the feature on a target object.  
Once done you need to clean up the memory you instanciated.

Let us assume we are writing a complex dom manipulation operation.  
Something like writing custom interactions ...

In those cases your system will need an "enable" and "disable" function.  
"enable" initializes the resources required.  
"disable" cleans up those resources.

{{< highlight js >}}
export class MyActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async enable(step, context, process, item) {
        const element = getElement(step.args.element);
        element._manager = new ElementManager();
    }

    static async disable(step, context, process, item) {
        element._manager = element._manager.dispose();
    }
}
{{< / highlight >}}

Note that in the above example, manager.dispose() returns null.  
That way you can dispose the resources in one line, including setting the field "_manager" to null;

## Initialize Feature

In the scenario where you want to perform some initialization that does not involve instantiating memory, use the `init` function instead.

{{< highlight js >}}
export class MyActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async init(step, context, process, item) {
        const element = getElement(step.args.element);
        element.style.display = "grid";
    }

    static async add_rows(step, context, process, item) {
        const element = getElement(step.args.element);
        // .. do stuff
    }
}
{{< / highlight >}}

In the above example you need to ensure that the element is a css grid or the other actions will not work correctly.
It is up to the user to first init the relevant element before executing actions on it.