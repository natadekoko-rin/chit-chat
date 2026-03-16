# Akses Chat App Dari Network (Jaringan Lokal)

## ✅ Sudah Dikonfigurasi

File `vite.config.ts` sudah diupdate dengan:

```typescript
server: {
  host: '0.0.0.0',  ← Expose ke network
  port: 5173,
  open: true,
}
```

---

## 🚀 Cara Akses (3 Langkah)

### Step 1: Cari IP Address Komputer Anda

#### Windows PowerShell:
```powershell
ipconfig
```

Cari bagian **IPv4 Address** di network adapter:
```
Ethernet adapter Ethernet:
  ...
  IPv4 Address. . . . . . . . . . : 192.168.1.100
                                     ↑ Ini IP Anda
```

#### Atau Gunakan Shortcut:
```powershell
ipconfig | findstr "IPv4"
```

**Hasilnya:** `192.168.x.x` atau `10.0.x.x`

---

### Step 2: Run Aplikasi

```bash
npm run dev
```

Sekarang Anda akan melihat output seperti:

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

---

### Step 3: Akses Dari Device Lain

#### Dari Laptop/PC Lain (1 Jaringan):

Di browser, masukkan URL:
```
http://192.168.1.100:5173/
```

Ganti `192.168.1.100` dengan **IP sempurna Anda**

#### Dari Smartphone (1 Jaringan):

Buka browser, masukkan IP Anda:
```
http://192.168.1.100:5173/
```

---

## 📱 Contoh Scenario

### Setup
```
Komputer A (Server): 192.168.1.100
  └─ npm run dev (berjalan)

Komputer B (Client): 192.168.1.101
Smartphone (Client): 192.168.1.105
```

### Login & Chat

**Komputer A** - Login sebagai "alice"
```
Browser: http://192.168.1.100:5173/
Username: alice
Chat: "Hello world!"
```

**Komputer B** - Login sebagai "bob"
```
Browser: http://192.168.1.100:5173/
Username: bob
Chat: "Hi alice!" ← Alice melihat instantly!
```

**Smartphone** - Login sebagai "charlie"
```
Browser: http://192.168.1.100:5173/
Username: charlie
Chat: "Hi both!" ← Keduanya lihat instantly!
```

✅ **Semua bisa chat real-time!**

---

## 🔧 Troubleshooting

### Masalah: "Cannot connect to 192.168.x.x"

**Solusi 1: Firewall**
- Windows Firewall mungkin block port 5173
- Open firewall settings dan allow Node.js

**Solusi 2: Cek IP yang Benar**
```powershell
ipconfig
```
Pastikan IP di command prompt sama dengan URL yang Anda buka

**Solusi 3: Cek Network**
- Pastikan device 1 jaringan WiFi/Ethernet yang sama
- Ping test:
  ```powershell
  ping 192.168.1.100
  ```

### Masalah: Hanya localhost yang work

Cek vite.config.ts sudah include `host: '0.0.0.0'`:
```typescript
server: {
  host: '0.0.0.0',  ← Harus ada!
  port: 5173,
}
```

---

## 📋 Checklist

- [ ] vite.config.ts updated dengan `host: '0.0.0.0'`
- [ ] Run `npm run dev`
- [ ] Cari IP address komputer
- [ ] Bukadi browser device lain: `http://[IP]:5173/`
- [ ] Test login & chat multi-device

---

## 🎯 Quick Commands

**Cari IP:**
```powershell
ipconfig | findstr "IPv4"
```

**Run dev (network accessible):**
```bash
npm run dev
```

**Test koneksi ke server:**
```powershell
ping 192.168.1.100
```

---

## Real-World Use Cases

### 1️⃣ Testing Multi-User Chat
- Buka 2-3 browser dengan device berbeda
- Test real-time messaging
- Test session persistence

### 2️⃣ Demo ke Client/Teman
- Host aplikasi di komputer Anda
- Beri IP address ke teman
- Mereka bisa akses langsung via network

### 3️⃣ Mobile Testing
- Run di laptop/desktop
- Test di smartphone (1 WiFi sama)
- Lihat responsiveness di mobile screen

---

## ✅ Sekarang Siap!

Aplikasi Anda sudah bisa diakses dari mana saja di jaringan yang sama! 🚀

Coba:
```bash
npm run dev
```

Ambil IP, share ke teman, dan start chatting! 💬
