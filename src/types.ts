import { STATUS_TEXT_MAP } from "./constants";
/**
 * @description The options for a mocked request.
 * Partial implementation of RequestInit with the addition of "data" property which value will be returned from the mock.
 */
export type MockOptions = {
  data?: any;
  status?: keyof typeof STATUS_TEXT_MAP;
  headers?: RequestInit["headers"];
  method?: RequestInit["method"];
};
