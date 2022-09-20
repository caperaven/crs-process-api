export class ComputedStyleMock {
    constructor(element) {
        this.variables = JSON.parse(JSON.stringify(element.variables));
    }

    getPropertyValue(variable) {
        return this.variables[variable];
    }
}

globalThis.getComputedStyle = (element) => {
    return new ComputedStyleMock(element);
}