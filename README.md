# Vaishnavi Mishra — Photography & Tech Portfolio 📸✨

A modern, high-performance portfolio showcasing photography, videography, tech conference coverage, portraits, concerts, pet sessions, and hardware optics.

Built with **React 19**, **Vite**, **Tailwind CSS**, **Framer Motion**, and direct **Cloudinary** + **Nodemailer** + **Persistent Serverless Database** integrations.

---

## 🌟 Features

- **Editorial Visual Aesthetics**: Dark rose tone palettes (`#2E141D`, `#DE4373`), Aceternity 3D tilt cards, and glowing radial vignettes.
- **Categorized Galleries & EXIF Inspector**: Fullscreen lightbox inspector with lens details, exposure settings, custom tone profiles, and tags.
- **Curated Collections**: Tech Events, Landscapes, Fauna, Concerts, Fur Babies, and Portraiture.
- **Direct Email Dispatch**: Built-in serverless Nodemailer endpoint (`/api/send-email`) sends client shoot inquiries directly to `vaishnavisudha111@gmail.com`.
- **Cloudinary CDN Ingest**: Dedicated Creator Studio endpoint (`/addphoto`) allows direct unsigned uploading to Cloudinary with metadata tagging.
- **Persistent Global Database**: All newly uploaded Cloudinary photos and curated **Top Picks** are saved in a serverless database (`/api/photos`) so they appear immediately for all visitors worldwide.
- **Protected Top Picks**: Only the creator (via `/addphoto`) can curate and star Top Picks. General visitors cannot alter the featured selection.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/VaishnaviiMishra/photpgrapgy_portfolio_vaishnavi.git
cd photpgrapgy_portfolio_vaishnavi
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):
```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME="dcilsfof2"
VITE_CLOUDINARY_UPLOAD_PRESET="portfolio_uploads"

# Email Configuration (Nodemailer)
EMAIL_USER="vaishnavisudha111@gmail.com"
EMAIL_PASS="your_16_char_google_app_password"
EMAIL_TO="vaishnavisudha111@gmail.com"

# Database Configuration (Optional for local dev, Recommended on Vercel)
UPSTASH_REDIS_REST_URL="https://your-upstash-db.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"
```

### 3. Run Locally
```bash
npm run dev
```

---

## 🗄️ Setting Up Persistent Database on Vercel (Free 1-Minute Setup)

To ensure that newly uploaded Cloudinary photos and Top Picks persist permanently for all global visitors on Vercel:

### **Option 1: Upstash Redis (Recommended & 100% Free)**
1. On your Vercel Project Dashboard, go to the **Storage** tab.
2. Click **Create Database** → Select **KV / Upstash Redis** (Free tier).
3. Connect it to your project. Vercel will automatically inject `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`)!

### **Option 2: GitHub Personal Access Token (Zero Database Sign-Up)**
1. Go to your [GitHub Settings → Developer Settings → Personal Access Tokens (Tokens classic)](https://github.com/settings/tokens).
2. Generate a token with `repo` scope.
3. In Vercel Project Settings → Environment Variables, add:
   - `GITHUB_TOKEN` = `ghp_your_token`
   - `GITHUB_REPO` = `VaishnaviiMishra/photpgrapgy_portfolio_vaishnavi`

---

## 📧 How to Setup Google App Password for Direct Emails

To allow the portfolio to send direct email inquiries from your Gmail:
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2. Enable **2-Step Verification** if not already enabled.
3. Search for **"App Passwords"** (or visit `myaccount.google.com/apppasswords`).
4. Enter an App Name (e.g. `Portfolio Emailer`) and click **Create**.
5. Copy the generated **16-character password** (e.g., `pblsatfbljjxnxvl`).
6. Set `EMAIL_PASS="pblsatfbljjxnxvl"` in your `.env` (or Vercel Environment Variables).

---

## 👤 Author

**Vaishnavi Mishra**
- Instagram: [@vaishnaviii_ii](https://www.instagram.com/vaishnaviii_ii/)
- Behance: [vaishnavimishra16](https://www.behance.net/vaishnavimishra16)
- LinkedIn: [vaishnavi-mishra](https://www.linkedin.com/in/vaishnavi-mishra-b17ba6256)
- Email: [vaishnavisudha111@gmail.com](mailto:vaishnavisudha111@gmail.com)