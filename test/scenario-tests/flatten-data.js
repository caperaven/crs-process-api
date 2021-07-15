export function createData(count = 1, errorCount = 10) {
    const result = [];

    for (let i = 0; i < count; i++) {
        const item = {
            code: `code ${i}`,
            errors: []
        };

        for (let j = 0; j < errorCount; j++) {
            item.errors.push({
                error: `error ${(i + 1) * j}`,
                severity: `medium`
            })
        }

        result.push(item);
    }

    return result;
}