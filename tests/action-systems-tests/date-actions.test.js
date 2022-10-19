import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/date-actions.js");
})

describe("date actions tests if only_current = false", () => {
    it("get_days for Oct 2022", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 9,
            year: 2022,
            only_current: false
        });

        const expectedDates = [
            {number: 25, current: false, day: "sun"}, {number: 26, current: false, day: "mon"},
            {number: 27, current: false, day: "tue"}, {number: 28, current: false, day: "wed"},
            {number: 29, current: false, day: "thu"}, {number: 30, current: false, day: "fri"},
            {number: 1, current: true, day: "sat"},
            {number: 2, current: true, day: "sun"}, {number: 3, current: true, day: "mon"},
            {number: 4, current: true, day: "tue"}, {number: 5, current: true, day: "wed"},
            {number: 6, current: true, day: "thu"}, {number: 7, current: true, day: "fri"},
            {number: 8, current: true, day: "sat"},
            {number: 9, current: true, day: "sun"}, {number: 10, current: true, day: "mon"},
            {number: 11, current: true, day: "tue"}, {number: 12, current: true, day: "wed"},
            {number: 13, current: true, day: "thu"}, {number: 14, current: true, day: "fri"},
            {number: 15, current: true, day: "sat"},
            {number: 16, current: true, day: "sun"}, {number: 17, current: true, day: "mon"},
            {number: 18, current: true, day: "tue"}, {number: 19, current: true, day: "wed"},
            {number: 20, current: true, day: "thu"}, {number: 21, current: true, day: "fri"},
            {number: 22, current: true, day: "sat"},
            {number: 23, current: true, day: "sun"}, {number: 24, current: true, day: "mon"},
            {number: 25, current: true, day: "tue"}, {number: 26, current: true, day: "wed"},
            {number: 27, current: true, day: "thu"}, {number: 28, current: true, day: "fri"},
            {number: 29, current: true, day: "sat"},
            {number: 30, current: true, day: "sun"}, {number: 31, current: true, day: "mon"},
            {number: 1, current: false, day: "tue"}, {number: 2, current: false, day: "wed"},
            {number: 3, current: false, day: "thu"}, {number: 4, current: false, day: "fri"},
            {number: 5, current: false, day: "sat"},
        ];

        assertEquals(dates,expectedDates);
    });
    it("get_days for Sep 2022", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 8,
            year: 2022,
            only_current: false
        });

        const expectedDates = [
            {number: 28, current: false, day: "sun"}, {number: 29, current: false, day: "mon"},
            {number: 30, current: false, day: "tue"}, {number: 31, current: false, day: "wed"},
            {number: 1, current: true, day: "thu"}, {number: 2, current: true, day: "fri"},
            {number: 3, current: true, day: "sat"},
            {number: 4, current: true, day: "sun"}, {number: 5, current: true, day: "mon"},
            {number: 6, current: true, day: "tue"}, {number: 7, current: true, day: "wed"},
            {number: 8, current: true, day: "thu"}, {number: 9, current: true, day: "fri"},
            {number: 10, current: true, day: "sat"},
            {number: 11, current: true, day: "sun"}, {number: 12, current: true, day: "mon"},
            {number: 13, current: true, day: "tue"}, {number: 14, current: true, day: "wed"},
            {number: 15, current: true, day: "thu"}, {number: 16, current: true, day: "fri"},
            {number: 17, current: true, day: "sat"},
            {number: 18, current: true, day: "sun"}, {number: 19, current: true, day: "mon"},
            {number: 20, current: true, day: "tue"}, {number: 21, current: true, day: "wed"},
            {number: 22, current: true, day: "thu"}, {number: 23, current: true, day: "fri"},
            {number: 24, current: true, day: "sat"},
            {number: 25, current: true, day: "sun"}, {number: 26, current: true, day: "mon"},
            {number: 27, current: true, day: "tue"}, {number: 28, current: true, day: "wed"},
            {number: 29, current: true, day: "thu"}, {number: 30, current: true, day: "fri"},
            {number: 1, current: false, day: "sat"},
            {number: 2, current: false, day: "sun"}, {number: 3, current: false, day: "mon"},
            {number: 4, current: false, day: "tue"}, {number: 5, current: false, day: "wed"},
            {number: 6, current: false, day: "thu"}, {number: 7, current: false, day: "fri"},
            {number: 8, current: false, day: "sat"},
        ];

        assertEquals(dates,expectedDates);
    });

    it("get_days for feb 2020 leap year", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 1,
            year: 2020,
            only_current: false
        });

        const expectedDates = [
            {number: 26, current: false, day: "sun"}, {number: 27, current: false, day: "mon"},
            {number: 28, current: false, day: "tue"}, {number: 29, current: false, day: "wed"},
            {number: 30, current: false, day: "thu"}, {number: 31, current: false, day: "fri"},
            {number: 1, current: true, day: "sat"},
            {number: 2, current: true, day: "sun"}, {number: 3, current: true, day: "mon"},
            {number: 4, current: true, day: "tue"}, {number: 5, current: true, day: "wed"},
            {number: 6, current: true, day: "thu"}, {number: 7, current: true, day: "fri"},
            {number: 8, current: true, day: "sat"},
            {number: 9, current: true, day: "sun"}, {number: 10, current: true, day: "mon"},
            {number: 11, current: true, day: "tue"}, {number: 12, current: true, day: "wed"},
            {number: 13, current: true, day: "thu"}, {number: 14, current: true, day: "fri"},
            {number: 15, current: true, day: "sat"},
            {number: 16, current: true, day: "sun"}, {number: 17, current: true, day: "mon"},
            {number: 18, current: true, day: "tue"}, {number: 19, current: true, day: "wed"},
            {number: 20, current: true, day: "thu"}, {number: 21, current: true, day: "fri"},
            {number: 22, current: true, day: "sat"},
            {number: 23, current: true, day: "sun"}, {number: 24, current: true, day: "mon"},
            {number: 25, current: true, day: "tue"}, {number: 26, current: true, day: "wed"},
            {number: 27, current: true, day: "thu"}, {number: 28, current: true, day: "fri"},
            {number: 29, current: true, day: "sat"},
            {number: 1, current: false, day: "sun"},  {number: 2, current: false, day: "mon"},
            {number: 3, current: false, day: "tue"}, {number: 4, current: false, day: "wed"},
            {number: 5, current: false, day: "thu"}, {number: 6, current: false, day: "fri"},
            {number: 7, current: false, day: "sat"},
        ];

        assertEquals(dates, expectedDates);
    });
    it("get_days for feb 2021 non-leap year", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 1,
            year: 2021,
            only_current: false
        });

        const expectedDates = [
            {number: 31, current: false, day: "sun"}, {number: 1, current: true, day: "mon"},
            {number: 2, current: true, day: "tue"}, {number: 3, current: true, day: "wed"},
            {number: 4, current: true, day: "thu"}, {number: 5, current: true, day: "fri"},
            {number: 6, current: true, day: "sat"},
            {number: 7, current: true, day: "sun"}, {number: 8, current: true, day: "mon"},
            {number: 9, current: true, day: "tue"}, {number: 10, current: true, day: "wed"},
            {number: 11, current: true, day: "thu"}, {number: 12, current: true, day: "fri"},
            {number: 13, current: true, day: "sat"},
            {number: 14, current: true, day: "sun"}, {number: 15, current: true, day: "mon"},
            {number: 16, current: true, day: "tue"}, {number: 17, current: true, day: "wed"},
            {number: 18, current: true, day: "thu"}, {number: 19, current: true, day: "fri"},
            {number: 20, current: true, day: "sat"},
            {number: 21, current: true, day: "sun"}, {number: 22, current: true, day: "mon"},
            {number: 23, current: true, day: "tue"}, {number: 24, current: true, day: "wed"},
            {number: 25, current: true, day: "thu"}, {number: 26, current: true, day: "fri"},
            {number: 27, current: true, day: "sat"},
            {number: 28, current: true, day: "sun"}, {number: 1, current: false, day: "mon"},
            {number: 2, current: false, day: "tue"}, {number: 3, current: false, day: "wed"},
            {number: 4, current: false, day: "thu"}, {number: 5, current: false, day: "fri"},
            {number: 6, current: false, day: "sat"},
            {number: 7, current: false, day: "sun"},  {number: 8, current: false, day: "mon"},
            {number: 9, current: false, day: "tue"}, {number: 10, current: false, day: "wed"},
            {number: 11, current: false, day: "thu"}, {number: 12, current: false, day: "fri"},
            {number: 13, current: false, day: "sat"},
        ];

        assertEquals(dates, expectedDates);
    });
});

describe("date actions tests if only_current = true", () => {
    it("get_days for Oct 2022", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 9,
            year: 2022,
            only_current: true
        });

        const expectedDates = [
            {number: 1, current: true, day: "sat"}, {number: 2, current: true, day: "sun"},
            {number: 3, current: true, day: "mon"}, {number: 4, current: true, day: "tue"},
            {number: 5, current: true, day: "wed"}, {number: 6, current: true, day: "thu"},
            {number: 7, current: true, day: "fri"}, {number: 8, current: true, day: "sat"},
            {number: 9, current: true, day: "sun"}, {number: 10, current: true, day: "mon"},
            {number: 11, current: true, day: "tue"}, {number: 12, current: true, day: "wed"},
            {number: 13, current: true, day: "thu"}, {number: 14, current: true, day: "fri"},
            {number: 15, current: true, day: "sat"}, {number: 16, current: true, day: "sun"},
            {number: 17, current: true, day: "mon"}, {number: 18, current: true, day: "tue"},
            {number: 19, current: true, day: "wed"}, {number: 20, current: true, day: "thu"},
            {number: 21, current: true, day: "fri"}, {number: 22, current: true, day: "sat"},
            {number: 23, current: true, day: "sun"}, {number: 24, current: true, day: "mon"},
            {number: 25, current: true, day: "tue"}, {number: 26, current: true, day: "wed"},
            {number: 27, current: true, day: "thu"}, {number: 28, current: true, day: "fri"},
            {number: 29, current: true, day: "sat"}, {number: 30, current: true, day: "sun"},
            {number: 31, current: true, day: "mon"}
        ];

        assertEquals(dates,expectedDates);
    });
    it("get_days for Sep 2022", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 8,
            year: 2022,
            only_current: true
        });

        const expectedDates = [
            {number: 1, current: true, day: "thu"}, {number: 2, current: true, day: "fri"},
            {number: 3, current: true, day: "sat"}, {number: 4, current: true, day: "sun"},
            {number: 5, current: true, day: "mon"}, {number: 6, current: true, day: "tue"},
            {number: 7, current: true, day: "wed"}, {number: 8, current: true, day: "thu"},
            {number: 9, current: true, day: "fri"}, {number: 10, current: true, day: "sat"},
            {number: 11, current: true, day: "sun"}, {number: 12, current: true, day: "mon"},
            {number: 13, current: true, day: "tue"}, {number: 14, current: true, day: "wed"},
            {number: 15, current: true, day: "thu"}, {number: 16, current: true, day: "fri"},
            {number: 17, current: true, day: "sat"}, {number: 18, current: true, day: "sun"},
            {number: 19, current: true, day: "mon"}, {number: 20, current: true, day: "tue"},
            {number: 21, current: true, day: "wed"}, {number: 22, current: true, day: "thu"},
            {number: 23, current: true, day: "fri"}, {number: 24, current: true, day: "sat"},
            {number: 25, current: true, day: "sun"}, {number: 26, current: true, day: "mon"},
            {number: 27, current: true, day: "tue"}, {number: 28, current: true, day: "wed"},
            {number: 29, current: true, day: "thu"}, {number: 30, current: true, day: "fri"},
        ];

        assertEquals(dates,expectedDates);
    });

    it("get_days for feb 2020 leap year", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 1,
            year: 2020,
            only_current: true
        });

        const expectedDates = [
            {number: 1, current: true, day: "sat"}, {number: 2, current: true, day: "sun"},
            {number: 3, current: true, day: "mon"}, {number: 4, current: true, day: "tue"},
            {number: 5, current: true, day: "wed"}, {number: 6, current: true, day: "thu"},
            {number: 7, current: true, day: "fri"}, {number: 8, current: true, day: "sat"},
            {number: 9, current: true, day: "sun"}, {number: 10, current: true, day: "mon"},
            {number: 11, current: true, day: "tue"}, {number: 12, current: true, day: "wed"},
            {number: 13, current: true, day: "thu"}, {number: 14, current: true, day: "fri"},
            {number: 15, current: true, day: "sat"}, {number: 16, current: true, day: "sun"},
            {number: 17, current: true, day: "mon"}, {number: 18, current: true, day: "tue"},
            {number: 19, current: true, day: "wed"}, {number: 20, current: true, day: "thu"},
            {number: 21, current: true, day: "fri"}, {number: 22, current: true, day: "sat"},
            {number: 23, current: true, day: "sun"}, {number: 24, current: true, day: "mon"},
            {number: 25, current: true, day: "tue"}, {number: 26, current: true, day: "wed"},
            {number: 27, current: true, day: "thu"}, {number: 28, current: true, day: "fri"},
            {number: 29, current: true, day: "sat"}
        ];

        assertEquals(dates, expectedDates);
    });
    it("get_days for feb 2021 non-leap year", async () => {
        const dates = await crs.call("dates", "get_days", {
            month: 1,
            year: 2021,
            only_current: true
        });

        const expectedDates = [
            {number: 1, current: true, day: "mon"}, {number: 2, current: true, day: "tue"},
            {number: 3, current: true, day: "wed"}, {number: 4, current: true, day: "thu"},
            {number: 5, current: true, day: "fri"}, {number: 6, current: true, day: "sat"},
            {number: 7, current: true, day: "sun"}, {number: 8, current: true, day: "mon"},
            {number: 9, current: true, day: "tue"}, {number: 10, current: true, day: "wed"},
            {number: 11, current: true, day: "thu"}, {number: 12, current: true, day: "fri"},
            {number: 13, current: true, day: "sat"}, {number: 14, current: true, day: "sun"},
            {number: 15, current: true, day: "mon"}, {number: 16, current: true, day: "tue"},
            {number: 17, current: true, day: "wed"}, {number: 18, current: true, day: "thu"},
            {number: 19, current: true, day: "fri"}, {number: 20, current: true, day: "sat"},
            {number: 21, current: true, day: "sun"}, {number: 22, current: true, day: "mon"},
            {number: 23, current: true, day: "tue"}, {number: 24, current: true, day: "wed"},
            {number: 25, current: true, day: "thu"}, {number: 26, current: true, day: "fri"},
            {number: 27, current: true, day: "sat"}, {number: 28, current: true, day: "sun"},
        ]

        assertEquals(dates, expectedDates);
    });
});