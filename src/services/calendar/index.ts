import { N8N_ADD_TO_CALENDAR, N8N_GET_FROM_CALENDAR } from 'src/config'

/**
 * get calendar
 * @returns 
 */
const getCurrentCalendar = async (): Promise<{ start: string, end: string }[]> => {
    const dataCalendarApi = await fetch(N8N_GET_FROM_CALENDAR)
    const json: { start: { dateTime: string }, end: { dateTime: string } }[] = await dataCalendarApi.json()
    const list = json.reduce((prev, current) => {
        prev.push({ start: current.start.dateTime, end: current.end.dateTime })
        return prev
    }, [])
    return list
}

/**
 * add to calendar
 * @param body 
 * @returns 
 */
const appToCalendar = async (payload: { name: string, email: string, startDate: Date, endData: Date, phone: string }) => {
    try {
        const dataApi = await fetch(N8N_ADD_TO_CALENDAR, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
        return dataApi
    } catch (err) {
        console.log(`error: `, err)
    }
}

export { getCurrentCalendar, appToCalendar }