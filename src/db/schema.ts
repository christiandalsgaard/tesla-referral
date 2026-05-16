import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// ============================================================================
// subscribers — people who opted in to receive Tesla referral emails.
// Uses double opt-in: status starts as 'pending', moves to 'confirmed' after
// clicking the confirmation link in the welcome email. 'unsubscribed' means
// they clicked the unsubscribe link (CAN-SPAM requirement: honor immediately).
// ============================================================================
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  // pending → confirmed → unsubscribed
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // Token embedded in the confirmation email link — proves they own the address
  confirmToken: varchar("confirm_token", { length: 64 }).notNull(),
  // Token embedded in every email's unsubscribe link — unique per subscriber
  unsubscribeToken: varchar("unsubscribe_token", { length: 64 }).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  // Where they signed up from — 'landing_page', 'manual', etc.
  source: varchar("source", { length: 50 }).default("landing_page"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// campaigns — each batch email send creates one campaign record.
// Tracks how many emails were dispatched and the overall send status.
// ============================================================================
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 255 }).notNull(),
  // Which React Email template was used (for future A/B testing)
  templateId: varchar("template_id", { length: 50 }).default("tesla-pitch"),
  sentCount: integer("sent_count").default(0),
  // draft → sending → sent → failed
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// email_events — webhook events from Resend (delivered, opened, clicked, etc).
// These power the dashboard metrics: open rate, click rate, bounce tracking.
// On 'complained' events, the subscriber is auto-unsubscribed (CAN-SPAM).
// ============================================================================
export const emailEvents = pgTable("email_events", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  subscriberId: integer("subscriber_id").references(() => subscribers.id),
  // delivered | opened | clicked | bounced | complained
  eventType: varchar("event_type", { length: 30 }).notNull(),
  // Resend's message ID — used to correlate webhook events back to a send
  resendMessageId: varchar("resend_message_id", { length: 100 }),
  // Any extra payload from the webhook (link URL for clicks, error for bounces, etc.)
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
