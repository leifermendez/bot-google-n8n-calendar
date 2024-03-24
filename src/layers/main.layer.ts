import { BotContext, BotMethods } from "@builderbot/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "../services/ai"
import { flowSeller } from "../flows/seller.flow"
import { flowSchedule } from "../flows/schedule.flow"

const PROMPT_DISCRIMINATOR = `### Historial de Conversación (Vendedor/Cliente) ###
{HISTORY}

### Intenciones del Usuario ###

**HABLAR**: Selecciona esta acción si el cliente parece necesitar más información sobre el negocio o servicio.
**PROGRAMAR**: Selecciona esta acción si el cliente muestra intención de programar una cita, agendar un evento, reservar un espacio, apartar un tiempo, coordinar una reunión, establecer un horario, o cualquier variante de planificación de tiempo.

### Instrucciones ###

Por favor, analiza la siguiente conversación y determina la intención del usuario.`

export default async (_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    const prompt = PROMPT_DISCRIMINATOR


    console.log(prompt.replace('{HISTORY}', history))

    const { prediction } = await ai.determineChatFn([
        {
            role: 'system',
            content: prompt.replace('{HISTORY}', history)
        }
    ])


    console.log({ prediction })

    if (prediction.includes('HABLAR')) return gotoFlow(flowSeller)
    if (prediction.includes('PROGRAMAR')) return gotoFlow(flowSchedule)
}