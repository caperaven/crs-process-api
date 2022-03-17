export async function validateStepTest(schema, provider, process, step, messages) {
    // 1. test pass
    const passResult = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(passResult.passed).toBeTruthy();

    // 2. remove the args and check that the right messages come back
    schema[process].steps[step].args = {};
    const failResult = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");

    expect(failResult.passed).toBeFalsy();
    expect(messages.length).toEqual(failResult.messages.length);

    for (let message of messages) {
        expect(failResult.messages.indexOf(message)).toBeGreaterThan(-1);
    }
}