# SkillSync Frontend (React + Vite)

UI-only React recreation of the SkillSync FSD project (HTML, Bootstrap, and custom CSS). No backend or localStorage persistence—pages use static mock data for display.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login`, `/register` | Auth screens |
| `/admin/login`, `/admin/register` | Admin auth |
| `/student/dashboard` | Student dashboard |
| `/organizer/dashboard` | College/company dashboard |
| `/admin/dashboard` | Admin panel (tabbed sections) |
| `/opportunities` | Browse opportunities (student) |
| `/opportunities?view=organizer` | Organizer opportunity list |
| `/opportunities/add` | Post opportunity form |
| `/applications` | Student applications |
| `/applications?view=organizer` | Received applications |
| `/profile` | Profile settings |

Login and register forms navigate to dashboards for UI preview only; data is not saved.
