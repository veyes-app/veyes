export const urlParamsAsObject = <T>(urlParams: URLSearchParams): T => {
    const result = {}
    for (const [key, value] of urlParams.entries()) {
        result[key] = value;
    }
    return result as T;
}