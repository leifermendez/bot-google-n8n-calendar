import 'dotenv/config'
import { createBot, MemoryDB } from '@builderbot/bot'
import AIClass from './services/ai';
import flow from './flows';
// import { provider } from './provider';
import { whatsappProvider, telegramProvider } from './provider'; // Importa ambos proveedores para telegram


/** Puerto en el que se ejecutará el servidor */
const PORT = process.env.PORT ?? 3001
/** Instancia de la clase AI */
const ai = new AIClass(process.env.OPEN_API_KEY, 'gpt-4o-mini')

/**
 * Función principal que inicializa y configura el bot
 * @async
 */
const main = async () => {
    /** Objeto que contiene el servidor HTTP y el manejador de contexto */
    const { httpServer, handleCtx } = await createBot({
        database: new MemoryDB(),
        //provider,
        provider: [whatsappProvider, telegramProvider], // Usa ambos proveedores para telegram
        flow,
    }, { extensions: { ai } })

    /**
     * Ruta POST para enviar mensajes
     * @param {string} number - Número de teléfono del destinatario
     * @param {string} message - Mensaje a enviar
     * @param {string} [urlMedia] - URL del archivo multimedia (opcional)
     */
    provider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    /**
     * Ruta POST para registrar un nuevo usuario
     * @param {string} number - Número de teléfono del usuario
     * @param {string} name - Nombre del usuario
     */
    provider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    /**
     * Ruta POST para gestionar la lista negra
     * @param {string} number - Número de teléfono a añadir o eliminar de la lista negra
     * @param {('add'|'remove')} intent - Acción a realizar (añadir o eliminar)
     */
    provider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    /** Inicia el servidor HTTP en el puerto especificado */
    httpServer(+PORT)
}

// Ejecuta la función principal
main()
