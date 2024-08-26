import { createProvider } from '@builderbot/bot';
import { BaileysProvider } from '@builderbot/provider-baileys';
import { TelegramProvider } from '@builderbot/provider-telegram'; // Importa el proveedor de Telegram

// Configura el proveedor de WhatsApp
const whatsappProvider = createProvider(BaileysProvider, {
  groupsIgnore: true,
  readStatus: false,
});

// Configura el proveedor de Telegram
const telegramProvider = createProvider(TelegramProvider, {
  botToken: process.env.TELEGRAM_BOT_TOKEN,  // Asegúrate de tener el token del bot en tus variables de entorno
});

// Exporta ambos proveedores
export { whatsappProvider, telegramProvider };
