export type ApiSuccess<T extends Record<string, unknown> = Record<string, never>> = {
  success: true;
} & T;

export type QueryParamPrimitive = boolean | number | string;

export type QueryParamValue =
  | QueryParamPrimitive
  | null
  | undefined
  | ReadonlyArray<QueryParamPrimitive | null | undefined>;

export type QueryParams = Record<string, QueryParamValue>;

export type PaginationQuery = {
  limit?: number;
  offset?: number;
};

export type PaginatedData<
  TKey extends string,
  TItem,
> = {
  total: number;
  limit?: number;
  offset?: number;
} & {
  [Key in TKey]: TItem[];
};

export type EntityData<TKey extends string, TEntity> = {
  [Key in TKey]: TEntity;
};
