# Vaishnavi Mishra — Photography & Tech Portfolio 📸✨

A modern, high-performance portfolio showcasing photography, videography, tech conference coverage, portraits, concerts, pet sessions, and hardware optics.

Built with **React 19**, **Vite**, **Tailwind CSS**, **Framer Motion**, and direct **Cloudinary** + **Nodemailer** integrations.

---

## 🌟 Features

- **Editorial Visual Aesthetics**: Dark rose tone palettes (`#2E141D`, `#DE4373`), Aceternity 3D tilt cards, and glowing radial vignettes.
- **Categorized Galleries & EXIF Inspector**: Fullscreen lightbox inspector with lens details, exposure settings, custom tone profiles, and tags.
- **Curated Collections**: Tech Events, Landscapes, Fauna, Concerts, Fur Babies, and Portraiture.
- **Direct Email Dispatch**: Built-in serverless Nodemailer endpoint (`/api/send-email`) sends client shoot inquiries directly to `vaishnavisudha111@gmail.com`.
- **Cloudinary CDN Integration**: Private Creator Studio endpoint (`/addphoto`) allows direct unsigned uploading to Cloudinary with metadata tagging.

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
```

### 3. Run Locally
```bash
npm run dev
```

---

## 📧 How to Setup Google App Password for Direct Emails

To allow the portfolio to send direct email inquiries from your Gmail:
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2. Enable **2-Step Verification** if not already enabled.
3. Search for **"App Passwords"** (or visit `myaccount.google.com/apppasswords`).
4. Enter an App Name (e.g. `Portfolio Contact Form`) and click **Create**.
5. Copy the generated **16-character password** (e.g., `abcd efgh ijkl mnop`).
6. Set `EMAIL_PASS="your_16_char_password"` in your `.env` (or Vercel Environment Variables).

---

## ☁️ Deployment on Vercel

1. Push to your GitHub repository.
2. Import project into [Vercel](https://vercel.com).
3. Under **Settings → Environment Variables**, add:
   - `VITE_CLOUDINARY_CLOUD_NAME` = `dcilsfof2`
   - `VITE_CLOUDINARY_UPLOAD_PRESET` = `portfolio_uploads`
   - `EMAIL_USER` = `vaishnavisudha111@gmail.com`
   - `EMAIL_PASS` = `<Your Google App Password>`
   - `EMAIL_TO` = `vaishnavisudha111@gmail.com`
4. Click **Deploy**. Both the Vite SPA and `/api/send-email` serverless function will deploy automatically!

---

## 👤 Author

**Vaishnavi Mishra**
- Instagram: [@vaishnaviii_ii](https://www.instagram.com/vaishnaviii_ii/)
- Behance: [vaishnavimishra16](https://www.behance.net/vaishnavimishra16)
- LinkedIn: [vaishnavi-mishra](https://www.linkedin.com/in/vaishnavi-mishra-b17ba6256)
- Email: [vaishnavisudha111@gmail.com](mailto:vaishnavisudha111@gmail.com)