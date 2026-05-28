/** @see models/post.js */
const RECURRING_ONE_TIME = 0;
const RECURRING_DAILY = 1;
const RECURRING_WEEKLY = 2;

const WEEKDAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * @param {string|Date|null} recurringTime - DB TIME or HH:mm(:ss)
 * @returns {{ hour: number, minute: number }|null}
 */
function parseRecurringTime(recurringTime) {
    if (recurringTime == null || recurringTime === '') {
        return null;
    }
    const str = typeof recurringTime === 'string'
        ? recurringTime
        : String(recurringTime);
    const parts = str.split(':');
    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return null;
    }
    return { hour, minute };
}

function isPastRecurringEnd(recurringEndAt, now) {
    if (!recurringEndAt) {
        return false;
    }
    const end = new Date(recurringEndAt);
    end.setUTCHours(23, 59, 59, 999);
    return now > end;
}

function isSameUtcCalendarDay(a, b) {
    return a.getUTCFullYear() === b.getUTCFullYear()
        && a.getUTCMonth() === b.getUTCMonth()
        && a.getUTCDate() === b.getUTCDate();
}

function alreadyPublishedToday(post, now) {
    if (!post.publishedAt) {
        return false;
    }
    return isSameUtcCalendarDay(new Date(post.publishedAt), now);
}

function isWeeklyDayMatch(recurringDays, now) {
    if (!recurringDays || !String(recurringDays).trim()) {
        return false;
    }
    const today = WEEKDAY_CODES[now.getUTCDay()];
    const days = String(recurringDays)
        .split(',')
        .map((d) => d.trim().toUpperCase())
        .filter(Boolean);
    return days.includes(today);
}

/**
 * Whether a recurring post should fire in the current minute (UTC).
 * @param {object} post - Post instance with recurring fields
 * @param {Date} [now]
 */
function isRecurringDueNow(post, now = new Date()) {
    if (post.recurringType !== RECURRING_DAILY && post.recurringType !== RECURRING_WEEKLY) {
        return false;
    }

    if (isPastRecurringEnd(post.recurringEndAt, now)) {
        return false;
    }

    const slot = parseRecurringTime(post.recurringTime);
    if (!slot) {
        return false;
    }

    if (now.getUTCHours() !== slot.hour || now.getUTCMinutes() !== slot.minute) {
        return false;
    }

    if (post.recurringType === RECURRING_WEEKLY && !isWeeklyDayMatch(post.recurringDays, now)) {
        return false;
    }

    if (alreadyPublishedToday(post, now)) {
        return false;
    }

    return true;
}

module.exports = {
    RECURRING_ONE_TIME,
    RECURRING_DAILY,
    RECURRING_WEEKLY,
    WEEKDAY_CODES,
    parseRecurringTime,
    isPastRecurringEnd,
    isRecurringDueNow,
    alreadyPublishedToday,
    isWeeklyDayMatch
};
