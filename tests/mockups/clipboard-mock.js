globalThis.navigator = {
    clipboard: {
        writeText: (text) => {
            return new Promise((resolve, reject) => {
                this._text = text;
                resolve();
            });
        }
    }
}