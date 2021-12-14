    /**
     * Based on this pattern, replace everything with this pattern with a defined value.
     * Must be able to handle one or more key value pairs.
     * @returns {Promise<void>}
     */
    static async replace(step, context, process, item) {
        // step.args = {
        //   patterns: {
        //         "@id"    : 10
        //         "@code"  : "$context.mycode"
        //   }
        // }
    }

    static async concat(step, context, process, item) {

    }

    static async remove(step, context, process, item) {

    }

    static async to_array(step, context, process, item) {
        // spit
        /**
         * args: {
         *     source: "$context.mystring",
         *     pattern: ";"
         *     target: "$context.myarray"
         * }
         */

    }

    static async from_array(step, context, process, item) {
        // join
    }
