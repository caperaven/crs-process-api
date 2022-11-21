# Date
Date is very useful for getting the correct dates for the month and year.

## Actions
1. [get_days](#get_days)

## get_days

Returns an array of objects containing the days and additional information for a particular month in a specified year.


| property    | description               | required |
|:------------|:--------------------------| :--------: |
| month       | 0 to 11 integer value     | true |
| year        | (e.g. 2022) integer value | true |
| onlyCurrent | true/false                | true |

Depending on the value of onlyCurrent, if "onlyCurrent = true" the array returned will have a length of 
the number of days in a specific month excluding the previous and next months' dates, if "onlyCurrent  = false" the array returned
will have a length of 42, the number of days in a specific month including the previous and 
next months' dates.

**json**

{{< highlight js >}}
"step": {
"type": "date",
"action": "get_days",
"args": {
"month" : 9,
"year"  : 2022,
"only_current" : true
}
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("date", "get_days", {
"month" : 9,
"year"  : 2022,
"only_current" : false
});
{{< / highlight >}}
