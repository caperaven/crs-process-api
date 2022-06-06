# String

Functions that help you interact with strings

## Actions

1. [inflate](#inflate)
2. [to_array](#to_array)
3. [from_array](#from_array)
4. [replace](#replace)

## inflate

Considering the following string examples, inflate the strings with values.

***templates example***
{{< highlight js >}}
const str1 = "#input/${id}?type='tasks'&typeId='${typeId}'";
const str2 = "${firstName} ${lastName} = ${age} old";
{{< / highlight >}}

**properties**

| property   | description                                           | required |
|:-----------|:------------------------------------------------------|:--------:|
| template   | string that contains the inflation markers            |   true   |
| parameters | object who's properties will be used in the inflation |   true   |
| target     | where the inflated string must be copied too          |  false   |

***json***
{{< highlight js >}}
{
    "type": "string",
    "action": "inflate",
    "args": {
        "template": "#input/${id}?type='tasks'&typeId='${typeId}'",
        "parameters": {
            "id": 100,
            "typeId": "$context.typeId"
        },
        "target": "$context.result"
    }
}
{{< / highlight >}}

***js***
{{< highlight js >}}
const inflated = crs.call("string", "inflate", {
    "template": "#input/${id}?type='tasks'&typeId='${typeId}'",
    "parameters": {
        "id": 100,
        "typeId": "$context.typeId"
    }
}, context)
{{< / highlight >}}

## to_array

This is a feature geared towards schemas.  
This provides you with the string split function.    
In coding, rather just use the string split function.   
This function will return an array

**properties**

| property | description                                  | required |
|:---------|:---------------------------------------------|:--------:|
| source   | string to split                              |   true   |
| pattern  | pattern char to do the split on              |   true   |
| target   | where the inflated string must be copied too |  false   |

***json***
{{< highlight js >}}
{
    "type": "string",
    "action": "to_array",
    "args": {
        "source": "$context.value",
        "pattern": ",",
        "target": "$context.target"
    }
}
{{< / highlight >}}

## from_array

This is the opposite of to_array where you start with an array but get a string back.  
This provides you with the join ability.

**properties**

| property   | description                           | required | default |
|:-----------|:--------------------------------------|:--------:|:--------|
| source     | array of values                       |   true   |         |
| separator  | char used in joining the array values |   true   | ""      |
| target     | where the string must be copied too   |  false   |         | 

***json***
{{< highlight js >}}
{
    "type": "string",
    "action": "from_array",
    "args": {
        "source": "$context.value",
        "separator": ",",
        "target": "$context.target"
    }
}
{{< / highlight >}}

The above example will return a comma seperated string based on the array values.

## replace

Given a string, replace string values based on the pattern defined.  
This function will replace all instances of the pattern found.

**properties**

| property | description                         | required |
|:---------|:------------------------------------|:--------:|
| source   | array of values                     |   true   | 
| pattern  | pattern to search for               |   true   | 
| value    | where the string must be copied too |   true   |     

***json***

{{< highlight js >}}
{
    "type": "string",
    "action": "replace",
    "args": {
        "source": "$context.value",
        "pattern": "old",
        "value": "new"
    }
}
{{< / highlight >}}

***js***

{{< highlight js >}}
const newValue = crs.call("string", "replace", {
    "source": "hello old world",
    "pattern": "old",
    "value": "new"
})
{{< / highlight >}}
