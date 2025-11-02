/**
 * Stub Zod type definitions for contracts
 * These will be replaced by actual Zod types when dependencies are installed
 */

declare module 'zod' {
  export class ZodError {
    errors: Array<{
      path: (string | number)[];
      message: string;
    }>;
  }

  export interface ZodSchema<T> {
    parse: (data: unknown) => T;
  }

  export const z: {
    object: (schema: Record<string, any>) => any;
    string: () => any;
    number: () => any;
    boolean: () => any;
    date: () => any;
    enum: (values: any[]) => any;
    array: (schema?: any) => any;
    literal: (value: any) => any;
    null: () => any;
    undefined: () => any;
    void: () => any;
    any: () => any;
    unknown: () => any;
    never: () => any;
    union: (...schemas: any[]) => any;
    intersection: (...schemas: any[]) => any;
    tuple: (...schemas: any[]) => any;
    record: (keySchema?: any, valueSchema?: any) => any;
    map: (keySchema: any, valueSchema: any) => any;
    set: (schema: any) => any;
    lazy: (fn: () => any) => any;
    function: () => any;
    promise: (schema: any) => any;
  };
}

