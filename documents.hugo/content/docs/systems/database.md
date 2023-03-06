# Database

Working with IndexDB.
There are a number of components that render themselves from data. 
This data can be in memory, or it can be in indexDB.
There is a particular way how the IndexDB works, and you should take note of it.

The store has key and value fields.
The key field is also the index of the row in the table.
Most all render from store is done using the indexes, that is why the key is the record index.

When you open a database, the db instance passed to you has operational functions you can use for crud operations.
The process api calls are mostly there for when you call the indexdb functions in a json process.  
You can evaluate the instance for its details.  
For best practice I would recommend just using the process api system to keep things consistent.

## Actions

1. [add](#open)
2. [delete](#delete)
3. [delete_old](#delete_old)
4. [close](#close)
5. [dump](#dump)
6. [get_from_index](#get_from_index)
7. [get_all](#get_all)
8. [clear](#clear)
9. [delete_record](#delete_record)
10. [update_record](#update_record)
11. [add_record](#add_record)
12. [get_batch](#get_batch)
13. [get_values](#get_values)
14. [calculate_paging](#calculate_paging)
15. [get_page](#get_page)
16. [get_range](#get_range)

## open
Create a database object.  
In this process the database and tables are created.    

**properties**

| property      | description | required | default |
|:--------------| :---------- | :--------: | :---------- |
| name          | database name         | true |
| version       | version of database   | false | 1 |
| tables        | what tables to create | true |
| add_timestamp | should the time stamp be used in the name | false | false |
| target        | where to copy the database class instance | false |

The "tables" property is an object where the property name is the table name and the body is the properties.

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "open",
    "args": {
        "name": "data",
        "version": 1,
        "tables": {
            "data": {
                "indexes": {
                    "id": { unique: true }    
                }
            }
        },
        "add_timestamp": true
        "target": "$context.db"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
...
tablesDef["data"] = {
    indexes: {
        id: { unique: true }
    }
};

const db = await crs.call("db", "open", {
    name: dbName,
    version: 1,
    tables: tablesDef,
    add_timestamp: true
})
{{< / highlight >}}

## delete

Delete a IndexDB database

| property      | description | required |
|:--------------| :----------       | :--------: |
| name          | database name     | true |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "delete",
    "args": {
        "name": "data",
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const db = await crs.call("db", "delete", {
    name: "data"
})
{{< / highlight >}}

## delete_old

Delete all databases older than the defined days.  
Use fractions for hours or minutes.

| property | description                                 | required |
|:---------|:--------------------------------------------| :--------: |
| days     | number of days before deleting the database | true |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "delete_old",
    "args": {
        "days": 1,
    }
}
{{< / highlight >}}


**javascript**
{{< highlight js >}}
crs.call("db", "delete_old", {days: 1})
{{< /highlight >}}

## close

Close the database connection to the indexdb database instance.  
For this you will need to pass in the db object created during the open operation.  
You could also just call the close action directly on the instance but if you are doing this as part of a process, this makes it a bit easier.

| property | description       | required |
|:---------|:------------------| :--------: |
| db       | index db instance | true |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "close",
    "args": {
        "db": "$context.db",
    }
}
{{< / highlight >}}

**javascript**
{{< highlight js >}}
crs.call("db", "close", {db: instance})
{{< /highlight >}}

## dump

This function does a data dump of records to a data store for a given record set.
The db passed in is an open database, so you should use open before calling this. 

| property | description                          | required |
|:---------|:-------------------------------------| :--------: |
| db       | index db instance                    | true |
| store    | table name to add the records too    | true |
| records  | array of objects to add to the store | true |

During this process each record is added an "__ind" is added to the record indicating what index in the db it is on.
This speeds things up from a development perspective to say get me the next batch from this record forward.

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "dump",
    "args": {
        "db": "$context.db",
        "store": "data",
        "records": "$context.records"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("db", "close", {
    db: instance, 
    store: "db", 
    records: [...]
})
{{< /highlight >}}


## get_from_index

This function will get you a set of records based on a number array of key values.  
Since the key is the index of the record, this means you will send an array of indexes to fetch a batch of records.  
The values do not have to be in sequence, rather the items you want in the order that you want them.

This will return an array of records for the items found in the database.

| property | description                                   | required |
|:---------|:----------------------------------------------|:--------:|
| db       | index db instance                             |   true   |
| store    | table name to add the records too             |   true   |
| keys     | array indexes to get                          |   true   |
| target   | where do you want the result to be copied too |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "get_from_index,
    "args": {
        "db": "$context.db",
        "store": "data",
        "keys": [0, 1, 2, 3, 10]
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("db", "get_from_index", {
    db: instance, 
    store: "db", 
    keys: [...]
});
{{< /highlight >}}

## get_all

This function gets all the records in the table and returns it to you.

| property | description                                   | required |
|:---------|:----------------------------------------------|:--------:|
| db       | index db instance                             |   true   |
| store    | table name to add the records too             |   true   |
| target   | where do you want the result to be copied too |  false   |


**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "get_all,
    "args": {
        "db": "$context.db",
        "store": "data"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const result = crs.call("db", "get_all", {db: instance, store: "db"});
{{< /highlight >}}

## clear

Clear a given store on an already open indexdb instance, removing all records from that store.
You can also call the clear function directly on the db instance.

| property | description                                   | required |
|:---------|:----------------------------------------------|:--------:|
| db       | index db instance                             |   true   |
| store    | table name to add the records too             |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "clear,
    "args": {
        "db": "$context.db",
        "store": "data"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("db", "clear", {db: instance, store: "db"});
{{< /highlight >}}

## delete_record

For a given set of key, remove the records from the store.

| property | description                                | required |
|:---------|:-------------------------------------------|:--------:|
| db       | index db instance                          |   true   |
| store    | table name to add the records too          |   true   |
| key      | key value of the record you want to delete |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "delete_record,
    "args": {
        "db": "$context.db",
        "store": "data",
        "key": 0
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("db", "delete_record", {db: instance, store: "db", key: 0});
{{< /highlight >}}

## update_record

For a given key, replace the row object.

| property | description                                | required |
|:---------|:-------------------------------------------|:--------:|
| db       | index db instance                          |   true   |
| store    | table name to add the records too          |   true   |
| key      | key value of the record you want to delete |   true   |
| model    | new row object                             |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "update_record,
    "args": {
        "db": "$context.db",
        "store": "data",
        "key": 0,
        "model": "$context.newModel"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("db", "update_record", {
    db: instance, 
    store: "db", 
    key: 0, 
    model: {...}
});
{{< /highlight >}}

## add_record

Add a new record object to the defined indexdb store

| property | description                                | required |
|:---------|:-------------------------------------------|:--------:|
| db       | index db instance                          |   true   |
| store    | table name to add the records too          |   true   |
| model    | new row object                             |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "add_record,
    "args": {
        "db": "$context.db",
        "store": "data",
        "model": "$context.newModel"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
crs.call("db", "add_record", {
    db: instance, 
    store: "db", 
    model: {...}
});
{{< /highlight >}}

## get_batch

This function gets a batch of records starting at the start index to the end index and everything between.

| property | description                       | required |
|:---------|:----------------------------------|:--------:|
| db       | index db instance                 |   true   |
| store    | table name to add the records too |   true   |
| start    | start index                       |   true   |
| end      | end index                         |   true   |
| target   | where to copy the results         |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "get_batch,
    "args": {
        "db": "$context.db",
        "store": "data",
        "start": 0,
        "end": 10,
        "target": "$context.records"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const results = crs.call("db", "get_batch", {
    db: instance, 
    store: "db", 
    start: 0, 
    end: 10
});
{{< /highlight >}}

## get_values

For a given set of keys, I want to fetch a custom object structure that only contains the properties I have defined.
This allows you to fetch a subset of what is stored and limit the amount of memory you use.

| property | description                          | required |
|:---------|:-------------------------------------|:--------:|
| db       | index db instance                    |   true   |
| store    | table name to add the records too    |   true   |
| keys     | array of key values                  |   true   |
| fields   | array of strings defining the fields |   true   |
| target   | where to copy the results            |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "get_values,
    "args": {
        "db": "$context.db",
        "store": "data",
        "keys": [0, 1, 2, 3],
        "fields": ["id", "code", "description"],
        "target": "$context.records"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const results = crs.call("db", "get_values", {
    db: instance, 
    store: "db", 
    keys: [0, 1, 2, 3], 
    fields: ["id", "code", "description"]
});
{{< /highlight >}}

## calculate_paging

This function looks at a defined store and lets you know how many pages it contains based on the page size defined.
It returns a object literal that contains two properties.

1. record_count
2. page_count

| property | description                          | required |
|:---------|:-------------------------------------|:--------:|
| db       | index db instance                    |   true   |
| store    | table name to add the records too    |   true   |
| page_size | how big is a page                    |   true   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "get_values,
    "args": {
        "db": "$context.db",
        "store": "data",
        "page_size": 10
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const results = crs.call("db", "get_values", {
    db: instance,
    store: "db",
    page_size: 10
});
{{< /highlight >}}

## get_page

Based on the page number and page size, get me the records for that page.  
Use "calculate_paging" to determine the number of pages so you don't go over.
You can also define what fields to return but if you leave that out, the entire record will be returned.

| property    | description                          | required |
|:------------|:-------------------------------------|:--------:|
| db          | index db instance                    |   true   |
| store       | table name to add the records too    |   true   |
| page_size   | how big is a page                    |   true   |
| page_number | what is the page number to fetch     |   true   |
| fields      | what field's values must be returned |  false   |
| target      | where to copy the result             |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "get_page,
    "args": {
        "db": "$context.db",
        "store": "data",
        "page_size": 10
        "page_size": 3,
        "fields": ["id", "code", "description],
        "target": "$context.results"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const results = crs.call("db", "get_page", {
    db: instance,
    store: "db",
    page_size: 10,
    page_number: 3
});
{{< /highlight >}}

## get_range

For a given store and field, get me the range values of that field.
This will give you back a object containing the following fields.

1. min
2. max

This is used to calculate the range of that field for display purposes.

| property    | description                          | required |
|:------------|:-------------------------------------|:--------:|
| db          | index db instance                    |   true   |
| store       | table name to add the records too    |   true   |
| field       | field name to calculate the range on |   true   |
| target      | where to copy the result             |  false   |

**json**

{{< highlight js >}}
"step": {
    "type": "db",
    "action": "get_range,
    "args": {
        "db": "$context.db",
        "store": "data",
        "field": "number"
        "target": "$context.range"
    }
}
{{< / highlight >}}

**javascript**

{{< highlight js >}}
const results = crs.call("db", "get_page", {
    db: instance,
    store: "db",
    field: "number"
});
{{< /highlight >}}