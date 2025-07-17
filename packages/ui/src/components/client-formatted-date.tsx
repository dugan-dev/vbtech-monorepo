"use client";

import { formatDate } from "@workspace/utils/format-date";

type props = {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
};

export function ClientFormattedDate({ date, options }: props) {
  const dateTimeStr = formatDate({ date, options });
  return <time dateTime={dateTimeStr}>{dateTimeStr}</time>;
}
