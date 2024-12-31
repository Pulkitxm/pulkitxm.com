export type RES_TYPE<T = unknown> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
      error: string;
    };
