import { DEFAULT_MOCK_OPTIONS, STATUS_TEXT_MAP } from "./constants";
import { MockOptions } from "./types";

/**
 * @description Convert a wildcard string to a regular expression.
 * @param wildcardString - The wildcard string to convert. eg. '/api/*\/users'
 * @returns A regular expression that matches the wildcard string.
 */
export function wildcardToRegex(wildcardString: string): RegExp {
    // Escape special regex characters
    const escapedString = wildcardString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Convert wildcard stars to regex patterns
    const regexPattern = escapedString.replace(/\\\*/g, "[\\s\\S]*");

    // Anchor pattern for strict path matching
    const anchoredPattern = `${regexPattern}$`;

    return new RegExp(anchoredPattern);
}

/**
 * @description Find a requests.
 */
export const findRequest = (original: [string, RequestInit?]) => (mocked: [RegExp, MockOptions?]) => {
    const [keyA, optionsA] = original;
    const [keyB, optionsB] = mocked;

    // Match keys.
    const keysMatch = keyA.toString() === keyB.toString() || keyA.match(keyB);

    if(!keysMatch)
        return false;

    // Match methods.
    const methodA = optionsA?.method || "GET";
    const methodB = optionsB?.method || "GET";

    const methodMatch = methodA.toLowerCase() === methodB.toLowerCase();

    if(!methodMatch)
        return false;

    // Match headers.
    const headersA = new Headers(optionsA?.headers);
    const headersB = new Headers(optionsB?.headers);

    const headersMatch = [...headersB.entries()].every(([key, valueB]) => {
        const valueA = headersA.get(key);
        return valueA === valueB;
    });

    if(!headersMatch)
        return false;

    return true;
}

/**
 * Returns an object similar to Response class.
 * @param status - The HTTP status code of the response.
 * @param url - The URL of the request.
 * @param options - The options for the mocked request.
 * @returns An object similar to Response class.
 */
export const makeResponse = (status: keyof typeof STATUS_TEXT_MAP, url: string, options: MockOptions = DEFAULT_MOCK_OPTIONS) => {
    const { headers, data } = options;

    const ok = status >= 200 && status < 300;

    return {
        ok,
        status,
        statusText: STATUS_TEXT_MAP[status],
        url,
        headers,
        text: () => Promise.resolve(data),
        json: () => Promise.resolve(data),
        redirected: false,
        bodyUsed: !!data
    };
}