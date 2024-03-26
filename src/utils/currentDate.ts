import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz';

const TIME_ZONE = process.env.TZ

const getFullCurrentDate = (): string => {
    const currentD = new Date();
    const formatDate = format(utcToZonedTime(currentD, TIME_ZONE), 'yyyy/MM/dd HH:mm');
    const day = format(utcToZonedTime(currentD, TIME_ZONE), 'EEEE');

    return [
        formatDate,
        day,
    ].join(' ')

}

export { getFullCurrentDate }