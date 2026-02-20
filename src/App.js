import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { GitHubCalendar } from "react-github-calendar";

import { Routes, Route } from "react-router-dom";
import GFI from "./pages/GFIs";

import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function App() {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [contribStats, setContribStats] = useState({
    total: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  const extractUsername = (url) => {
    try {
      const parts = url.split("github.com/");
      return parts[1].replace("/", "");
    } catch {
      return url;
    }
  };

  const fetchContributions = async (user) => {
    const res = await axios.post(
      "https://api.github.com/graphql",
      {
        query: `
        query($login:String!) {
          user(login:$login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `,
        variables: { login: user },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
        },
      },
    );

    const calendar =
      res.data.data.user.contributionsCollection.contributionCalendar;

    const total = calendar.totalContributions;

    const days = calendar.weeks.flatMap((w) => w.contributionDays);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    days.forEach((day) => {
      if (day.contributionCount > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    /* Skip today if 0 */
    for (let i = days.length - 1; i >= 0; i--) {
      const count = days[i].contributionCount;

      if (i === days.length - 1 && count === 0) continue;

      if (count > 0) currentStreak++;
      else break;
    }

    return {
      total,
      currentStreak,
      longestStreak,
    };
  };

  const fetchStats = async () => {
    const usernameExtracted = extractUsername(input);
    setUsername(usernameExtracted);

    if (!usernameExtracted) return;

    setLoading(true);

    const contrib = await fetchContributions(usernameExtracted);

    try {
      const userRes = await axios.get(
        `https://api.github.com/users/${usernameExtracted}`,
      );

      const repoRes = await axios.get(
        `https://api.github.com/users/${usernameExtracted}/repos?per_page=100&sort=updated`,
      );

      const repoData = repoRes.data;
      setRepos(repoData);

      // Stars + forks
      const totalStars = repoData.reduce(
        (acc, r) => acc + r.stargazers_count,
        0,
      );

      const totalForks = repoData.reduce((acc, r) => acc + r.forks_count, 0);

      // Language aggregation
      const langMap = {};
      repoData.forEach((repo) => {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
      });

      setLanguages(langMap);

      setStats({
        avatar: userRes.data.avatar_url,
        name: userRes.data.name,
        followers: userRes.data.followers,
        following: userRes.data.following,
        repos: userRes.data.public_repos,
        stars: totalStars,
        forks: totalForks,
        location: userRes.data.location,
        company: userRes.data.company,
        blog: userRes.data.blog,
        created: new Date(userRes.data.created_at).toLocaleDateString(),
        totalContributions: contrib.total,
        currentStreak: contrib.currentStreak,
        longestStreak: contrib.longestStreak,
      });
    } catch {
      alert("API Error / User not found");
    }

    setLoading(false);
  };

  const navigate = useNavigate();

  /* Pie chart data */
  const pieData = {
    labels: Object.keys(languages),
    datasets: [
      {
        data: Object.values(languages),
        backgroundColor: [
          "#22c55e",
          "#4ad2de",
          "#2616a3",
          "#df86ef",
          "#b84545",
        ],
        borderWidth: 1,
      },
    ],
  };

  function Stat({ label, value }) {
    return (
      <div className="statCard">
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    );
  }

  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = async (url, id) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app">
            <h1 className="title">GIT-Stat</h1>

            {/* INPUT */}
            <div className="searchBox">
              <input
                type="text"
                placeholder="Enter GitHub Profile Link or Username..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={fetchStats}>
                {loading ? "Loading..." : "Track"}
              </button>
              <button onClick={() => navigate("/gfis")}>GFI Tracker</button>
            </div>

            {/* PROFILE */}
            {stats && (
              <>
                <div className="profileCard sideProfile">
                  {/* LEFT — PFP */}
                  <div className="pfpSection">
                    <img src={stats.avatar} alt="avatar" />
                  </div>

                  {/* RIGHT — DETAILS */}
                  <div className="profileInfo">
                    <h2>{stats.name}</h2>
                    <p className="username">@{username}</p>

                    <div className="profileMeta">
                      <span>👥 {stats.followers || "0"} Followers</span>
                      <span>🔁 {stats.following || "0"} Following</span>
                      <span>📦 {stats.repos} Repos</span>
                    </div>

                    <div className="profileExtra">
                      {stats.location && <p>📍 {stats.location}</p>}
                      {stats.company && <p>🏢 {stats.company}</p>}
                      {stats.blog && (
                        <p>
                          🔗{" "}
                          <a href={stats.blog} target="_blank" rel="noreferrer">
                            {stats.blog}
                          </a>
                        </p>
                      )}
                      <p>📅 Joined {stats.created}</p>
                    </div>
                  </div>
                </div>

                {/* STAT CARDS */}
                <div className="statsGrid">
                  <Stat label="Stars" value={stats.stars} />
                  <Stat label="Forks" value={stats.forks} />
                  <Stat
                    label="Total Contributions"
                    value={stats.totalContributions}
                  />
                  <Stat label="Current Streak" value={stats.currentStreak} />
                  <Stat label="Highest Streak" value={stats.longestStreak} />
                </div>

                {/* PIE + REPO LIST */}
                <div className="bottomGrid">
                  {/* PIE CHART */}
                  <div className="card">
                    <h3>Language Rank Distribution</h3>
                    <div className="pieWrapper">
                      <Pie data={pieData} />
                    </div>
                  </div>

                  {/* REPO LIST */}
                  <div className="card repoList">
                    <h3>Repository Tracker</h3>

                    {repos.slice(0, 20).map((repo) => (
                      <div key={repo.id} className="repoItem">
                        <div className="repoLeft">
                          {/* COPY BUTTON */}
                          <button
                            className="copyBtn"
                            onClick={() =>
                              copyToClipboard(repo.html_url, repo.id)
                            }
                          >
                            {copiedId === repo.id ? "✔" : "📋"}
                          </button>

                          <h4>
                            {repo.name} : {repo.language || "Unknown"}
                          </h4>
                        </div>

                        <div className="repoStats">
                          ⭐ {repo.stargazers_count}
                          🍴 {repo.forks_count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HEATMAP FOOTER */}
                {username && (
                  <div className="card heatmapFooter">
                    <h3>Contribution Activity</h3>

                    <GitHubCalendar
                      username={username}
                      blockSize={15}
                      blockMargin={5}
                      color="#22c55e"
                      fontSize={14}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        }
      />

      <Route path="/gfis" element={<GFI />} />
    </Routes>
  );
}
