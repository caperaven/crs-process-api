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
            {number: 25, current: false, day: "Sun"}, {number: 26, current: false, day: "Mon"},
            {number: 27, current: false, day: "Tue"}, {number: 28, current: false, day: "Wed"},
            {number: 29, current: false, day: "Thu"}, {number: 30, current: false, day: "Fri"},
            {number: 1, current: true, day: "Sat"},
            {number: 2, current: true, day: "Sun"}, {number: 3, current: true, day: "Mon"},
            {number: 4, current: true, day: "Tue"}, {number: 5, current: true, day: "Wed"},
            {number: 6, current: true, day: "Thu"}, {number: 7, current: true, day: "Fri"},
            {number: 8, current: true, day: "Sat"},
            {number: 9, current: true, day: "Sun"}, {number: 10, current: true, day: "Mon"},
            {number: 11, current: true, day: "Tue"}, {number: 12, current: true, day: "Wed"},
            {number: 13, current: true, day: "Thu"}, {number: 14, current: true, day: "Fri"},
            {number: 15, current: true, day: "Sat"},
            {number: 16, current: true, day: "Sun"}, {number: 17, current: true, day: "Mon"},
            {number: 18, current: true, day: "Tue"}, {number: 19, current: true, day: "Wed"},
            {number: 20, current: true, day: "Thu"}, {number: 21, current: true, day: "Fri"},
            {number: 22, current: true, day: "Sat"},
            {number: 23, current: true, day: "Sun"}, {number: 24, current: true, day: "Mon"},
            {number: 25, current: true, day: "Tue"}, {number: 26, current: true, day: "Wed"},
            {number: 27, current: true, day: "Thu"}, {number: 28, current: true, day: "Fri"},
            {number: 29, current: true, day: "Sat"},
            {number: 30, current: true, day: "Sun"}, {number: 31, current: true, day: "Mon"},
            {number: 1, current: false, day: "Tue"}, {number: 2, current: false, day: "Wed"},
            {number: 3, current: false, day: "Thu"}, {number: 4, current: false, day: "Fri"},
            {number: 5, current: false, day: "Sat"},
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
            {number: 28, current: false, day: "Sun"}, {number: 29, current: false, day: "Mon"},
            {number: 30, current: false, day: "Tue"}, {number: 31, current: false, day: "Wed"},
            {number: 1, current: true, day: "Thu"}, {number: 2, current: true, day: "Fri"},
            {number: 3, current: true, day: "Sat"},
            {number: 4, current: true, day: "Sun"}, {number: 5, current: true, day: "Mon"},
            {number: 6, current: true, day: "Tue"}, {number: 7, current: true, day: "Wed"},
            {number: 8, current: true, day: "Thu"}, {number: 9, current: true, day: "Fri"},
            {number: 10, current: true, day: "Sat"},
            {number: 11, current: true, day: "Sun"}, {number: 12, current: true, day: "Mon"},
            {number: 13, current: true, day: "Tue"}, {number: 14, current: true, day: "Wed"},
            {number: 15, current: true, day: "Thu"}, {number: 16, current: true, day: "Fri"},
            {number: 17, current: true, day: "Sat"},
            {number: 18, current: true, day: "Sun"}, {number: 19, current: true, day: "Mon"},
            {number: 20, current: true, day: "Tue"}, {number: 21, current: true, day: "Wed"},
            {number: 22, current: true, day: "Thu"}, {number: 23, current: true, day: "Fri"},
            {number: 24, current: true, day: "Sat"},
            {number: 25, current: true, day: "Sun"}, {number: 26, current: true, day: "Mon"},
            {number: 27, current: true, day: "Tue"}, {number: 28, current: true, day: "Wed"},
            {number: 29, current: true, day: "Thu"}, {number: 30, current: true, day: "Fri"},
            {number: 1, current: false, day: "Sat"},
            {number: 2, current: false, day: "Sun"}, {number: 3, current: false, day: "Mon"},
            {number: 4, current: false, day: "Tue"}, {number: 5, current: false, day: "Wed"},
            {number: 6, current: false, day: "Thu"}, {number: 7, current: false, day: "Fri"},
            {number: 8, current: false, day: "Sat"},
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
            {number: 26, current: false, day: "Sun"}, {number: 27, current: false, day: "Mon"},
            {number: 28, current: false, day: "Tue"}, {number: 29, current: false, day: "Wed"},
            {number: 30, current: false, day: "Thu"}, {number: 31, current: false, day: "Fri"},
            {number: 1, current: true, day: "Sat"},
            {number: 2, current: true, day: "Sun"}, {number: 3, current: true, day: "Mon"},
            {number: 4, current: true, day: "Tue"}, {number: 5, current: true, day: "Wed"},
            {number: 6, current: true, day: "Thu"}, {number: 7, current: true, day: "Fri"},
            {number: 8, current: true, day: "Sat"},
            {number: 9, current: true, day: "Sun"}, {number: 10, current: true, day: "Mon"},
            {number: 11, current: true, day: "Tue"}, {number: 12, current: true, day: "Wed"},
            {number: 13, current: true, day: "Thu"}, {number: 14, current: true, day: "Fri"},
            {number: 15, current: true, day: "Sat"},
            {number: 16, current: true, day: "Sun"}, {number: 17, current: true, day: "Mon"},
            {number: 18, current: true, day: "Tue"}, {number: 19, current: true, day: "Wed"},
            {number: 20, current: true, day: "Thu"}, {number: 21, current: true, day: "Fri"},
            {number: 22, current: true, day: "Sat"},
            {number: 23, current: true, day: "Sun"}, {number: 24, current: true, day: "Mon"},
            {number: 25, current: true, day: "Tue"}, {number: 26, current: true, day: "Wed"},
            {number: 27, current: true, day: "Thu"}, {number: 28, current: true, day: "Fri"},
            {number: 29, current: true, day: "Sat"},
            {number: 1, current: false, day: "Sun"},  {number: 2, current: false, day: "Mon"},
            {number: 3, current: false, day: "Tue"}, {number: 4, current: false, day: "Wed"},
            {number: 5, current: false, day: "Thu"}, {number: 6, current: false, day: "Fri"},
            {number: 7, current: false, day: "Sat"},
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
            {number: 31, current: false, day: "Sun"}, {number: 1, current: true, day: "Mon"},
            {number: 2, current: true, day: "Tue"}, {number: 3, current: true, day: "Wed"},
            {number: 4, current: true, day: "Thu"}, {number: 5, current: true, day: "Fri"},
            {number: 6, current: true, day: "Sat"},
            {number: 7, current: true, day: "Sun"}, {number: 8, current: true, day: "Mon"},
            {number: 9, current: true, day: "Tue"}, {number: 10, current: true, day: "Wed"},
            {number: 11, current: true, day: "Thu"}, {number: 12, current: true, day: "Fri"},
            {number: 13, current: true, day: "Sat"},
            {number: 14, current: true, day: "Sun"}, {number: 15, current: true, day: "Mon"},
            {number: 16, current: true, day: "Tue"}, {number: 17, current: true, day: "Wed"},
            {number: 18, current: true, day: "Thu"}, {number: 19, current: true, day: "Fri"},
            {number: 20, current: true, day: "Sat"},
            {number: 21, current: true, day: "Sun"}, {number: 22, current: true, day: "Mon"},
            {number: 23, current: true, day: "Tue"}, {number: 24, current: true, day: "Wed"},
            {number: 25, current: true, day: "Thu"}, {number: 26, current: true, day: "Fri"},
            {number: 27, current: true, day: "Sat"},
            {number: 28, current: true, day: "Sun"}, {number: 1, current: false, day: "Mon"},
            {number: 2, current: false, day: "Tue"}, {number: 3, current: false, day: "Wed"},
            {number: 4, current: false, day: "Thu"}, {number: 5, current: false, day: "Fri"},
            {number: 6, current: false, day: "Sat"},
            {number: 7, current: false, day: "Sun"},  {number: 8, current: false, day: "Mon"},
            {number: 9, current: false, day: "Tue"}, {number: 10, current: false, day: "Wed"},
            {number: 11, current: false, day: "Thu"}, {number: 12, current: false, day: "Fri"},
            {number: 13, current: false, day: "Sat"},
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
            {number: 1, current: true, day: "Sat"}, {number: 2, current: true, day: "Sun"},
            {number: 3, current: true, day: "Mon"}, {number: 4, current: true, day: "Tue"},
            {number: 5, current: true, day: "Wed"}, {number: 6, current: true, day: "Thu"},
            {number: 7, current: true, day: "Fri"}, {number: 8, current: true, day: "Sat"},
            {number: 9, current: true, day: "Sun"}, {number: 10, current: true, day: "Mon"},
            {number: 11, current: true, day: "Tue"}, {number: 12, current: true, day: "Wed"},
            {number: 13, current: true, day: "Thu"}, {number: 14, current: true, day: "Fri"},
            {number: 15, current: true, day: "Sat"}, {number: 16, current: true, day: "Sun"},
            {number: 17, current: true, day: "Mon"}, {number: 18, current: true, day: "Tue"},
            {number: 19, current: true, day: "Wed"}, {number: 20, current: true, day: "Thu"},
            {number: 21, current: true, day: "Fri"}, {number: 22, current: true, day: "Sat"},
            {number: 23, current: true, day: "Sun"}, {number: 24, current: true, day: "Mon"},
            {number: 25, current: true, day: "Tue"}, {number: 26, current: true, day: "Wed"},
            {number: 27, current: true, day: "Thu"}, {number: 28, current: true, day: "Fri"},
            {number: 29, current: true, day: "Sat"}, {number: 30, current: true, day: "Sun"},
            {number: 31, current: true, day: "Mon"}
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
            {number: 1, current: true, day: "Thu"}, {number: 2, current: true, day: "Fri"},
            {number: 3, current: true, day: "Sat"}, {number: 4, current: true, day: "Sun"},
            {number: 5, current: true, day: "Mon"}, {number: 6, current: true, day: "Tue"},
            {number: 7, current: true, day: "Wed"}, {number: 8, current: true, day: "Thu"},
            {number: 9, current: true, day: "Fri"}, {number: 10, current: true, day: "Sat"},
            {number: 11, current: true, day: "Sun"}, {number: 12, current: true, day: "Mon"},
            {number: 13, current: true, day: "Tue"}, {number: 14, current: true, day: "Wed"},
            {number: 15, current: true, day: "Thu"}, {number: 16, current: true, day: "Fri"},
            {number: 17, current: true, day: "Sat"}, {number: 18, current: true, day: "Sun"},
            {number: 19, current: true, day: "Mon"}, {number: 20, current: true, day: "Tue"},
            {number: 21, current: true, day: "Wed"}, {number: 22, current: true, day: "Thu"},
            {number: 23, current: true, day: "Fri"}, {number: 24, current: true, day: "Sat"},
            {number: 25, current: true, day: "Sun"}, {number: 26, current: true, day: "Mon"},
            {number: 27, current: true, day: "Tue"}, {number: 28, current: true, day: "Wed"},
            {number: 29, current: true, day: "Thu"}, {number: 30, current: true, day: "Fri"},
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
            {number: 1, current: true, day: "Sat"}, {number: 2, current: true, day: "Sun"},
            {number: 3, current: true, day: "Mon"}, {number: 4, current: true, day: "Tue"},
            {number: 5, current: true, day: "Wed"}, {number: 6, current: true, day: "Thu"},
            {number: 7, current: true, day: "Fri"}, {number: 8, current: true, day: "Sat"},
            {number: 9, current: true, day: "Sun"}, {number: 10, current: true, day: "Mon"},
            {number: 11, current: true, day: "Tue"}, {number: 12, current: true, day: "Wed"},
            {number: 13, current: true, day: "Thu"}, {number: 14, current: true, day: "Fri"},
            {number: 15, current: true, day: "Sat"}, {number: 16, current: true, day: "Sun"},
            {number: 17, current: true, day: "Mon"}, {number: 18, current: true, day: "Tue"},
            {number: 19, current: true, day: "Wed"}, {number: 20, current: true, day: "Thu"},
            {number: 21, current: true, day: "Fri"}, {number: 22, current: true, day: "Sat"},
            {number: 23, current: true, day: "Sun"}, {number: 24, current: true, day: "Mon"},
            {number: 25, current: true, day: "Tue"}, {number: 26, current: true, day: "Wed"},
            {number: 27, current: true, day: "Thu"}, {number: 28, current: true, day: "Fri"},
            {number: 29, current: true, day: "Sat"}
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
            {number: 1, current: true, day: "Mon"}, {number: 2, current: true, day: "Tue"},
            {number: 3, current: true, day: "Wed"}, {number: 4, current: true, day: "Thu"},
            {number: 5, current: true, day: "Fri"}, {number: 6, current: true, day: "Sat"},
            {number: 7, current: true, day: "Sun"}, {number: 8, current: true, day: "Mon"},
            {number: 9, current: true, day: "Tue"}, {number: 10, current: true, day: "Wed"},
            {number: 11, current: true, day: "Thu"}, {number: 12, current: true, day: "Fri"},
            {number: 13, current: true, day: "Sat"}, {number: 14, current: true, day: "Sun"},
            {number: 15, current: true, day: "Mon"}, {number: 16, current: true, day: "Tue"},
            {number: 17, current: true, day: "Wed"}, {number: 18, current: true, day: "Thu"},
            {number: 19, current: true, day: "Fri"}, {number: 20, current: true, day: "Sat"},
            {number: 21, current: true, day: "Sun"}, {number: 22, current: true, day: "Mon"},
            {number: 23, current: true, day: "Tue"}, {number: 24, current: true, day: "Wed"},
            {number: 25, current: true, day: "Thu"}, {number: 26, current: true, day: "Fri"},
            {number: 27, current: true, day: "Sat"}, {number: 28, current: true, day: "Sun"},
        ]

        assertEquals(dates, expectedDates);
    });
});