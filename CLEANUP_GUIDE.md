# Database Cleanup Guide

Cleanup script untuk menghapus users dan messages dari Firebase Firestore.

## Installation

Tidak perlu install tambahan - gunakan npm scripts langsung:

```bash
npm install
```

## Usage

### Clean All Users and Messages

Menghapus semua users dan messages sekaligus:

```bash
npm run clean:all
```

### Clean Only Users

Menghapus semua users saja:

```bash
npm run clean:users
```

### Clean Only Messages

Menghapus semua messages saja:

```bash
npm run clean:messages
```

### Help

Melihat bantuan:

```bash
npm run clean
```

## Output Example

```
🧹 Cleaning entire database...

🗑️  Deleting all users...
✅ Deleted 3 users
🗑️  Deleting all messages...
✅ Deleted 15 messages

✨ Database cleaned successfully!
```

## When to Use

- **Development/Testing**: Reset database sebelum testing baru
- **Fresh Start**: Mulai dengan database kosong
- **Cleanup**: Remove test data sebelum production

## What Gets Deleted

| Collection | What Gets Deleted |
|-----------|------------------|
| `users` | Semua user documents |
| `messages` | Semua message documents |

## Safety Notes

⚠️ **WARNING**: Script ini akan **permanent delete** data. Tidak bisa di-undo!

- Backup data sebelum menjalankan
- Script hanya bisa dijalankan dari development machine dengan Firebase credentials
- Tidak akan berjalan jika Firebase belum dikonfigurasi

## Script Details

Located at: `src/scripts/cleanDatabase.js`

- Uses Firebase SDK
- Reads dari environment config
- Safe error handling
- Clear console output
