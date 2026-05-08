# Tahap 11 — Workflow Fitur Baru Magic Pencil

```mermaid
flowchart TB
    %% ===== LEGEND =====
    subgraph Legend["📖 LEGENDA"]
        direction LR
        L1["👤 User Action"] 
        L2(["📱 System Response"])
        L3{"⚙️ Decision"}
        L4[("📁 Database")]
    end

    %% ===== ROLES =====
    subgraph Roles["👥 ROLE"]
        Admin[("👨‍💼 Admin")]
        Murid[("👦 Murid")]
        Pengunjung[("👤 Pengunjung")]
    end

    %% ===== FLOW PENDAFTARAN (EXISTING) =====
    subgraph Daftar["📝 PENDAFTARAN"]
        P_Daftar["Daftar via Web"] --> P_WA["WA Notif ke Admin"]
        P_WA --> P_Verif["Admin Verifikasi"]
        P_Verif --> P_Terdaftar["Murid Terdaftar ✅"]
        P_Terdaftar --> P_DB[(Database: murid)]
    end

    %% ===== FLOW PEMBAYARAN + INVOICE (EXISTING) =====
    subgraph Bayar["💰 PEMBAYARAN & INVOICE"]
        B_Invoice["Cek Invoice via Web"] --> B_Upload["Upload Bukti Bayar"]
        B_Upload --> B_WA["WA Notif ke Admin"]
        B_WA --> B_Verif["Admin Verif Pembayaran"]
        B_Verif --> B_Lunas[✅ Lunas]
        B_Lunas --> B_DB[(Database: pembayaran)]
    end

    %% ===== FLOW BARU: MURID LOGIN + DASHBOARD =====
    subgraph Login["🔑 FITUR BARU: LOGIN MURID"]
        L_Masuk["Murid Login<br/>(email/WA + password)"] --> L_Cek{"Data Cocok?"}
        L_Cek -->|Ya| L_Dashboard["Dashboard Murid"]
        L_Cek -->|Tidak| L_Gagal["❌ Gagal Login"]
        L_Dashboard --> L_DB[(Database: akun_murid)]
    end

    %% ===== FLOW BARU: ABSENSI CHECK-IN/OUT =====
    subgraph Absen["📋 FITUR BARU: ABSENSI"]
        A_Sesi["Jadwal Hari Ini"] --> A_QR["Scan QR Code<br/>atau Check-in Manual"]
        A_QR --> A_Cek{"Masuk Waktu?"}
        A_Cek -->|Ya| A_Masuk["✅ Check-in"]
        A_Cek -->|Tidak| A_Telat["⚠️ Telat"]
        A_Masuk --> A_Sesi2["Ikut Kelas"]
        A_Sesi2 --> A_Pulang["Check-out"]
        A_Pulang --> A_DB[(Database: absensi)]
    end

    %% ===== FLOW BARU: JADWAL KELAS =====
    subgraph Jadwal["🗓️ FITUR BARU: JADWAL KELAS"]
        J_Tampil["Tampil Jadwal"] --> J_Murid["Murid Lihat Jadwal"]
        J_Murid --> J_Histori["Riwayat Kelas"]
        J_Tampil --> J_Admin["Admin Atur Jadwal<br/>(existing)"]
        J_DB[(Database: jadwal)]
    end

    %% ===== FLOW NOTIFIKASI =====
    subgraph Notif["🔔 FITUR BARU: NOTIFIKASI"]
        N_Pendaftar["Ada Pendaftar Baru"] --> N_WA["WA ke Admin<br/>(existing)"]
        N_Pendaftar --> N_Push["Push Notif ke HP Admin<br/>(PWA baru)"]
        N_Bayar["Ada Pembayaran Masuk"] --> N_WA
        N_Bayar --> N_Push
        N_Jadwal["Jadwal Dimulai"] --> N_Push_Murid["Push Notif ke HP Murid<br/>(PWA baru)"]
    end

    %% ===== PWA =====
    subgraph Pwa["📲 PROGRESSIVE WEB APP"]
        PW_Install["Install ke Home Screen"] --> PW_Notif["Push Notification"]
        PW_Notif --> PW_Offline["Cache dasar"]
    end

    %% ===== CONNECTIONS =====
    P_Terdaftar --> L_Masuk
    B_Lunas --> L_Dashboard
    L_Dashboard --> A_Sesi
    A_DB --> J_Histori
    J_Tampil --> A_Sesi
    N_Push --> Admin
    N_Push_Murid --> Murid
    L_Dashboard --> B_Invoice
```

## Alur Kerja:

### 1️⃣ Pendaftaran (Existing)
- User daftar → WA notif admin → Admin verif → Murid terdaftar ✅

### 2️⃣ Pembayaran & Invoice (Existing)
- Murid cek invoice → Upload bukti → WA notif admin → Admin verif ✅

### 3️⃣ 🔥 Baru: Login Murid
- Setelah terdaftar, murid bisa bikin akun login
- Dashboard pribadi: liat jadwal, absensi, tagihan

### 4️⃣ 🔥 Baru: Absensi Check-in/out
- Murid buka dashboard → Cek jadwal hari ini → Check-in (QR/manual)
- Ikut kelas → Check-out → Tersimpan otomatis

### 5️⃣ 🔥 Baru: Jadwal Kelas
- Admin atur jadwal (existing) + Murid lihat jadwal pribadi
- Riwayat kelas yang sudah diikuti

### 6️⃣ 🔥 Baru: Notifikasi Push (PWA)
- Pendaftar baru + Pembayaran masuk → Push ke HP admin
- Jadwal mulai → Push ke HP murid

---

**Gimana willy?** Ada yang mau ditambah/dikurang dari skema ini? Kalo udah oke, mamat mulai bikin backendnya! 🚀😊
