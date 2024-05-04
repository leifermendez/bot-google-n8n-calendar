import { createProvider } from '@builderbot/bot'
import { WaliProvider } from '@builderbot-plugins/wali'

export const provider = createProvider(WaliProvider,{
    deviceId:process.env.CONSOLE_DEVICE_ID,
    token:process.env.CONSOLE_KEY,
    api:'https://wa-api.builderbot.app'
})