import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { addMinutes, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { appToCalendar } from "src/services/calendar";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
const TIME_ZONE = process.env.TZ
const WAIT_TIME = 40 * 60 * 1000; 

const callCalendarAPI = async () => {
    const response = await fetch('https://api.endpoint.com');
    const data = await response.json();
    return data;
};

/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirm = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic }) => {
    await flowDynamic('Ok, voy a pedirte unos datos para agendar')
    await flowDynamic('¿Cual es tu nombre?')
}).addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow(`¿Como puedo ayudarte?`)

    }
    await state.update({ name: ctx.body })
    await flowDynamic(`Ultima pregunta ¿Cual es tu email?`)
})
    .addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {

        if (!ctx.body.includes('@')) {
            return fallBack(`Debes ingresar un mail correcto`)
        }

        const dateObject = {
            name: state.get('name'),
            email: ctx.body,
            startDate: utcToZonedTime(state.get('desiredDate'), TIME_ZONE),
            endData: utcToZonedTime(addMinutes(state.get('desiredDate'), +DURATION_MEET), TIME_ZONE),
            phone: ctx.from
        }

        await appToCalendar(dateObject)

        clearHistory(state)
        await flowDynamic('Listo! agendado Buen dia')

    setTimeout(async () => {
        const apiData = await callCalendarAPI();
        await flowDynamic(`Aquí tienes la información que prometí: ${apiData}`);
    }, WAIT_TIME);
});

export { flowConfirm }