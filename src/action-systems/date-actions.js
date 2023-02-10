export class DateActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async get_days(step, context, process, item) {
        const month = await crs.process.getValue(step.args.month, context, process, item);
        const year = await crs.process.getValue(step.args.year, context, process, item);
        const onlyCurrent = await crs.process.getValue(step.args.only_current, context, process, item);
        const currentMonthStartDate = new Date(year, month, 1);
        const currentMonth = currentMonthStartDate.getMonth();
        let dates = [];
        let dayCount;
        let startingDate;
        let currentType;

        if (onlyCurrent === true) {
            startingDate = currentMonthStartDate;
            dayCount = new Date(year, month + 1, 0).getDate();
        } else {
            startingDate = new Date(year, month, -(currentMonthStartDate.getDay()) + 1);
            dayCount = 42;
        }

        for (let i = 0; i < dayCount; i++) {
            const dayOfTheWeek = startingDate.toLocaleString('en-us', {weekday: 'short'});

            if (onlyCurrent === false && currentMonth !== startingDate.getMonth()) {
                currentType = false
            } else {
                currentType = true;
            }

            const day = {
                number: startingDate.getDate(),
                current: currentType,
                day: dayOfTheWeek,
                date: new Date(startingDate.getTime())
            }

            dates.push(day);
            startingDate.setDate(startingDate.getDate() + 1);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.table, dates, context, process, item);
        }

        return dates;
    }

    /**
     * @method get_year_range_by_offsets - Returns an array of years based on the current year and the min and max offsets.
     * @param step - the step object
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.minYearSelectOffset {number} - The minimum number of years to go back from the current year.
     * @param step.args.maxYearSelectOffset {number} - The maximum number of years to go forward from the current year.
     * @param [step.args.target] {string} - The target to set the result to.
     *
     * @returns An array of years.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("date", "get_year_range_by_offsets", {
     *      minYearSelectOffset: 10,
     *      maxYearSelectOffset: 10
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "date",
     *     "action": "get_year_range_by_offsets",
     *     "args": {
     *         "minYearSelectOffset": 10,
     *         "maxYearSelectOffset": 10
     *         "target": "$context.result"
     *     }
     * }
     */
    static async get_year_range_by_offsets(step, context, process, item){
        const minYearSelectOffset = await crs.process.getValue(step.args.minYearSelectOffset, context, process, item);
        const maxYearSelectOffset = await crs.process.getValue(step.args.maxYearSelectOffset, context, process, item);

        const currentYear = new Date().getFullYear();
        const years = [];

        for (let i = currentYear - minYearSelectOffset; i <= currentYear + maxYearSelectOffset; i++) {
            years.push(i);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, years, context, process, item);
        }

        return years;
    }
}

crs.intent.date = DateActions;


