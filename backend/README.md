## Skill Swap Platform – Backend

### 1. What is this?
A lightweight Node.js + Express API that lets people **exchange skills**.  It stores data in **MongoDB** (Atlas in production) and exposes REST endpoints for everything: registering users, posting skills, sending swap requests, ratings, admin tools, and more.

---
### 2. Project layout (plain-English)
```
src/
│
├── config/         ← one-time setup (Mongo connection, ENV variables)
├── controllers/    ← the “brains” – each file decides **what to do** for a request
├── middleware/     ← little helpers that run **before** controllers (auth, validation, uploads)
├── models/         ← Mongoose schemas = structure of the data in MongoDB
├── routes/         ← URL → controller wiring (e.g. POST /api/auth/login)
├── utils/          ← small reusable utilities (e-mails, tokens…)
├── scripts/        ← stand-alone Node scripts (e.g. DB seeding)
└── uploads/        ← profile photos saved locally (dev only)
```
If you only remember one thing: **routes → controllers → models** is the request flow.

---
### 3. Prerequisites
1. **Node.js ≥ 18** & npm  
2. A free **MongoDB Atlas** account (or local Mongo if you prefer)  
3. Git (for cloning the repo)

---
### 4. Connecting to MongoDB Atlas (once-off)
1. Sign-up / log-in at <https://cloud.mongodb.com>.
2. Create a **Shared Cluster** → keep the free tier.
3. In **Database Access** add a user (e.g. `skillswap_user` / strong password).
4. In **Network Access** add your IP (or `0.0.0.0/0` while testing).
5. Press **Connect → Drivers → Node.js** and copy the URI, e.g.
   ```
   mongodb+srv://skillswap_user:<PASSWORD>@cluster0.abcde.mongodb.net/skill_swap_db?retryWrites=true&w=majority
   ```
6. Paste that into **`.env`** as `MONGODB_URI=` (replace `<PASSWORD>`).

---
### 5. Getting the backend running locally
```bash
# 1. Clone & cd
git clone <your-fork-url>
cd backend

# 2. Install packages
npm install

# 3. Environment file
cp .env.example .env   # then open .env and fill secrets (see step 4)

# 4. Start the API (watch mode)
npm run dev            # or: npm start  (without nodemon)

# 5. (Optional) seed an admin user
npm run seed           # uses ADMIN_EMAIL / ADMIN_PASSWORD from .env
```
The server should print `🚀 Server running on port 5000` and `✅ MongoDB connected successfully`.

---
### 6. Trying the API in Postman
1. **Import routes quickly**: Postman → Import → *Raw Text* → paste the contents of `API_DOCUMENTATION.md`. Postman auto-creates a collection with all calls.
2. Set `{{baseUrl}}` collection variable to `http://localhost:5000/api` (or Render URL once deployed).
3. **Register or login** using the auth requests – copy the returned **token**.
4. In the collection’s **Authorization** tab choose **Bearer Token** and paste the token. All subsequent calls inherit it.
5. For **admin** tests login with the seeded admin credentials, plug that token instead.

Tip:  create two environments in Postman – *User* and *Admin* – each with its own `token` variable.

---
### 7. Debugging 101
• **Mongo fails to connect?**  Check `MONGODB_URI`, internet, or Atlas IP allow list.  
• **Server crashes on start?**  Read the stack-trace – most times an env var is missing.  
• **API returns 401?**  You forgot to send `Authorization: Bearer <token>`.  
• Live-reload: `npm run dev` uses **nodemon** – it restarts automatically when you edit files.

Use `console.log()` generously inside controllers; logs appear in the terminal.

---
### 8. Connecting to your (frontend) React/Vue/… app
1. Host or run the frontend (e.g. `http://localhost:3000`).
2. In backend `.env` set `FRONTEND_URL=http://localhost:3000` – this enables CORS.
3. All frontend requests hit `http://localhost:5000/api/...`.
4. Store the JWT (localStorage or cookies) and attach it to the **Authorization** header.

---
### 9. Deploying the backend on Render.com
1. Push your code to GitHub.
2. In Render → **New Web Service** → connect your repo.
3. Environment: **Node**; Region: pick nearest.
4. **Build Command:** `npm install` (Render detects automatically but explicit is fine).
5. **Start Command:** `node src/server.js`.
6. Add all required **Environment Variables** exactly as in your local `.env` (never commit secrets!).
7. Click **Create Web Service** – Render will build & deploy.
8. In Atlas add Render’s outbound IP to the allow list; redeploy if needed.
9. Update your Postman `{{baseUrl}}` to Render’s URL (e.g. `https://skill-swap.onrender.com/api`).

---
### 10. What’s next?
• Add unit tests, rate limiting, analytics…  
• Set up CI/CD to auto-deploy on push.  
• Frontend integration for a polished user experience.

Enjoy building and sharing skills! 🚀
