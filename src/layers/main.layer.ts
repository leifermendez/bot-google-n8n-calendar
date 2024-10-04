import { BotContext, BotMethods } from "@builderbot/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "../services/ai"
import { flowSeller } from "../flows/seller.flow"
import { flowSchedule } from "../flows/schedule.flow"
import { handleHistory } from "../utils/handleHistory";

const url = 'https://primary-production-1a67.up.railway.app/webhook/abc11b34-9ca3-41f8-888-4ff45908d2ec';

const data = {
  phone: "600000000",
  history: History
};

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
};

fetch(url, options)
  .then(response => response.json())
  .then(responseData => {
    console.log('Success:', responseData);
  })
  .catch(error => {
    console.error('Error:', error);
  });

const PROMPT_DISCRIMINATOR = `### Historial de Conversación (Vendedor/Cliente) ###
{HISTORY}

### Intenciones del Usuario ###

**HABLAR**: Selecciona esta acción si no sabes si el cliente cumple los requisitos, si el cliente no cumple los requisitos o el cliente parece necesitar más información sobre el negocio, servicio o informarse del horario de atencion.
**PROGRAMAR**: Selecciona esta acción únicamente cuando el cliente determine la hora y fecha para programar una cita. Tienes prohibido seleccionar esta acción si el cliente no ha proporcionado fecha y hora. Solo puedes seleccionar esta opción si el cliente dice fecha y hora. Cuando el cliente nos dice que cumple todos los requisitos pero no incluye ninguna fecha y hora tienes prohibido seleccionar esta acción, debes seleccionar la acción HABLAR.

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