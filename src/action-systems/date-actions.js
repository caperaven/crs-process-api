export class DatesActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async get_days(step, context, process, item) {
        const month = await crs.process.getValue(step.args.month, context, process, item);
        const year = await crs.process.getValue(step.args.year, context, process, item);
        const onlyCurrent = await crs.process.getValue(step.args.only_current,context,process, item);
        const startingDate = new Date(year, month, -(new Date(year, month, 1).getDay())+1);
        const currentMonthEndDate = new Date(year,month + 1, 0).getDate();
        const currentMonthStartDate = new Date(year,month, 1);
        let week = {}, dates = [], endLoop = 42, startingDays = startingDate, currentType;

        onlyCurrent === true ? (endLoop = currentMonthEndDate,  startingDays = currentMonthStartDate): null;
        for (let i = 0; i < endLoop; i++) {
            const dayOfTheWeek = (startingDays).toLocaleString('en-us', {weekday:'short'});

            onlyCurrent === false && currentMonthStartDate.getMonth() !== startingDate.getMonth() ?
            currentType = false: currentType = true;

            week = { number: startingDays.getDate(), current: currentType, day: dayOfTheWeek }
            dates.push(week);

            startingDays.setDate(startingDays.getDate() + 1);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.table, dates, context, process, item);
        }

        return dates;
    }
}


crs.intent.dates = DatesActions;