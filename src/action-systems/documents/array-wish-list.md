# Array system wishlist functions

## remove
Remove a given item or items from the array.

```js
{
    args: {
        source: "$context.myarray",
        index: {number}/{expression},
        count: 1  // number of items to delete
    }
}
```

## move_position
For a given array, move an item up or down in the array as specified
```js
{
    args: {
         source: "$context.myarray"
 
         // example 1
         index: 1,
         toIndex: 2,
 
         // example 2
         indexOf: "expression",
         toIndex: "expression"
     }
}
```

## swap_items
This will swap two items in the array

```js
{
    args: {
        source: "$context.array",
        index: 1,
        toIndex: 2    
    }
}
```

    /**
     * Replace an item in the array with a different item at the same location.
     * @returns {Promise<void>}
     */
    static async replace(step, context, process, item) {

    }

    /**
     * Given an array of objects, provide an index of the item and return a property from the object at that location.
     * If property is not defined, return the entire object instead.
     * @returns {Promise<void>}
     */
    static async get_value(step, context, process, item) {

    }