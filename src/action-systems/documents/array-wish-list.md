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
     * Combine these two arrays into a single result.
     * @returns {Promise<void>}
     */
    static async concat(step, context, process, item) {

    }

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

    /**
     * Change the value of a field in this array for each item in the array.
     * Can also define condition and only apply change if condition is met
     * @returns {Promise<void>}
     */
    static async change_field_value(step, context, process, item) {
        /**
         * {
         *     property: "value",
         *     value: "$context.myvalue"
         * }
         */

        /**
         * {
         *     property: "value",
         *     value: "$context.myvalue",
         *     condition: "siteCode == 'A11'"
         * }
         */
    }