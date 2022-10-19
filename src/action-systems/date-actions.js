export class DatesActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async get_days(step, context, process, item) {
        const month = await crs.process.getValue(step.args.month, context, process, item);
        const year = await crs.process.getValue(step.args.year, context, process, item);
        const onlyCurrent = await crs.process.getValue(step.args.only_current,context,process, item);
        const currentMonthLastDate = new Date(year, month + 1, 0).getDate();
        const weekdays = ["sun","mon","tue","wed","thu","fri","sat"];
        const nextMonthDateString = new Date(year,month + 1);
        const currentMonthDateString = new Date(year, month);
        let previousMonthDates = await getPreviousMonthDates(year, month);
        let currentType, currentDay;
        let dates = [];
        let endLoop = false;

        onlyCurrent == true ? previousMonthDates = []:"";
        for(let i = 0; i < 6; i++){
            let days = {};
            for(let j = 0; j < 7; j++){
                if(previousMonthDates.length == 0){
                    currentType = true;
                    currentDay = currentMonthDateString.getDate();
                    currentMonthDateString.setDate((currentDay + 1));

                    if(currentDay !== currentMonthLastDate && currentMonthDateString.getMonth() === nextMonthDateString.getMonth()){
                        currentType = false;
                    }
                }else {
                    currentType = false;
                    currentDay = previousMonthDates.shift();
                }

                days = {
                    number: currentDay, current: currentType, day: weekdays[j]
                }
                dates.push(days);
                if(currentDay === currentMonthLastDate && previousMonthDates.length == 0 && onlyCurrent == true)
                { endLoop = true; break;}
            }
           if(endLoop == true) break;
        }
        if(step.args.target != null){
            await crs.process.setValue(step.args.target, dates, context, process, item);
        }
        return dates;
    }
}
async function getPreviousMonthDates(year,month){
    const dateString = new Date(year, month,0);
    const lastDay = dateString.getDay();
    const lastDate = dateString.getDate();
    let previousDays =[];

    for(let i = lastDay; i >= 0; i--){
        previousDays.push(lastDate - i);
    }

    return previousDays;
}

crs.intent.dates = DatesActions;