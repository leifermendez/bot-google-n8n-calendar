import { BotContext, BotMethods } from "@builderbot/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "../services/ai"
import { flowSeller } from "../flows/seller.flow"
import { flowSchedule } from "../flows/schedule.flow"

const PROMPT_DISCRIMINATOR = `### Historial de Conversación (Vendedor/Cliente) ###
{HISTORY}

### Intenciones del Usuario ###

**HABLAR**: Selecciona esta acción si no sabes si el cliente cumple los requisitos, si el cliente no cumple los requisitos o el cliente parece necesitar más información sobre el negocio, servicio o informarse del horario de atencion.
**PROGRAMAR**: Selecciona esta acción unicamente cuando el cliente determine la hora y fecha para programar una cita. Tienes prohibido seleccionar esta acción si el cliente no ha proporcionado fecha y hora.

### Instrucciones ###

Por favor, analiza la siguiente conversación y determina la intención del usuario.`

export default async (_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    const prompt = PROMPT_DISCRIMINATOR.replace('{HISTORY}', history)


    console.log(prompt)

    const { prediction } = await ai.determineChatFn([
        {
            role: 'system',
            content: prompt
        }
    ])


    console.log({ prediction })

    if (prediction.includes('HABLAR')) return gotoFlow(flowSeller)
    if (prediction.includes('PROGRAMAR')) return gotoFlow(flowSchedule)
}