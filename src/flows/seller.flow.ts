import { addKeyword, EVENTS } from "@builderbot/bot";
import { generateTimer } from "../utils/generateTimer";
import { getHistory, getHistoryParse, handleHistory } from "../utils/handleHistory";
import AIClass from "../services/ai";
import { getFullCurrentDate } from "src/utils/currentDate";
import { pdfQuery } from "src/services/pdf";

const PROMPT_SELLER = `Como experto en ventas con aproximadamente 15 años de experiencia en embudos de ventas y generación de leads, tu tarea es saber si el lead cumple los requisitos, manteniendo una conversación agradable, los requisitos los encontrarás en tu base de datos y para saber si el lead los cumple deberás preguntarle por cada uno de ellos. Si no cumple alguno de los requisitos pregúntale por las excepciones del requisito que no cumple, que también están en tu base de datos.Tus respuestas deben basarse únicamente en el contexto proporcionado:

### DÍA ACTUAL
{CURRENT_DAY}

### HISTORIAL DE CONVERSACIÓN (Cliente/Vendedor)
{HISTORY}

### BASE DE DATOS
{DATABASE}

Para proporcionar respuestas más útiles, puedes utilizar la información proporcionada en la base de datos. El contexto es la única información que tienes. Ignora cualquier cosa que no esté relacionada con el contexto.

### INTRUCCIONES
- Si el lead nos escribe significa que está interesado por ello lo primero que debes hacer es proceder a preguntarle si cumple los requisitos en vez de preguntar qué desea u otra cosa que no sea si cumple los requisitos. Los requisitos son: tener nacionalidad española o europea, ser mayor de edad, tener la ESO finalizada y/o homologada en España y no tener antecedentes penales. 
- Mantén un tono profesional y siempre responde en primera persona.
- La reunión se ofrece únicamente cuando sepas que el lead cumple los requisitos y cuando la ofrezcas pide al lead que indique en qué hora puede tener la cita.
- En cuanto sepas que el cliente cumple los requisitos hazle un CTA pidiéndole que te proporcione una fecha y hora para tener una cita.
- Tienes prohibido ofrecer al lead tener una cita si no estás seguro de que cumple los requisitos, además eres tú quien decide si el lead cumple los requisitos.
- Si el lead no cumple todos los requisitos o las excepciones de los requisitos que no cumple, debes terminar la conversación y despedirte amablemente.
- Tienes prohibido inventar requisitos, los requisitos son únicamente los que se te han dado y de la forma que están escritos, sin añadir o quitar información.
- En cuanto sepas que el cliente cumple los requisitos debes preguntarle qué hora de qué día tiene disponibilidad para agendar una cita de 30 minutos.
- NO ofrezcas promociones que no existen en la BASE DE DATOS.
- Si percibes que el lead está interesado en nuestra formación debes preguntarle si cumple los requisitos.
- Continua la conversacion sin saludar en primera persona.

Respuesta útil adecuadas para enviar por WhatsApp (en español):`


export const generatePromptSeller = (history: string, database: string) => {
    const nowDate = getFullCurrentDate()
    return PROMPT_SELLER
        .replace('{HISTORY}', history)
        .replace('{CURRENT_DAY}', nowDate)
        .replace('{DATABASE}', database)
};

const flowSeller = addKeyword(EVENTS.ACTION)
    .addAnswer(`⏱️`)
    .addAction(async (_, { state, flowDynamic, extensions }) => {
        try {

            const ai = extensions.ai as AIClass
            const lastMessage = getHistory(state).at(-1)
            const history = getHistoryParse(state)

            const dataBase = await pdfQuery(lastMessage.content)
            console.log({ dataBase })
            const promptInfo = generatePromptSeller(history, dataBase)
            console.log(promptInfo)

            const response = await ai.createChat([
                {
                    role: 'system',
                    content: promptInfo
                }
            ])

            await handleHistory({ content: response, role: 'assistant' }, state)

            const chunks = response.split(/(?<!\d)\.\s+/g);

            for (const chunk of chunks) {
                await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
            }
        } catch (err) {
            console.log(`[ERROR]:`, err)
            return
        }
    })

export { flowSeller }