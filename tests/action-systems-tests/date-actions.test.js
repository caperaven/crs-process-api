import {beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals, assert} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/date-actions.js");
})

describe("date actions tests if only_current = false", () => {
    it("get_days for Oct 2022", async () => {
        const month = 9;
        const year = 2022;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: false
        });
        const dateObject = new Date(year, month - 1, 25);

        assertEquals(dates[0].number, 25);
        assertEquals(dates[dates.length - 1].number, 5);
        assertEquals(dates.length, 42);
        assertEquals(dates[0].current, false);
        assertEquals(dates[0].day, "Sun");
        assertEquals(dates[0].date, dateObject);
        checkRequired(dates[0], ["number", "current", "day", "date"]);
    });
    it("get_days for Sep 2022", async () => {
        const month = 8;
        const year = 2022;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: false
        });
        const dateObject = new Date(year, month - 1, 29);

        assertEquals(dates[1].number, 29);
        assertEquals(dates[dates.length - 1].number, 8);
        assertEquals(dates.length, 42);
        assertEquals(dates[1].current, false);
        assertEquals(dates[1].day, "Mon");
        assertEquals(dates[1].date, dateObject);
        checkRequired(dates[1], ["number", "current", "day", "date"]);
    });

    it("get_days for Feb 2020 leap year", async () => {
        const month = 1;
        const year = 2020;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: false
        });

        const dateObject = new Date(year, month - 1, 26);

        assertEquals(dates[0].number, 26);
        assertEquals(dates[dates.length - 1].number, 7);
        assertEquals(dates.length, 42);
        assertEquals(dates[0].current, false);
        assertEquals(dates[0].day, "Sun");
        assertEquals(dates[0].date, dateObject);
        checkRequired(dates[0], ["number", "current", "day", "date"]);
    });
    it("get_days for Feb 2021 non-leap year", async () => {
        const month = 1;
        const year = 2021;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: false
        });
        const dateObject = new Date(year, month, 3);

        assertEquals(dates[3].number, 3);
        assertEquals(dates[dates.length - 1].number, 13);
        assertEquals(dates.length, 42);
        assertEquals(dates[3].current, true);
        assertEquals(dates[3].date, dateObject);
        assertEquals(dates[3].day, "Wed");
        checkRequired(dates[3], ["number", "current", "day", "date"]);
    });
});

describe("date actions tests if only_current = true", () => {
    it("get_days for Oct 2022", async () => {
        const month = 9;
        const year = 2022;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: true
        });
        const dateObject = new Date(year, month, 1);

        assertEquals(dates[0].number, 1);
        assertEquals(dates[dates.length - 1].number, 31);
        assertEquals(dates.length, 31);
        assertEquals(dates[0].current, true);
        assertEquals(dates[0].day, "Sat");
        assertEquals(dates[0].date, dateObject);
        checkRequired(dates[0], ["number", "current", "day", "date"]);
    });
    it("get_days for Sep 2022", async () => {
        const month = 8;
        const year = 2022;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: true
        });
        const dateObject = new Date(year, month, 3);

        assertEquals(dates[2].number, 3);
        assertEquals(dates[dates.length - 1].number, 30);
        assertEquals(dates.length, 30);
        assertEquals(dates[2].current, true);
        assertEquals(dates[2].day, "Sat");
        assertEquals(dates[2].date, dateObject);
        checkRequired(dates[2], ["number", "current", "day", "date"]);
    });

    it("get_days for Feb 2020 leap year", async () => {
        const month = 1;
        const year = 2020;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: true
        });
        const dateObject = new Date(year, month, 5);

        assertEquals(dates[4].number, 5);
        assertEquals(dates[dates.length - 1].number, 29);
        assertEquals(dates.length, 29);
        assertEquals(dates[4].current, true);
        assertEquals(dates[4].day, "Wed");
        assertEquals(dates[4].date, dateObject);
        checkRequired(dates[4], ["number", "current", "day", "date"]);
    });
    it("get_days for Feb 2021 non-leap year", async () => {
        const month = 1;
        const year = 2021;
        const dates = await crs.call("date", "get_days", {
            month: month,
            year: year,
            only_current: true
        });
        const dateObject = new Date(year, month, 6);

        assertEquals(dates[5].number, 6);
        assertEquals(dates[dates.length - 1].number, 28);
        assertEquals(dates.length, 28);
        assertEquals(dates[5].current, true);
        assertEquals(dates[5].day, "Sat");
        assertEquals(dates[5].date, dateObject);
        checkRequired(dates[5], ["number", "current", "day", "date"]);
    });
});

describe("get_year_range_by_offsets tests", () => {
    it("passing in ranges of  10 to see if it calculates 10 years forward and back from current year", async () => {
        // Arrange
        const minYearSelectOffset = 10;
        const maxYearSelectOffset = 10;

        // Act
        const range = await crs.call("date", "get_year_range_by_offsets", {
            minYearSelectOffset,
            maxYearSelectOffset
        });

        // Assert
        assertEquals(range[0], 2013);
        assertEquals(range.at(-1), 2033);
    });
    it("passing through a value of 0 to see if range ends on the current year", async () => {

        // Arrange
        const minYearSelectOffset = 20;
        const maxYearSelectOffset = 0;

        // Act
        const range = await crs.call("date", "get_year_range_by_offsets", {
            minYearSelectOffset,
            maxYearSelectOffset
        });

        // Assert
        assertEquals(range[0], 2003);
        assertEquals(range.at(-1), 2023);
    });

    it('passing through an empty min and max value', async () => {
        // Arrange
        const minYearSelectOffset = "";
        const maxYearSelectOffset = "";

        // Act
        const range = await crs.call("date", "get_year_range_by_offsets", {
            minYearSelectOffset,
            maxYearSelectOffset
        });

        // Assert
        assertEquals(range[0], 2023);
        assertEquals(range.at(-1), 2023);
    });

    it('passing value of type null', async () => {
        // Arrange
        const minYearSelectOffset = null;
        const maxYearSelectOffset = null;

        // Act
        const range = await crs.call("date", "get_year_range_by_offsets", {
            minYearSelectOffset,
            maxYearSelectOffset
        });

        // Assert
        assertEquals(range[0], 2023);
        assertEquals(range.at(-1), 2023);
    });
});

function checkRequired(item, properties) {
    for (const property of properties) {
        assert(item[property] != null);
    }
}