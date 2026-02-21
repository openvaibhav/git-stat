# 🔥 GIT-STAT : GitHub Analytics Dashboard

A full-featured GitHub analytics dashboard that visualizes developer activity, repository stats, contribution patterns, and repository issue tracking in a competitive stats-style UI.

Built with React and powered by GitHub REST + GraphQL APIs.

---

## 🚀 Features

---

## 👤 Profile Overview

* Avatar, name, username
* Followers & following
* Public repository count
* Company & location
* Website/blog link
* Join date
* Responsive profile card layout

---

## 📊 Contribution Analytics

* Total contributions (last year)
* Current streak (UTC-safe calculation)
* Highest streak
* Contribution heatmap calendar
* GraphQL-powered contribution fetching

---

## 📦 Repository Tracker

* Latest repositories list
* Stars & forks per repo
* Language tags
* Sorted by last updated
* Copy repository link button
* Clean scrollable stat panel

---

## 🥧 Language Rank Distribution

* Pie chart of most-used languages
* Repo-based aggregation
* Custom color palette
* Responsive resizing

---

# 🐛 GFIS : GitHub Issues System

A fully integrated Issues Tracker page with advanced filtering and pagination.

### 🔎 Repository Search

* Paste any GitHub repository link
* Auto-extract owner + repo
* Fetch live issue data

### 🎛 Filtering System

* Open / Closed toggle
* Label-based filtering
* Dynamically loads all repository labels (multi-page fetch)
* Clean filter bar UI

### 📄 Pagination

* Real GitHub API pagination
* Page navigation controls
* Page state preserved
* Filter + pagination integration

### 📌 Issue Cards

* Clickable issue title (opens GitHub issue in new tab)
* Author & comment count
* Label badges (color-coded)
* Open / Closed status indicator

---

## 🖥️ UI Theme

* Dark dashboard style
* Neon green accent highlights
* Card-based stat modules
* Responsive layout
* Centered heatmap footer
* Clean stat-panel aesthetic

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Chart.js
* react-chartjs-2
* react-github-calendar

### APIs

* GitHub REST API
* GitHub GraphQL API (Contributions)
* GitHub Pagination System

---

## 📂 Project Structure

```
src/
 ├─ pages/
 │   ├─ GFIS.js
 ├─ components/
 ├─ App.js
 ├─ App.css
 ├─ index.js
public/
.env
package.json
README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone repo

```
git clone https://github.com/YOUR_USERNAME/git-stat.git
cd git-stat
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Create environment file

Create `.env` in root:

```
REACT_APP_GITHUB_TOKEN=your_github_token_here
```

⚠️ Must start with `REACT_APP_`

---

## 🔑 Generating GitHub Token

1. GitHub → Settings
2. Developer Settings → Personal Access Tokens
3. Create Fine-grained or Classic token

Recommended permissions:

* User metadata → Read
* Repository metadata → Read

GraphQL access required for contributions.

---

## ▶️ Run locally

```
npm start
```

App runs on:

```
http://localhost:3000
```

---

## 📊 Data Sources

| Data          | Source          |
| ------------- | --------------- |
| Profile info  | REST API        |
| Repo stats    | REST API        |
| Stars / forks | REST API        |
| Issues        | REST API        |
| Labels        | REST API        |
| Contributions | GraphQL API     |
| Heatmap       | GitHub Calendar |

---

## 🧠 Contribution Logic

* Longest streak → historical forward scan
* Current streak → reverse scan
* Skips current UTC day if not updated
* GraphQL calendar parsing

---

## 🔄 API Handling

* REST pagination for issues
* REST pagination for labels (multi-page fetch)
* Controlled `useEffect` refetch logic
* Clean dependency management
* No infinite re-render loops

---

## 🔒 Security Notes

* Tokens stored in `.env`
* `.env` ignored via `.gitignore`
* Token required for GraphQL
* For production → move token to backend proxy

---

## 📸 Preview

<img width="1620" height="1398" alt="Screenshot 2026-02-21 at 09-06-09 Git Stat" src="https://github.com/user-attachments/assets/eb3e3873-f885-4671-9f3c-7c9308301292" />
<img width="1600" height="1063" alt="Screenshot 2026-02-21 at 09-06-35 Git Stat" src="https://github.com/user-attachments/assets/4ba762d8-f17d-4c22-a5ad-56e63d5c00ff" />


---

## 🚀 Roadmap

* 📊 Issue analytics charts (open vs closed)
* 📈 Issue activity timeline
* 🏆 Contribution rank system
* 🔎 Search inside issues
* ⚔ Profile comparison
* 🌍 Leaderboard system
* 🧠 AI-based repository insights

---

## 🤝 Contributing

Pull requests welcome.
For major changes, open an issue first to discuss improvements.

---

## 💻 Author

Built by **openvaibhav**
GitHub: https://github.com/openvaibhav

---

> Turning GitHub activity into a competitive stat experience.
