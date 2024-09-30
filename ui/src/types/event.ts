import { z } from 'zod'

export const EventSchema = z.object({
  id: z.number(),
  time: z.string(),
  site_id: z.number(),
  old_status: z.string(),
  new_status: z.string(),
  details: z.string(),
})

export type Event = z.infer<typeof EventSchema>
