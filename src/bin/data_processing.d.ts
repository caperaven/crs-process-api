/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_panic_hook(): void;
/**
*
*    Utility function to get a value on a object path
*    Exposed for testing purposes
**
* @param {any} obj
* @param {string} path
* @returns {any}
*/
export function get_value(obj: any, path: string): any;
/**
*
*    Check if a object matches the filter intent.
*    Based on the filter intent, return true if the object passes evaluation.
*    If the object is excluded by the evaluation it returns false.
**
* @param {any} intent
* @param {any} row
* @param {boolean} case_sensitive
* @returns {boolean}
*/
export function in_filter(intent: any, row: any, case_sensitive: boolean): boolean;
/**
*
*    Given an array of objects execute the filter and return an array of indexes of the items that
*    passes the filter criteria
**
* @param {Array<any>} data
* @param {any} intent
* @param {boolean} case_sensitive
* @returns {Array<any>}
*/
export function filter(data: Array<any>, intent: any, case_sensitive: boolean): Array<any>;
/**
*
*    Sort the array of objects based on the sort intent.
*    If you only want to sort a subset of the records, pass in an array of indexes for the objects
*    that must make up the sort result.
**
* @param {Array<any>} data
* @param {Array<any>} intent
* @param {Uint32Array | undefined} rows
* @returns {Uint32Array}
*/
export function sort(data: Array<any>, intent: Array<any>, rows?: Uint32Array): Uint32Array;
/**
*
*    JHR todo: we need to be able to pass in sort data so that the group items can be sorted if a group field matched a sort field.
**
* @param {Array<any>} data
* @param {Array<any>} intent
* @param {Uint32Array | undefined} rows
* @returns {object}
*/
export function group(data: Array<any>, intent: Array<any>, rows?: Uint32Array): object;
/**
*
*    JHR: todo
*    We want to pass in sort direction as a parameter that can be
*    1. Ascending
*    2. Descending
*    3. None
*
*    Order the results based on that so that you can see the values in the order you want.
*
*    @Example
*    calculate aggregate on asset for the count of work orders on it and pass it back so tha the asset
*    with the most work orders is first and the asset the least is last.
*
*    @example
*    calculate aggregate on asset for the count of work orders
*    pass it back where the assets are sorted alphabetically
**
* @param {Array<any>} data
* @param {any[]} intent
* @param {Uint32Array | undefined} rows
* @returns {any}
*/
export function aggregate(data: Array<any>, intent: any[], rows?: Uint32Array): any;
/**
*
*    JHR: todo
*    Allow sorting of the unique values.
*    1. Ascending
*    2. Descending
*    3. None
*
*    @example
*    Show me the values where the count is the highest to the lowest
*
*    @example
*    Show me the values in a ascending order of the value itself
**
* @param {Array<any>} data
* @param {any[]} intent
* @param {Uint32Array | undefined} rows
* @returns {any}
*/
export function unique_values(data: Array<any>, intent: any[], rows?: Uint32Array): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly init_panic_hook: () => void;
  readonly get_value: (a: number, b: number, c: number) => number;
  readonly in_filter: (a: number, b: number, c: number, d: number) => void;
  readonly filter: (a: number, b: number, c: number, d: number) => void;
  readonly sort: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly group: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly aggregate: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly unique_values: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
