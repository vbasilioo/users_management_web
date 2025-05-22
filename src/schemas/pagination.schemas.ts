import { z } from 'zod';

export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
});

export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const paginatedResponseSchema = z.object({
  items: z.array(z.any()),
  meta: paginationMetaSchema,
});

export const dateRangeFilterSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
}).refine(
  data => !data.from || !data.to || data.from <= data.to,
  {
    message: "End date must be after start date",
    path: ["to"]
  }
);

export const numericRangeFilterSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
}).refine(
  data => !data.min || !data.max || data.min <= data.max,
  {
    message: "Maximum value must be greater than or equal to minimum value",
    path: ["max"]
  }
);

export const filterOperatorSchema = z.enum([
  'eq',
  'ne',
  'gt',
  'gte',
  'lt',
  'lte',
  'contains',
  'startsWith',
  'endsWith',
  'in',
  'notIn',
]);

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<T> = { items: T[], meta: PaginationMeta };
export type DateRangeFilter = z.infer<typeof dateRangeFilterSchema>;
export type NumericRangeFilter = z.infer<typeof numericRangeFilterSchema>;
export type FilterOperator = z.infer<typeof filterOperatorSchema>; 