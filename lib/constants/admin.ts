/**
 * Admin-related constants for forms and data management
 */

export const POLICY_CATEGORIES = [
  'Workplace Health & Safety',
  'Employment',
  'Code of Conduct',
  'Leave & Benefits',
  'IT & Security',
  'Training & Development',
  'Other',
] as const;

export const DOWNLOAD_CATEGORIES = [
  'Forms',
  'Guides',
  'Templates',
  'Training Materials',
  'Health & Safety',
  'HR Documents',
  'Other',
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

export const FILE_SIZE_LIMITS = {
  POLICY_PDF: 10 * 1024 * 1024, // 10MB
  DOWNLOAD: 10 * 1024 * 1024, // 10MB
} as const;

export type PolicyCategory = typeof POLICY_CATEGORIES[number];
export type DownloadCategory = typeof DOWNLOAD_CATEGORIES[number];

