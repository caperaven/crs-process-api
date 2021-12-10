export default class Rest extends crsbinding.classes.ViewBase {
    async get() {
        await crs.intent.rest.get({
            args: {
                url: "https://gorest.co.in/public/v1/users",
                target: "$binding.records"
            }
        }, null, {parameters: {bId: this._dataId}});
    }

    async update() {
        let result = await crs.intent.rest.patch({
            args: {
                url: "https://gorest.co.in/public/v1/users/&id",
                target: "$binding.records",
                body: {
                    name: "testing update"
                }
            }
        }, null, {parameters: {bId: this._dataId}});

        console.log(result);
    }
}