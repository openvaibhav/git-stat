# 🔥 GIT-STAT — GitHub Profile Stats Tracker

A GitHub analytics dashboard that tracks developer activity, contributions, repositories, and language distribution in a stats-tracker UI.

---

## 🚀 Features

### 👤 Profile Overview

* Avatar, name, username
* Followers & following
* Public repository count
* Company & location
* Website/blog link
* Join date

### 📊 Contribution Analytics

* Total contributions (last year)
* Current streak (UTC-safe calculation)
* Highest streak
* Contribution heatmap calendar

### 📦 Repository Tracker

* Latest repositories list
* Stars & forks per repo
* Language tags
* Sorted by last updated

### 🥧 Language Rank Distribution

* Pie chart of most-used languages
* Repo-based aggregation
* CS-themed color palette

---

## 🖥️ UI Theme

* Dark dashboard style
* Neon green accent highlights
* Card-based stat modules
* Responsive layout
* Heatmap footer section

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* Axios
* Chart.js
* react-chartjs-2
* react-github-calendar

**APIs**

* GitHub REST API
* GitHub GraphQL API (Contributions)

---

## 📂 Project Structure

```
src/
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

```bash
git clone https://github.com/YOUR_USERNAME/git-stat.git
cd git-stat
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment file

Create `.env` in root:

```env
REACT_APP_GITHUB_TOKEN=your_github_token_here
```

⚠️ Must start with `REACT_APP_`

---

## 🔑 Generating GitHub Token

1. GitHub → Settings
2. Developer Settings → Personal Access Tokens
3. Create Fine-grained or Classic token

Required permissions:

* User metadata → Read
* Repository metadata → Read

---

## ▶️ Run locally

```bash
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
| Contributions | GraphQL API     |
| Heatmap       | GitHub Calendar |

---

## 🧠 Streak Calculation Logic

* Longest streak → historical scan
* Current streak → reverse scan
* Skips current day if contributions not yet updated (UTC safe)

---

## 🔒 Security Notes

* Tokens stored in `.env`
* `.env` ignored via `.gitignore`
* For production → move token to backend proxy

---

## 📸 Preview

*(Add screenshots here)*

---

## 🤝 Contributing

Pull requests welcome. For major changes, open an issue first to discuss what you’d like to change.

---

## 💻 Author

Built by **openvaibhav**

GitHub: https://github.com/openvaibhav

---

> Turning GitHub activity into a competitive stat experience.
