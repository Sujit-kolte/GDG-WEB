"use client";

import { useEffect, useState } from "react";

export default function SnippetsAdminPage() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Load Snippets from API
  const loadSnippets = async () => {
    try {
      const res = await fetch("/api/snippets");
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      if (Array.isArray(data)) {
        setSnippets(data);
      } else if (data.success && Array.isArray(data.data)) {
        setSnippets(data.data);
      }
    } catch (err) {
      console.error("Load snippets error:", err);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, []);

  // 2. Submit New Snippet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, code }),
      });

      // ✅ Fix: Check if there is content before parsing JSON
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok && (data.success || res.status === 201)) {
        setTitle("");
        setCode("");
        await loadSnippets();
        alert("Snippet published! ✅");
      } else {
        alert(data.error || "Failed to publish snippet ❌");
      }
    } catch (err) {
      console.error("Submit snippet error:", err);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Snippet
  const deleteSnippet = async (id) => {
    if (!confirm("Are you sure you want to delete this snippet?")) return;

    try {
      const res = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        loadSnippets();
      } else {
        alert(data.error || "Failed to delete snippet ❌");
      }
    } catch (err) {
      console.error("Delete snippet error:", err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>
        Code Snippet Management
      </h1>

      <div
        style={{
          background: "#f9f9f9",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}>
        <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>Add New Snippet</h2>
        <form onSubmit={handleSubmit}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}>
            Title:
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Center a Div CSS"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}>
            Code Snippet:
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            rows={10}
            placeholder="paste { your: code } here..."
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontFamily: "'Fira Code', monospace",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#95a5a6" : "#27ae60",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}>
            {loading ? "Publishing..." : "Publish Snippet"}
          </button>
        </form>
      </div>

      <div style={{ marginTop: "50px" }}>
        <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
          Current Snippets
        </h2>
        {snippets.length === 0 ? (
          <p style={{ color: "#777", fontStyle: "italic" }}>
            No snippets found.
          </p>
        ) : (
          snippets.map((s) => (
            <div
              key={s._id}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}>
                <h3 style={{ margin: 0, color: "#2c3e50" }}>{s.title}</h3>
                <button
                  onClick={() => deleteSnippet(s._id)}
                  style={{
                    background: "#ffefef",
                    color: "#e74c3c",
                    padding: "6px 12px",
                    border: "1px solid #fadbd8",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}>
                  Delete
                </button>
              </div>
              <pre
                style={{
                  background: "#2d3436",
                  color: "#dfe6e9",
                  padding: "15px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontSize: "14px",
                }}>
                <code>{s.code}</code>
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
