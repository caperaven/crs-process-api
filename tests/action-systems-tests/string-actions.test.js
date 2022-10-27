import { assertEquals, assertExists } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
await init();

Deno.test("get_query_string - basic url parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/contoso/test/#dashboard/Resource/?remote=Resource&action=GetResourceCollection&id=5000001038", target: "$context.result"}, context);

    assertExists(context.result.remote);
    assertExists(context.result.action);
    assertExists(context.result.id);
    assertEquals(context.result.remote, "Resource");
    assertEquals(context.result.action, "GetResourceCollection");
    assertEquals(context.result.id, "5000001038");
})

Deno.test("get_query_string - nested url parameter", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test", complex_parameters: ["parameters"], target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test;crudResourceId=1662705947179108", complex_parameters: ["parameters"], target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108", complex_parameters: ["test"], target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=nestedparam1=1;nestedparam2=2&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108", complex_parameters: ['parameters', 'test'], target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test;crudResourceId=1662705947179108", complex_parameters: ['parameters'], target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test", target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=tenantIdentity=contoso:test;crudResourceId=1662705947179108", target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108", target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?remote=TenantIdentityProvider&action=UpdateTenantIdentityProvider&id=1662705947179108&parameters=nestedparam1=1;nestedparam2=2&test=tenantIdentity=contoso:test;crudResourceId=1662705947179108", complex_parameters:["someOtherParams", "someOtherTest"], target: "$context.result"}, context);

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

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/contoso/test/#dashboard/Resource/", target: "$context.result"}, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - url with query string, but no parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/contoso/test/#dashboard/Resource/?someOtherValue", target: "$context.result"}, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - url with empty query", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/contoso/test/#dashboard/Resource/?", target: "$context.result"}, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - url with no parameter equal some value", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/contoso/test/#dashboard/Resource/?=someValue", target: "$context.result"}, context);

    assertEquals(context.result, undefined);
})

Deno.test("get_query_string - nested url with empty parameters", async () => {
    const context = {}

    await crs.call("string", "get_query_string", {source: "https://localhost:1100/System/Admin/#dashboard/Admin/?parameters=", target: "$context.result"}, context);
    assertEquals(context.result, undefined);
})

Deno.test("inflate string", async () => {
    const template = "${code}: ${description}";
    let result = await crs.call("string", "inflate", {
        template: template,
        parameters: {
            code: "A11",
            description: "This is a description"
        }
    });

    assertEquals(result, "A11: This is a description");


    result = await crs.call("string", "inflate", {
        template: "<icon>gear</icon> <bold>[${code}]</bold> ${description}",
        parameters: {
            code: "A11",
            description: "Desc"
        }
    });

    assertEquals(result, "<icon>gear</icon> <bold>[A11]</bold> Desc");
})