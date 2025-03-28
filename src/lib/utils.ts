import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { languages } from '@/i18n/i18n'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

/**
 * Format a date string to a localized date format
 * @param dateString ISO date string
 * @param language Language code (e.g. 'en', 'es', 'tr')
 * @param options Optional Intl.DateTimeFormatOptions
 */
export function formatDate(dateString: string, language: keyof typeof languages = 'en', options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}) {
  const date = new Date(dateString);
  const locale = languages[language].locale;
  return date.toLocaleDateString(locale, options);
}

/**
 * Format a date string to a localized date and time format
 * @param dateString ISO date string
 * @param language Language code (e.g. 'en', 'es', 'tr')
 * @param options Optional Intl.DateTimeFormatOptions
 */
export function formatDateTime(dateString: string, language: keyof typeof languages = 'en', options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}) {
  const date = new Date(dateString);
  const locale = languages[language].locale;
  return date.toLocaleString(locale, options);
}

/**
 * Format a date string to a relative time format (e.g. "2 hours ago")
 * @param dateString ISO date string
 */
export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 60) {
    return `${diffInMins} min${diffInMins !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
}

/**
 * Calculate days remaining until a due date
 * @param dueDate ISO date string
 */
export function calculateDaysRemaining(dueDate: string) {
  const due = new Date(dueDate);
  const today = new Date();
  const differenceInTime = due.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays > 0 ? differenceInDays : 0;
}
