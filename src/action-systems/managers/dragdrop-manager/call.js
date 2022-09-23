export async function call(option, ...args) {
    if (typeof option == "function") {
        return await option(...args);
    }
}