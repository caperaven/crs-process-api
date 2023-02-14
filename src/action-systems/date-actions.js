/**
 * @class DateActions - It takes a month and year, and returns an array of days for that month.
 * Features:
 * get_days - Returns an array of days for a given month and year.
 *
 * */
export class DateActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method get_days - This function returns an array of objects that represent the days of a given month
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.month {String} - The month to get the days for.
     * @param step.args.year {String} - The year to get the days for.
     * @param [step.args.only_current] {Boolean} - If true, only the days in the current month will be returned.
     * @param step.args.table {String} - The name of the table to store the days in.
     *
     * @example <caption>javascript</caption>
     * const days = await crs.call("date", "get_days", {
     *   month: "month",
     *   year: "year",
     *   only_current: true,
     *   table: "days"
     * });
     *
     *@example <caption>json</caption>
     * {
     *  type: "date",
     *  action: "get_days",
     *  args: {
     *    month: "month",
     *    year: "year",
     *    only_current: true,
     *    table: "days"
     *    }
     * }
     *
     * @returns An array of objects.
     */
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
}

crs.intent.date = DateActions;


