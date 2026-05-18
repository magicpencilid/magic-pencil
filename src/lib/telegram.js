/* =============================================
   TELEGRAM — Kirim notif ke admin via Bot
   
   Butuh:
   - TELEGRAM_BOT_TOKEN dari @BotFather
   - TELEGRAM_CHAT_ID dari chat/group tujuan
   ============================================= */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

/**
 * Kirim pesan teks ke chat admin via Telegram Bot
 * 
 * @param {string} text - Pesan yang mau dikirim
 * @returns {Promise<object>} Hasil dari API Telegram
 */
export async function sendTelegram(text) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram: BOT_TOKEN atau CHAT_ID belum diisi");
    return { success: false, error: "Not configured" };
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      console.error("Telegram API error:", data);
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (error) {
    console.error("Telegram send error:", error);
    return { success: false, error: error.message };
  }
}
