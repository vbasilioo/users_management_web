import { z } from 'zod';

export const themeSchema = z.enum(['light', 'dark', 'system']);

export const languageSchema = z.enum(['en', 'es', 'pt', 'fr', 'de', 'it', 'ja', 'zh']);

export const dateFormatSchema = z.enum([
  'MM/DD/YYYY',
  'DD/MM/YYYY',
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'DD-MMM-YYYY',
  'MMM DD, YYYY'
]);

export const timeFormatSchema = z.enum(['12h', '24h']);

export const timezoneSchema = z.string();

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
  notifyOnLogin: z.boolean().default(true),
  notifyOnMention: z.boolean().default(true),
  notifyOnAssignment: z.boolean().default(true),
  notifyOnSystemEvents: z.boolean().default(true),
  dailyDigest: z.boolean().default(false),
  weeklyDigest: z.boolean().default(false),
});

export const privacySettingsSchema = z.object({
  showEmail: z.boolean().default(false),
  showActivity: z.boolean().default(true),
  showOnlineStatus: z.boolean().default(true),
  allowDataCollection: z.boolean().default(true),
  allowMarketingEmails: z.boolean().default(false),
});

export const displaySettingsSchema = z.object({
  theme: themeSchema.default('system'),
  language: languageSchema.default('en'),
  dateFormat: dateFormatSchema.default('MM/DD/YYYY'),
  timeFormat: timeFormatSchema.default('12h'),
  timezone: timezoneSchema.default('UTC'),
  enableAnimations: z.boolean().default(true),
  highContrastMode: z.boolean().default(false),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
});

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  passwordResetInterval: z.number().int().nonnegative().default(90),
  sessionTimeout: z.number().int().nonnegative().default(30),
  rememberDevice: z.boolean().default(true),
  recentDevices: z.array(z.object({
    id: z.string(),
    name: z.string(),
    lastLogin: z.date(),
    isCurrent: z.boolean(),
  })).default([]),
});

export const userSettingsSchema = z.object({
  userId: z.string().uuid(),
  display: displaySettingsSchema,
  notifications: notificationSettingsSchema,
  privacy: privacySettingsSchema,
  security: securitySettingsSchema,
  lastUpdated: z.date().default(() => new Date()),
});

export const appSettingsSchema = z.object({
  maintenanceMode: z.boolean().default(false),
  allowRegistration: z.boolean().default(true),
  defaultUserRole: z.string().default('user'),
  maxUploadSize: z.number().int().positive().default(5 * 1024 * 1024),
  loginAttempts: z.number().int().positive().default(5),
  lockoutDuration: z.number().int().positive().default(15),
  sessionDuration: z.number().int().positive().default(60 * 24),
  apiRateLimit: z.number().int().positive().default(100),
});

export const updateDisplaySettingsSchema = displaySettingsSchema.partial();
export const updateNotificationSettingsSchema = notificationSettingsSchema.partial();
export const updatePrivacySettingsSchema = privacySettingsSchema.partial();
export const updateSecuritySettingsSchema = securitySettingsSchema.partial();
export const updateUserSettingsSchema = userSettingsSchema.partial().omit({ userId: true, lastUpdated: true });
export const updateAppSettingsSchema = appSettingsSchema.partial();

export type Theme = z.infer<typeof themeSchema>;
export type Language = z.infer<typeof languageSchema>;
export type DateFormat = z.infer<typeof dateFormatSchema>;
export type TimeFormat = z.infer<typeof timeFormatSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type PrivacySettings = z.infer<typeof privacySettingsSchema>;
export type DisplaySettings = z.infer<typeof displaySettingsSchema>;
export type SecuritySettings = z.infer<typeof securitySettingsSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type AppSettings = z.infer<typeof appSettingsSchema>;
export type UpdateDisplaySettings = z.infer<typeof updateDisplaySettingsSchema>;
export type UpdateNotificationSettings = z.infer<typeof updateNotificationSettingsSchema>;
export type UpdatePrivacySettings = z.infer<typeof updatePrivacySettingsSchema>;
export type UpdateSecuritySettings = z.infer<typeof updateSecuritySettingsSchema>;
export type UpdateUserSettings = z.infer<typeof updateUserSettingsSchema>;
export type UpdateAppSettings = z.infer<typeof updateAppSettingsSchema>; 