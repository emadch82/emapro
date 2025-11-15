


export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "00:00";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// --- Start of Jalali-Gregorian Conversion ---
// This is a robust and widely-used algorithm for conversion.

function div(a: number, b: number): number {
  return Math.floor(a / b);
}

export function gregorianToJalali(g_y: number, g_m: number, g_d: number): [number, number, number] {
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  const gy = g_y - 1600;
  const gm = g_m - 1;
  const gd = g_d - 1;

  let g_day_no = 365 * gy + div(gy + 3, 4) - div(gy + 99, 100) + div(gy + 399, 400);

  for (let i = 0; i < gm; ++i)
    g_day_no += g_days_in_month[i];
  if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)))
    g_day_no++;
  g_day_no += gd;

  let j_day_no = g_day_no - 79;

  const j_np = div(j_day_no, 12053);
  j_day_no %= 12053;

  let jy = 979 + 33 * j_np + 4 * div(j_day_no, 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += div(j_day_no - 1, 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  let i = 0;
  for (; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
    j_day_no -= j_days_in_month[i];
  }
  const jm = i + 1;
  const jd = j_day_no + 1;

  return [jy, jm, jd];
}


export function jalaliToGregorian(j_y: number, j_m: number, j_d: number): [number, number, number] {
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  const jy = j_y - 979;
  const jm = j_m - 1;
  const jd = j_d - 1;

  let j_day_no = 365 * jy + div(jy, 33) * 8 + div(jy % 33 + 3, 4);
  for (let i = 0; i < jm; ++i)
    j_day_no += j_days_in_month[i];

  j_day_no += jd;

  let g_day_no = j_day_no + 79;

  let gy = 1600 + 400 * div(g_day_no, 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  g_day_no = g_day_no % 146097;

  let leap = true;
  if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
    g_day_no--;
    gy += 100 * div(g_day_no, 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365)
      g_day_no++;
    else
      leap = false;
  }

  gy += 4 * div(g_day_no, 1461); /* 1461 = 365*4 + 4/4 */
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;

    g_day_no--;
    gy += div(g_day_no, 365);
    g_day_no = g_day_no % 365;
  }
  
  let i = 0;
  for (; g_day_no >= g_days_in_month[i] + (i === 1 && leap ? 1 : 0); i++)
    g_day_no -= g_days_in_month[i] + (i === 1 && leap ? 1 : 0);
  const gm = i + 1;
  const gd = g_day_no + 1;

  return [gy, gm, gd];
}
// --- End of Jalali-Gregorian Conversion ---


export const formatPersianDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Return empty string for invalid dates
    const [gy, gm, gd] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
    const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    return `${jd} ${monthNames[jm - 1]} ${jy}`;
  } catch (e) {
    console.error("Error formatting persian date:", e);
    return '';
  }
};

export const formatPersianDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; // Return empty string for invalid dates
        const [gy, gm, gd] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
        return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    } catch (e) {
        console.error("Error formatting persian date for input:", e);
        return '';
    }
};

export const parsePersianDateInput = (persianDate: string): string | null => {
    if (!persianDate) return null;
    const parts = persianDate.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
    if (!parts) return null;
    try {
        const [_, jy, jm, jd] = parts.map(p => parseInt(p, 10));
        if (jm < 1 || jm > 12 || jd < 1 || jd > 31 || (jm > 6 && jd > 30)) {
            return null;
        }
        // Basic check for Esfand. A full leap year check could be added if needed.
        if (jm === 12) {
             // Check for leap year
            const g = jalaliToGregorian(jy, 1, 1);
            const g2 = jalaliToGregorian(jy + 1, 1, 1);
            const isLeap = (g2[0] - g[0]) > 365;
            if ((isLeap && jd > 30) || (!isLeap && jd > 29)) {
                 return null;
            }
        }

        const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
        return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
    } catch (e) {
        console.error("Error parsing persian date:", e);
        return null;
    }
};

export const toPersianDigits = (str: string | number): string => {
    if (str === null || str === undefined) return '';
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]).replace(/\./g, '٫');
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

export const formatDateSeparator = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(date, today)) return 'امروز';
        if (isSameDay(date, yesterday)) return 'دیروز';
        return formatPersianDate(dateString);
    } catch (e) {
        return '';
    }
};

export const formatTimeFromISO = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return toPersianDigits(`${hours}:${minutes}`);
    } catch (e) {
        return '';
    }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        alert('مرورگر شما از اعلان‌ها پشتیبانی نمی‌کند.');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        alert('شما قبلاً دسترسی به اعلان‌ها را مسدود کرده‌اید. برای دریافت اعلان، لطفاً این دسترسی را از تنظیمات مرورگر خود فعال کنید.');
        return false;
    }

    // If permission is 'default', ask the user.
    try {
        const permission = await Notification.requestPermission();
        // Return true if permission was granted. The calling function will handle showing the notification.
        return permission === 'granted';
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
    }
};