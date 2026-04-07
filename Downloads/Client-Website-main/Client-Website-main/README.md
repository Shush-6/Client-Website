# ✦ Golden Hands Reiki — PERN Stack Website

A full-stack website for **Vibha's Golden Hands Reiki** healing business, built with:
- **P**ostgreSQL — database for services & contact messages
- **E**xpress.js — REST API backend
- **R**eact — frontend
- **N**ode.js — runtime

---

##  Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL installed and running
- A Gmail account (for sending emails)

---

### 2. Database Setup

```bash
# Create the database and tables
psql -U postgres -f server/schema.sql
```

---

### 3. Server Configuration

```bash
cd server
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
CLIENT_URL=http://localhost:3000

# PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=golden_hands
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Gmail credentials (use an App Password, not your real password)
# Go to: myaccount.google.com → Security → App Passwords
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    ← 16-char App Password

# Vibha's email where contact form submissions are sent
VIBHA_EMAIL=vibha@example.com
```

> **How to get Gmail App Password:**
> 1. Enable 2-Factor Authentication on your Google Account
> 2. Go to myaccount.google.com → Security → App Passwords
> 3. Create a new App Password for "Mail"
> 4. Copy the 16-character code into `SMTP_PASS`

---

### 4. Install & Run

```bash
# From the root directory:
npm install          # installs concurrently
npm run install:all  # installs server + client dependencies

# Start both server and client together:
npm run dev

# Or separately:
npm run dev:server   # Express API on http://localhost:5000
npm run dev:client   # React app on http://localhost:3000
```

Visit **http://localhost:3000** to see the website.

---

## 📸 Adding Vibha's Photo

In `client/src/App.js`, find this line at the top:

```js
const VIBHA_PHOTO = 'https://images.unsplash.com/...';
```

Replace the URL with:
- A local file: move the photo to `client/src/assets/vibha.jpg` and use `import vibhaPhoto from './assets/vibha.jpg'`
- Or an online URL to Vibha's actual photo

---

## 📁 Project Structure

```
golden-hands/
├── package.json              ← root scripts (run both server+client)
├── server/
│   ├── index.js              ← Express API (routes, email, DB)
│   ├── schema.sql            ← PostgreSQL schema + seed data
│   ├── .env.example          ← env template (copy to .env)
│   └── package.json
└── client/
    ├── public/index.html
    └── src/
        ├── App.js            ← main React component
        ├── App.css           ← all styles
        └── index.js
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Fetch all healing services |
| POST | `/api/contact` | Submit contact form (saves to DB + emails Vibha) |
| GET | `/api/health` | Health check |

---

## 📧 Email Flow

When a visitor submits the contact form:
1. Details are saved to PostgreSQL (`contact_messages` table)
2. A formatted email is sent to **Vibha's email** with all the details
3. An auto-reply is sent to the **visitor's email** confirming receipt

---

## 🎨 Customization

- **Colors/fonts**: Edit CSS variables at top of `client/src/App.css`
- **Services**: Edit seed data in `server/schema.sql` (or update via DB directly)
- **Contact details**: Update phone/address/email in the Contact section of `App.js`
- **Testimonials**: Edit the testimonials array in `App.js`

---

*Built with ✦ for Golden Hands Reiki by Vibha*
