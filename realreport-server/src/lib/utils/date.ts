export const dateOption: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
};

export const toFormatDate = (date: Date) => {
    return date.toLocaleString('ko-KR', dateOption);
};
