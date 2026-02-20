"use client";

import { useState, useEffect } from "react";
import styles from "./SnippetsSection.module.css";

export default function SnippetsSection() {
  // ✅ Initialize as empty array to prevent crashes before data loads
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function getSnippets() {
      try {
        const res = await fetch("/api/snippets");
        if (!res.ok) throw new Error("Failed to fetch snippets");

        const data = await res.json();

        // ✅ Fix: Extract the array from the 'data' property
        if (data.success && Array.isArray(data.data)) {
          setSnippets(data.data);
        } else if (Array.isArray(data)) {
          // Fallback if your API returns a raw array
          setSnippets(data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getSnippets();
  }, []);

  // ✅ Safety check: ensure snippets is an array before filtering
  const filteredSnippets = Array.isArray(snippets)
    ? snippets.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading)
    return <div className={styles.loadingMessage}>Loading snippets...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <section className={styles.snippetsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>Code Snippets</h1>
          <p className={styles.sectionSubtitle}>
            Useful logic for your next project
          </p>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search snippets by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredSnippets.length === 0 ? (
          <div className={styles.noSnippetsMessage}>
            No snippets found matching your search.
          </div>
        ) : (
          <>
            <div className={styles.resultCount}>
              Showing {filteredSnippets.length} snippet
              {filteredSnippets.length !== 1 ? "s" : ""}
            </div>
            <div className={styles.snippetsGrid}>
              {filteredSnippets.map((item) => (
                <div key={item._id} className={styles.snippetCard}>
                  <div className={styles.snippetHeader}>
                    <h3 className={styles.snippetTitle}>{item.title}</h3>
                    <button
                      className={`${styles.copyBtn} ${copiedId === item._id ? styles.copied : ""}`}
                      onClick={() => copyToClipboard(item.code, item._id)}>
                      {/* Note: Ensure FontAwesome is linked in your layout.js for these icons */}
                      <i
                        className={
                          copiedId === item._id ? "fas fa-check" : "far fa-copy"
                        }></i>
                      {copiedId === item._id ? " Copied!" : " Copy Code"}
                    </button>
                  </div>
                  <div className={styles.snippetCode}>
                    <pre>
                      <code>{item.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
