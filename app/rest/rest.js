export default class Rest extends crs.binding.classes.ViewBase {
    async get() {
        await crs.call("rest_services", "get", {
            url: "https://gorest.co.in/public/v1/users",
            target: "$binding.records"
        }, null, {parameters: {bId: this._dataId}});
    }

    async update() {
        let result = await crs.call("rest_services", "patch", {
            url: "https://gorest.co.in/public/v1/users/&id",
            target: "$binding.records",
            body: {
                name: "testing update"
            }
        }, null, {parameters: {bId: this._dataId}});

        console.log(result);
    }
}