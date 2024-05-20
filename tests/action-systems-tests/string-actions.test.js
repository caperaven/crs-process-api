import {assertEquals, assertExists} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

Deno.test("get_query_string - basic url parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/contoso/test/#dashboard/Resource/?remote=Resource&action=GetResourceCollection&id=5000001038",
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertEquals(context.result.remote, "Resource");
    assertEquals(context.result.action, "GetResourceCollection");
    assertEquals(context.result.id, "5000001038");
})

Deno.test("get_query_string - nested url parameter", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test",
        complex_parameters: ["parameters"],
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.parameters);
    assertExists(context.result.parameters.tenantIdentity);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.parameters.tenantIdentity, "contoso:test");
})

Deno.test("get_query_string - nested url parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test;crudResourceId=1662705947179108",
        complex_parameters: ["parameters"],
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.parameters);
    assertExists(context.result.parameters.tenantIdentity);
    assertExists(context.result.parameters.crudResourceId);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.parameters.tenantIdentity, "contoso:test");
    assertEquals(context.result.parameters.crudResourceId, "1662705947179108");
})

Deno.test("get_query_string - nested url object", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108",
        complex_parameters: ["test"],
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.test);
    assertExists(context.result.test.tenantIdentity);
    assertExists(context.result.test.crudResourceId);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.test.tenantIdentity, "contoso:test");
    assertEquals(context.result.test.crudResourceId, "1662705947179108");
})

Deno.test("get_query_string - multiple nested url object", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=nestedparam1=1;nestedparam2=2&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108",
        complex_parameters: ['parameters', 'test'],
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.parameters);
    assertExists(context.result.parameters.nestedparam1);
    assertExists(context.result.parameters.nestedparam2);
    assertExists(context.result.test);
    assertExists(context.result.test.tenantIdentity);
    assertExists(context.result.test.crudResourceId);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.parameters.nestedparam1, '1');
    assertEquals(context.result.parameters.nestedparam2, '2');
    assertEquals(context.result.test.tenantIdentity, "contoso:test");
    assertEquals(context.result.test.crudResourceId, "1662705947179108");
})

Deno.test("get_query_string - just query section", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test;crudResourceId=1662705947179108",
        complex_parameters: ['parameters'],
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.parameters);
    assertExists(context.result.parameters.tenantIdentity);
    assertExists(context.result.parameters.crudResourceId);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.parameters.tenantIdentity, "contoso:test");
    assertEquals(context.result.parameters.crudResourceId, "1662705947179108");
})

Deno.test("get_query_string - without nested url parameter", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test",
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.parameters);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.parameters, "tenantIdentity=contoso:test");
})

Deno.test("get_query_string - without nested url parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test;crudResourceId=1662705947179108",
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.parameters);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.parameters, "tenantIdentity=contoso:test;crudResourceId=1662705947179108");
})

Deno.test("get_query_string - without nested url object", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108",
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.test);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.test, "tenantIdentity=contoso:test;crudResourceId=1662705947179108");
})

Deno.test("get_query_string - multiple nested url object with non-matching complex_parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=nestedparam1=1;nestedparam2=2&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108",
        complex_parameters: ["someOtherParams", "someOtherTest"],
        target: "$context.result"
    }, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertExists(context.result.parameters);
    assertExists(context.result.test);
    assertEquals(context.result.remote, "TenantIdentityProvider");
    assertEquals(context.result.action, "UpdateTenantIdentityProvider");
    assertEquals(context.result.id, "1662705947179108");
    assertEquals(context.result.parameters, 'nestedparam1=1;nestedparam2=2');
    assertEquals(context.result.test, "tenantIdentity=contoso:test;crudResourceId=1662705947179108");
})

Deno.test("get_query_string - url with no query string", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/contoso/test/#dashboard/Resource/",
        target: "$context.result"
    }, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - url with query string, but no parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/contoso/test/#dashboard/Resource/?someOtherValue",
        target: "$context.result"
    }, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - url with empty query", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/contoso/test/#dashboard/Resource/?",
        target: "$context.result"
    }, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - url with no parameter equal some value", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/contoso/test/#dashboard/Resource/?=someValue",
        target: "$context.result"
    }, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - nested url with empty parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {
        source: "https://localhost:1100/System/Admin/#dashboard/Admin/?parameters=",
        target: "$context.result"
    }, context);
    assertEquals(context.result, undefined);
})

Deno.test("inflate string", async () => {
    const template = "<icon>gear</icon> <bold>[${code}]</bold> ${description}";

    const items = [
            {
                code: "A11",
                description: "This is a description",
                expected: "<icon>gear</icon> <bold>[A11]</bold> This is a description"
            },
            {
                code: "A12",
                description: "This is another description",
                expected: "<icon>gear</icon> <bold>[A12]</bold> This is another description"
            }
        ]


    const parameters = {
        code: "$item.code",
        description: "$item.description"
    }

    for (const item of items) {
        let result = await crs.call("string", "inflate", {
            template: template,
            parameters
        }, null, null, item);

        assertEquals(result, item.expected);
    }

})

Deno.test("inflate string - complex", async () => {

    const template = "${url}"
    const parameters = {
        "url": "$item[$process.parameters.fieldUrlProperty]"
    }

    const items = [
        {
            fieldUrlProperty: "url",
            my_url: "https://www.google.com",
            expected: "https://www.google.com"
        },
        {
            fieldUrlProperty: "url",
            my_url: "https://www.microsoft.com",
            expected: "https://www.microsoft.com"
        }
        ];

    const process = {
        parameters: {
            fieldUrlProperty: "my_url"
        }
    }

    for (const item of items) {
        let result = await crs.call("string", "inflate", {
            template: template,
            parameters
        }, null, process, item);

        assertEquals(result, item.expected);
    }

})

Deno.test("translate string", async () => {
    await crsbinding.translations.add({
        "hello": "Hello",
        "world": "World"
    }, "md")

    const template = "say &{md.hello} to the &{md.world}."
    const result = await crs.call("string", "translate", {template})

    assertEquals(result, "say Hello to the World.")

    await crsbinding.translations.delete("md");
})

Deno.test("template string", async () => {
    const result = await crs.call("string", "template", {
        template: "<li>__button__ __property__ __chevron__</li>",
        options: {
            button: "",
            property: "<div>${title}</div>",
            chevron: "<svg><use href='#chevron'></use></svg>"
        }
    })

    assertEquals(result, "<li> <div>${title}</div> <svg><use href='#chevron'></use></svg></li>");
})

Deno.test("string slice - simple", async () => {
    const result = await crs.call("string", "slice", {
        value: "Hello World",
        length: 5
    })

    assertEquals(result, "Hello");
})

Deno.test("string slice - with index", async () => {
    const result = await crs.call("string", "slice", {
        value: "Hello World",
        index: 6,
        length: 5
    })

    assertEquals(result, "World");
})

Deno.test("string slice - with ellipsis", async () => {
    const result = await crs.call("string", "slice", {
        value: "Hello World",
        length: 5,
        overflow: "ellipsis"
    })

    assertEquals(result, "He...");
})

Deno.test("string slice - complete", async () => {
    const result = await crs.call("string", "slice", {
        value: "Test is completed for string slice function",
        index: 5,
        length: 16,
        overflow: "ellipsis"
    })

    assertEquals(result, "is completed ...");
})