import { z } from 'zod'

export const SiteWriteSchema = z.object({
  name: z.string(),
  url: z.string(),
  public: z.boolean(),
  enabled: z.boolean(),
  timeout: z.number(),
  ignore_http_errors: z.boolean(),
  online_interval: z.number(),
  offline_interval: z.number(),
})

export type SiteWrite = z.infer<typeof SiteWriteSchema>

export const SiteReadSchema = SiteWriteSchema.extend({
  id: z.number(),
  last_check: z.string(),
  status: z.enum([
    'unknown',
    'online',
    'error',
  ]),
  details: z.string(),
})

export type SiteRead = z.infer<typeof SiteReadSchema>
