import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function getTimeFromNow(dateStr) {
  // Convert dateStr to a moment object
  const date = moment(new Date(dateStr));

  // Use fromNow function to get the time from now
  const timeFromNow = date.fromNow();

  return timeFromNow;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// format release date
export const formatReleaseDate = (releaseDate) => {
  const date = new Date(releaseDate);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

// // fetcher function for useSWR
export const fetcher = (...args) => fetch(...args).then((res) => res.json());
// export const fetcher = (url, queryParams = '') => {
//   // Append query params to URL
//   return fetch(`${url}${queryParams}`)
//     .then((res) => res.json());
// }

export const DRAFTS_PREFIX = "__drafts-group__";

/**
 * Drafts are stored as a group that uses the user's id
 * @param userId
 */
export function getDraftsGroupName(userId) {
  return `${DRAFTS_PREFIX}${userId}`;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const utcDatesAreSameLocalDay = (utcDatetime1, utcDatetime2) => {
  return moment
    .utc(utcDatetime1)
    .local()
    .isSame(moment.utc(utcDatetime2).local(), "day");
};

export const utcToLocalCalendarDate = (utcDatetime) => {
  return moment.utc(utcDatetime).local().calendar(null, {
    sameDay: "[Today]",
    lastDay: "[Yesterday]",
    lastWeek: "MMM Do",
    sameElse: "MMM Do",
  });
};

export const timeDiffIsGreaterThanXMinutes = (
  datetime1,
  datetime2,
  minutes
) => {
  return (
    Math.abs(moment(datetime1).diff(moment(datetime2))) >= 1000 * 60 * minutes
  );
};

export const utcToLocalTime = (utcDatetime) => {
  return moment.utc(utcDatetime).local().format("LT");
};

export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return `rgb(${r}, ${g}, ${b})`; // returning two colors for the gradient
}

export function getPoint(point) {
  return {
    x: point.clientX || point.x,
    y: point.clientY || point.y,
  };
}

export function scaledPoint(point, camera) {
  return {
    x: (point.clientX || point.x) * camera.scale,
    y: (point.clientY || point.y) * camera.scale,
  };
}

export function canvasPointToScreenPoint(point, camera) {
  return {
    x: (point.clientX || point.x) * camera.scale - camera.x,
    y: (point.clientY || point.y) * camera.scale - camera.y,
  };
}
