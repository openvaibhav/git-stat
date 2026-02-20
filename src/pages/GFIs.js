import React, { useState } from "react";
import axios from "axios";
import "../App.css";

export default function GFIS() {
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [repoInfo, setRepoInfo] = useState(null);

  const extractRepo = (url) => {
    try {
      const parts = url.split("github.com/")[1].split("/");
      return {
        owner: parts[0],
        repo: parts[1],
      };
    } catch {
      return null;
    }
  };

  const fetchIssues = async () => {
    const parsed = extractRepo(input);
    if (!parsed) return alert("Invalid repo link");

    setLoading(true);

    try {
      const repoRes = await axios.get(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`
      );

      const issuesRes = await axios.get(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues?state=all&per_page=20`
      );

      setRepoInfo(repoRes.data);
      setIssues(issuesRes.data);
    } catch (err) {
      alert("Repo not found or API error");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1 className="title">GitHub Issues Tracker</h1>

      {/* SEARCH BAR */}
      <div className="searchBox">
        <input
          type="text"
          placeholder="Enter GitHub Repo Link..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={fetchIssues}>
          {loading ? "Loading..." : "Fetch Issues"}
        </button>
      </div>

      {/* REPO HEADER */}
      <h2>{repoInfo.full_name}</h2>
      {repoInfo && (
      <div className="profileCard sideProfile">
          <div className="profileInfo">
            <p>{repoInfo.description}</p>
            <div className="profileMeta">
              ⭐ {repoInfo.stargazers_count}
              🍴 {repoInfo.forks_count}
              🐛 {repoInfo.open_issues_count}
            </div>
          </div>
        </div>
      )}

      {/* ISSUES LIST */}
      <h3>Recent Issues</h3>
      {issues.length > 0 && (
        <div className="card issueList">

          {issues.map((issue) => (
            <div key={issue.id} className="repoItem">
              <div>
                <h4>
                  #{issue.number} {issue.title}
                </h4>
                <p>
                  👤 {issue.user.login} | 💬 {issue.comments} comments
                </p>

                {/* Labels */}
                <div style={{ marginTop: "5px" }}>
                  {issue.labels.map((label) => (
                    <span
                      key={label.id}
                      style={{
                        background: `#${label.color}`,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        marginRight: "5px",
                        fontSize: "12px",
                        color: "#000",
                        fontWeight: "bold",
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="repoStats">
                {issue.state === "open" ? "🟢 OPEN" : "🔴 CLOSED"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}