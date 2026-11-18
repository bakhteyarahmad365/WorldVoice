"use client";

import { useState, useEffect, type CSSProperties } from "react";

type Poll = {
  id: number;
  creator: string;
  avatar: string;
  category: string;
  audience: string;
  question: string;
  options: string[];
  votes: number;
  expiry?: string;
};

const samplePolls: Poll[] = [
  {
    id: 1,
    creator: "WorldVoice Official",
    avatar: "🌍",
    category: "Technology",
    audience: "Global",
    question: "Which technology will change our lives the most?",
    options: ["Artificial Intelligence", "Robotics", "Virtual Reality", "Space Technology"],
    votes: 12540,
  },
  {
    id: 2,
    creator: "Public Community",
    avatar: "👤",
    category: "Sports",
    audience: "Global",
    question: "Which sport do you enjoy watching the most?",
    options: ["Cricket", "Football", "Basketball", "Tennis"],
    votes: 8340,
  },
  {
    id: 3,
    creator: "WorldVoice Official",
    avatar: "🌍",
    category: "Entertainment",
    audience: "Global",
    question: "What do you prefer watching?",
    options: ["Movies", "Web Series", "Documentaries", "Live Shows"],
    votes: 6210,
  },
];

const categories = [
  "All",
  "Technology",
  "Sports",
  "Entertainment",
  "Politics",
  "Business",
  "Education",
  "Science",
  "Social",
  "Health",
  "Other",
];

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Saudi Arabia",
  "Pakistan",
  "Bangladesh",
  "Nepal",
  "Sri Lanka",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Singapore",
  "Malaysia",
  "Indonesia",
  "South Africa",
  "Brazil",
  "Russia",
  "Turkey",
  "New Zealand",
  "Italy",
  "Spain",
  "Afghanistan",
  "Qatar",
  "Kuwait",
  "Oman",
  "Egypt",
];

export default function Home() {
  const [activeFeed, setActiveFeed] = useState<"world" | "public">("world");

  useEffect(() => {
    document.body.classList.toggle("public-theme", activeFeed === "public");

    return () => {
      document.body.classList.remove("public-theme");
    };
  }, [activeFeed]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState("Home");
  const [polls, setPolls] = useState(samplePolls);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [voted, setVoted] = useState<number[]>([]);
  const [modal, setModal] = useState(false);

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollCategory, setPollCategory] = useState("Technology");
  const [pollExpiry, setPollExpiry] = useState("");
  const [audienceMode, setAudienceMode] = useState("global");
  const [selectedCountry, setSelectedCountry] = useState("India");

  const visiblePolls = polls.filter(
    (poll) =>
      activeCategory === "All" || poll.category === activeCategory
  );

  function castVote(pollId: number) {
    if (selected[pollId] === undefined || voted.includes(pollId)) return;

    setVoted((old) => [...old, pollId]);

    setPolls((old) =>
      old.map((poll) =>
        poll.id === pollId
          ? { ...poll, votes: poll.votes + 1 }
          : poll
      )
    );
  }

  function createPoll() {
    const question = pollQuestion.trim();
    const options = pollOptions.map((option) => option.trim()).filter(Boolean);

    if (!question) {
      alert("Please enter your poll question.");
      return;
    }

    if (options.length < 2 || options.length > 5) {
      alert("Please enter minimum 2 and maximum 5 options.");
      return;
    }

    if (!pollExpiry || new Date(pollExpiry).getTime() <= Date.now()) {
      alert("Please select a future expiry date and time.");
      return;
    }

    let audience = "Global";

    if (audienceMode === "global_country") {
      audience = `Global + ${selectedCountry}`;
    } else if (audienceMode === "country") {
      audience = `${selectedCountry} Only`;
    }

    const newPoll: Poll = {
      id: Date.now(),
      creator: "Public Community",
      avatar: "👤",
      category: pollCategory,
      audience,
      question,
      options,
      votes: 0,
      expiry: pollExpiry,
    };

    setPolls((old) => [newPoll, ...old]);
    setActiveFeed("public");
    setActivePage("Home");
    setActiveCategory("All");

    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollCategory("Technology");
    setPollExpiry("");
    setAudienceMode("global");
    setSelectedCountry("India");
    setModal(false);
  }

  return (
    <main>
      <header className="header">
        <div className="header-inner">
          <div className="topline">
            <div>
              <div className="brand">
                <div className="brand-mark">🌐</div>
                <span>WorldVoice</span>
              </div>
              <p className="tagline">Your voice. Your world.</p>
            </div>

            <div className="header-actions">
              <button className="icon-btn" aria-label="Notifications">♧</button>
              <button className="icon-btn" aria-label="Settings">⚙</button>
            </div>
          </div>

          <div className="tabs">
            <button
              id="worldTab"
              className={`tab ${activeFeed === "world" ? "active" : ""}`}
              onClick={() => {
                setActiveFeed("world");
                setActiveCategory("All");
              }}
            >
              🌍 World Voice
            </button>

            <button
              id="publicTab"
              className={`tab ${activeFeed === "public" ? "active" : ""}`}
              onClick={() => {
                setActiveFeed("public");
                setActiveCategory("All");
              }}
            >
              👥 Public
            </button>
          </div>
        </div>
      </header>

      <div className="page">
        {activePage === "Home" && (
          <>
            <div className="categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="heading">
              <h2>
                {activeFeed === "world" ? "World Voice" : "Public Polls"}
              </h2>
              <span className="muted">Explore opinions</span>
            </div>

            {activeFeed === "public" && (
              <div style={{ marginBottom: 15 }}>
                <button className="primary" onClick={() => setModal(true)}>
                  ＋ Create Poll
                </button>
              </div>
            )}

            {visiblePolls
              .filter((poll) =>
                activeFeed === "world"
                  ? poll.creator === "WorldVoice Official"
                  : poll.creator !== "WorldVoice Official"
              )
              .map((poll) => {
                const hasVoted = voted.includes(poll.id);
                const selectedOption = selected[poll.id];

                return (
                  <article className="card" key={poll.id}>
                    <div className="creator">
                      <div className="avatar">{poll.avatar}</div>

                      <div className="creator-info">
                        <div className="creator-name">
                          {poll.creator}
                          {poll.creator === "WorldVoice Official" && (
                            <span className="verified">✓</span>
                          )}
                        </div>
                        <div className="creator-sub">Poll · Recently</div>
                      </div>

                      <button className="follow">Follow</button>
                    </div>

                    <div className="meta">
                      <span className="pill">{poll.category}</span>
                      <span className="pill audience">
                        🌐 {poll.audience}
                      </span>
                      <span className="status">
                        {hasVoted ? "Voted" : "Active"}
                      </span>
                    </div>

                    <h3 className="question">{poll.question}</h3>

                    <div className="options">
                      {poll.options.map((option, index) => {
                        const percentage = Math.round(100 / poll.options.length);

                        return (
                          <button
                            key={option}
                            className={`option ${
                              selectedOption === index ? "selected" : ""
                            } ${hasVoted ? "revealed" : ""}`}
                            onClick={() => {
                              if (!hasVoted) {
                                setSelected((old) => ({
                                  ...old,
                                  [poll.id]: index,
                                }));
                              }
                            }}
                            disabled={hasVoted}
                            style={
                              hasVoted
                                ? ({
                                    "--fill": `${percentage}%`,
                                  } as CSSProperties)
                                : undefined
                            }
                          >
                            {hasVoted && <span className="result" />}
                            <span className="option-content">
                              <span>{option}</span>
                              {hasVoted && <span>{percentage}%</span>}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="vote-summary">
                      <span>{poll.votes.toLocaleString()} votes</span>
                      <span>{hasVoted ? "Results" : "Choose one option"}</span>
                    </div>

                    {!hasVoted && (
                      <div className="slider-wrap">
                        <div className="slider-label">
                          {selectedOption === undefined
                            ? "SELECT AN OPTION TO VOTE"
                            : "YOUR OPTION IS SELECTED"}
                        </div>
                        <button
                          className="primary"
                          style={{ width: "100%" }}
                          disabled={selectedOption === undefined}
                          onClick={() => castVote(poll.id)}
                        >
                          Submit Vote →
                        </button>
                      </div>
                    )}

                    <div className="footer">
                      <div className="actions">
                        <button className="action">♡ Like</button>
                        <button className="action">▢ Comment</button>
                        <button className="action">↗ Share</button>
                      </div>
                      <button className="action">♧ Save</button>
                    </div>
                  </article>
                );
              })}
          </>
        )}

        {activePage !== "Home" && (
          <div className="panel-card">
            <h2>{activePage}</h2>
            <p className="muted">
              This section will be built in the next steps.
            </p>
          </div>
        )}
      </div>

      <nav className="bottom">
        <div className="nav">
          {[
            ["Home", "⌂"],
            ["Trending", "↗"],
            ["Regional", "◎"],
            ["Global", "🌐"],
            ["Profile", "♙"],
          ].map(([name, symbol]) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name ? "active" : ""
              }`}
              onClick={() => setActivePage(name)}
            >
              <span style={{ fontSize: 21 }}>{symbol}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </nav>

      {modal && (
        <div className="modal-bg show" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Create a Public Poll</h3>
              <button className="close" onClick={() => setModal(false)}>
                ×
              </button>
            </div>

            <div style={{ maxHeight: "70vh", overflowY: "auto", padding: 5 }}>
              <label className="control">
                Poll Question
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  maxLength={250}
                />
              </label>

              <div style={{ marginTop: 15 }}>
                <strong>Poll Options (2–5)</strong>

                {pollOptions.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <input
                      className="control"
                      style={{ flex: 1, minWidth: 0 }}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updated = [...pollOptions];
                        updated[index] = e.target.value;
                        setPollOptions(updated);
                      }}
                      maxLength={100}
                    />

                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        className="action"
                        onClick={() =>
                          setPollOptions(
                            pollOptions.filter((_, i) => i !== index)
                          )
                        }
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    className="action"
                    style={{ marginTop: 12 }}
                    onClick={() => setPollOptions([...pollOptions, ""])}
                  >
                    ＋ Add Option
                  </button>
                )}
              </div>

              <label className="control" style={{ marginTop: 18 }}>
                Category
                <select
                  value={pollCategory}
                  onChange={(e) => setPollCategory(e.target.value)}
                >
                  {categories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </label>

              <label className="control" style={{ marginTop: 18 }}>
                Poll Expiry Date & Time
                <input
                  type="datetime-local"
                  value={pollExpiry}
                  onChange={(e) => setPollExpiry(e.target.value)}
                />
              </label>

              <div style={{ marginTop: 20 }}>
                <strong>Choose Audience</strong>

                <label className="control">
                  <select
                    value={audienceMode}
                    onChange={(e) => setAudienceMode(e.target.value)}
                  >
                    <option value="global">Global Only</option>
                    <option value="global_country">
                      Global + One Country
                    </option>
                    <option value="country">One Country Only</option>
                  </select>
                </label>

                {audienceMode !== "global" && (
                  <label className="control" style={{ marginTop: 12 }}>
                    Select Country
                    <input
                      list="country-list"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      placeholder="Type country name"
                    />
                    <datalist id="country-list">
                      {countries.map((country) => (
                        <option key={country} value={country} />
                      ))}
                    </datalist>
                  </label>
                )}

                {audienceMode === "global_country" && (
                  <p className="muted">
                    People worldwide and people in your selected country can
                    vote.
                  </p>
                )}

                {audienceMode === "global" && (
                  <p className="muted">
                    People from all countries can vote.
                  </p>
                )}

                {audienceMode === "country" && (
                  <p className="muted">
                    Only people from your selected country can vote.
                  </p>
                )}
              </div>

              <button
                className="primary"
                style={{ width: "100%", marginTop: 20 }}
                onClick={createPoll}
              >
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}