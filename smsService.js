require("dotenv").config();
// Serviço simples de envio de SMS via Twilio
// Instale: npm install twilio
// Variáveis esperadas no .env:
// TWILIO_ACCOUNT_SID=xxxx
// TWILIO_AUTH_TOKEN=xxxx
// TWILIO_FROM=+1XXXXXXXXXX (número remetente verificado)

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM
} = process.env;

let client = null;
try {
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } else {
    console.warn("[smsService] Variáveis TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN ausentes.");
  }
} catch (e) {
  console.warn("[smsService] Biblioteca twilio não instalada ainda.");
}

/**
 * Envia um SMS.
 * @param {string} to Número destino em formato E.164 (+55...)
 * @param {string} body Conteúdo do SMS
 * @returns {Promise<object>} Resultado ou erro
 */
async function enviarSMS(to, body) {
  if (!client) {
    throw new Error("Cliente Twilio indisponível (verifique instalação e .env)");
  }
  if (!TWILIO_FROM) {
    throw new Error("TWILIO_FROM não definido no .env");
  }
  if (!to || !body) {
    throw new Error("Parâmetros obrigatórios: to, body");
  }
  try {
    const msg = await client.messages.create({
      from: TWILIO_FROM,
      to,
      body
    });
    return { sid: msg.sid, status: msg.status };
  } catch (err) {
    console.error("Erro ao enviar SMS:", err);
    throw err;
  }
}

module.exports = { enviarSMS };