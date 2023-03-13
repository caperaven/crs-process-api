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
* @param {Array<any>} data
* @param {Array<any>} intent
* @param {Uint32Array | undefined} rows
* @returns {object}
*/
export function group(data: Array<any>, intent: Array<any>, rows?: Uint32Array): object;
/**
* @param {Array<any>} data
* @param {any[]} intent
* @param {Uint32Array | undefined} rows
* @returns {any}
*/
export function aggregate(data: Array<any>, intent: any[], rows?: Uint32Array): any;
/**
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
