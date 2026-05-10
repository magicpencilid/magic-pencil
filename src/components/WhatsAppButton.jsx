/* =============================================
   💬 WHATSAPP BUTTON — Floating WA link (raw HTML)
   
   Server component, zero JS. Output langsung sebagai
   HTML mentah biar 100% muncul.
   ============================================= */

const WA_NUMBER = "628111150563";
const WA_MSG = encodeURIComponent(
  "Halo admin Magic Pencil! Saya mau tanya-tanya tentang kursus menggambar."
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

export default function WhatsAppButton() {
  return (
    <div
      id="wa-btn-fixed"
      style={{ position: "fixed", right: "16px", bottom: "16px", zIndex: 999999 }}
    >
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: "60px",
          height: "60px",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        aria-label="Chat via WhatsApp"
      >
        <svg viewBox="0 0 32 32" style={{ width: "30px", height: "30px", fill: "#fff", display: "block" }}>
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.692.713 5.218 1.961 7.42L2 30l6.695-1.93A13.948 13.948 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.855 19.645c-.36.933-1.046 1.72-1.936 2.067-.49.192-1.046.295-1.607.293a4.998 4.998 0 01-1.428-.2c-2.302-.633-4.346-2.173-5.838-3.798-1.565-1.636-2.628-3.574-3.09-5.21a5.866 5.866 0 01-.2-1.607 3.87 3.87 0 01.293-1.607c.346-.89 1.134-1.576 2.067-1.936.203-.08.42-.122.64-.125.223-.004.445.03.653.1.332.11.626.305.856.567l1.64 1.833a1.155 1.155 0 01.155 1.23c-.06.12-.145.228-.25.32l-.654.654a.486.486 0 00-.138.382c.022.164.072.323.146.47.388.82 1.011 1.578 1.72 2.21.71.632 1.495 1.14 2.36 1.494.18.07.368.112.56.125a.486.486 0 00.382-.138l.654-.654a1.155 1.155 0 011.23-.155c.102.055.2.12.29.195l1.833 1.64c.262.23.457.524.567.856.07.208.104.43.099.654-.002.22-.045.436-.124.64z" />
        </svg>
      </a>
    </div>
  );
}
