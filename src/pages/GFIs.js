import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function GFIS() {
  const [input, setInput] = useState("");
  const [repoInfo, setRepoInfo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [labels, setLabels] = useState([]);

  const [stateFilter, setStateFilter] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const fetchRepoData = async () => {
    const parsed = extractRepo(input);
    if (!parsed) return alert("Invalid repo link");

    setLoading(true);

    try {
      const repoRes = await axios.get(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      );

      const labelsRes = await axios.get(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/labels`,
        {
          params: {
            per_page: 100,
            page: 1,
          },
        },
      );

      setRepoInfo(repoRes.data);
      setLabels(labelsRes.data);

      setPage(1);
    } catch (err) {
      alert("Repo not found or API error");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!repoInfo) return;

    const parsed = extractRepo(input);
    if (!parsed) return;

    const fetchFilteredIssues = async () => {
      setLoading(true);

      try {
        const issuesRes = await axios.get(
          `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues`,
          {
            params: {
              state: stateFilter,
              per_page: 10,
              page: page,
              labels: selectedLabel === "all" ? undefined : selectedLabel,
            },
          },
        );

        setIssues(issuesRes.data);
      } catch (err) {
        console.log("Issue fetch error", err);
      }

      setLoading(false);
    };

    fetchFilteredIssues();
  }, [repoInfo, stateFilter, selectedLabel, page]);

  return (
    <div className="app">
      <div className="gfisHeader">
        <button className="backBtn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <h1 className="title">GitHub Issues Tracker</h1>
      </div>

      {/* SEARCH */}
      <div className="searchBox">
        <input
          type="text"
          placeholder="Enter GitHub Repo Link..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={fetchRepoData}>
          {loading ? "Loading..." : "Fetch Issues"}
        </button>
      </div>

      {/* REPO INFO */}
      {repoInfo && (
        <>
          <h2>{repoInfo.full_name}</h2>

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

          {/* FILTER BAR */}
          <div className="filterBar">
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={selectedLabel}
              onChange={(e) => {
                setSelectedLabel(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Labels</option>

              {labels.map((label) => (
                <option key={label.id} value={label.name}>
                  {label.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* ISSUE LIST */}
      {issues.length > 0 && (
        <div>
          <h3>Issues</h3>

          <div className="card issueList">
            {issues.map((issue) => (
              <div key={issue.id} className="repoItem">
                <div>
                  <h4 className="issueTitle">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      #{issue.number} {issue.title}
                    </a>
                  </h4>

                  <p>
                    👤 {issue.user.login} | 💬 {issue.comments}
                  </p>

                  <div
                    style={{
                      marginTop: "5px",
                    }}
                  >
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
          {/* PAGINATION */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ⬅ Prev
            </button>

            <span>Page {page}</span>

            <button
              disabled={issues.length < 10}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
