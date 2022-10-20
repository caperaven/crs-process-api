export class DatesActions {
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
}

crs.intent.dates = DatesActions;