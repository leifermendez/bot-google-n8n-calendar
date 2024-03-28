import { EVENTS, addKeyword } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import AIClass from "src/services/ai";
import { processAudio } from "src/utils/process";
import { welcomeFlow } from "./welcome.flow";
import mainLayer from "src/layers/main.layer";
import { handleHistory } from "src/utils/handleHistory";

const voiceFlow = addKeyword<BaileysProvider>(EVENTS.VOICE_NOTE)
    .addAction(async (_, {  flowDynamic }) => {
        await flowDynamic(`dame un momento para esucharte...`)
    })
    .addAction(async (ctx: any, { provider, extensions, gotoFlow, state }) => {
        try{
            const ai = extensions.ai as AIClass
            const pathVoice = await provider.saveFile(ctx)
            const mp3Path = await processAudio(pathVoice)
            const text = await ai.voiceToText(mp3Path)
            await handleHistory({ content: text, role: 'user' }, state)
            return gotoFlow(welcomeFlow)
        }catch(e){
        console.log(`Err`,e)}
    })
    .addAction(mainLayer)

export { voiceFlow }