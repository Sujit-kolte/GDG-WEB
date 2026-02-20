"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function MembersPage() {
  // Individual Member Form
  const [indName, setIndName] = useState("");
  const [indDomain, setIndDomain] = useState("");
  const [indTier, setIndTier] = useState("Organizer");
  const [indLinkedin, setIndLinkedin] = useState("");
  const [indGithub, setIndGithub] = useState("");
  const [indPhoto, setIndPhoto] = useState(null);

  // Domain Group Form
  const [domTitle, setDomTitle] = useState("");
  const [domSubtitle, setDomSubtitle] = useState("");
  const [domMembers, setDomMembers] = useState("");
  const [domPhoto, setDomPhoto] = useState(null);

  // Loading States
  const [isUploading, setIsUploading] = useState(false);

  // Tables data
  const [individualMembers, setIndividualMembers] = useState([]);
  const [domainGroups, setDomainGroups] = useState([]);

  // Load data
  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      const [coreRes, indRes] = await Promise.all([
        fetch("/api/core-team"),
        fetch("/api/members"),
      ]);

      const coreData = await coreRes.json();
      const indData = await indRes.json();

      if (coreData?.success) setDomainGroups(coreData.data);
      if (indData?.success) setIndividualMembers(indData.data);
    } catch (err) {
      console.log("Error fetching members:", err);
    }
  };

  // ✅ Updated Upload image to Cloudinary using NEXT_PUBLIC_ variables
  const uploadToCloudinary = async (file, folderName) => {
    if (!file) return "";

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // These must be prefixed with NEXT_PUBLIC_ in your .env file
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
      );
      formData.append("folder", folderName);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary Error:", data);
        alert(
          `Upload Failed: ${data.error?.message || "Check your Preset and Cloud Name"}`,
        );
        return "";
      }

      return data.secure_url || "";
    } catch (err) {
      console.error("Cloudinary Connection Error:", err);
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  // Add Individual Member
  const handleAddIndividual = async (e) => {
    e.preventDefault();

    try {
      // ✅ Upload to Members/members folder
      const photoUrl = await uploadToCloudinary(indPhoto, "Members/members");

      const payload = {
        name: indName,
        domain: indDomain,
        tier: indTier,
        linkedin: indLinkedin,
        github: indGithub,
        photo: photoUrl,
      };

      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.success) {
        alert("✅ Individual Member Added!");
        setIndName("");
        setIndDomain("");
        setIndTier("Organizer");
        setIndLinkedin("");
        setIndGithub("");
        setIndPhoto(null);
        fetchAllMembers();
      } else {
        alert("❌ Failed to add member");
      }
    } catch (err) {
      console.log(err);
      alert("❌ Error adding member");
    }
  };

  // Add Domain Group
  const handleAddDomainGroup = async (e) => {
    e.preventDefault();

    try {
      // ✅ Upload to Members/core-team folder
      const photoUrl = await uploadToCloudinary(domPhoto, "Members/core-team");

      const payload = {
        title: domTitle,
        subtitle: domSubtitle,
        members: domMembers,
        photo: photoUrl,
      };

      const res = await fetch("/api/core-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.success) {
        alert("✅ Domain Group Added!");
        setDomTitle("");
        setDomSubtitle("");
        setDomMembers("");
        setDomPhoto(null);
        fetchAllMembers();
      } else {
        alert("❌ Failed to add domain group");
      }
    } catch (err) {
      console.log(err);
      alert("❌ Error adding domain group");
    }
  };

  // Delete Domain Group
  const deleteDomainGroup = async (id) => {
    if (!confirm("Delete this domain group?")) return;
    try {
      const res = await fetch(`/api/core-team/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.success) fetchAllMembers();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Individual Member
  const deleteIndividualMember = async (id) => {
    if (!confirm("Delete this member?")) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.success) fetchAllMembers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Team Management</h1>

      <div className={styles.formsContainer}>
        {/* Individual Member Form */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            👤 Individual Member Profile
          </div>
          <form onSubmit={handleAddIndividual} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={indName}
                onChange={(e) => setIndName(e.target.value)}
                placeholder="e.g. Sudeep"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Domain Name</label>
              <input
                type="text"
                value={indDomain}
                onChange={(e) => setIndDomain(e.target.value)}
                placeholder="e.g. Technical, Design"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tier / Position</label>
              <select
                value={indTier}
                onChange={(e) => setIndTier(e.target.value)}>
                <option value="Organizer">Organizer</option>
                <option value="Domain Lead">Domain Lead</option>
                <option value="Co-Lead">Co-Lead</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>LinkedIn URL</label>
              <input
                type="url"
                value={indLinkedin}
                onChange={(e) => setIndLinkedin(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>GitHub URL</label>
              <input
                type="url"
                value={indGithub}
                onChange={(e) => setIndGithub(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIndPhoto(e.target.files?.[0])}
                required
              />
            </div>
            <button
              className={styles.greenBtn}
              type="submit"
              disabled={isUploading}>
              {isUploading ? "Uploading Image..." : "Add Individual Member"}
            </button>
          </form>
        </div>

        {/* Domain Group Form */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            👥 Domain / Core Team Group
          </div>
          <form onSubmit={handleAddDomainGroup} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Domain Title</label>
              <input
                type="text"
                value={domTitle}
                onChange={(e) => setDomTitle(e.target.value)}
                placeholder="e.g. Technical Team"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Domain Subtitle</label>
              <input
                type="text"
                value={domSubtitle}
                onChange={(e) => setDomSubtitle(e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Group Member Names</label>
              <textarea
                rows={2}
                value={domMembers}
                onChange={(e) => setDomMembers(e.target.value)}
                placeholder="Names..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>Combined Team Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDomPhoto(e.target.files?.[0])}
                required
              />
            </div>
            <button
              className={styles.blueBtn}
              type="submit"
              disabled={isUploading}>
              {isUploading ? "Uploading Image..." : "Add Domain Group"}
            </button>
          </form>
        </div>
      </div>

      {/* Tables Section */}
      <div className={styles.displayContainer}>
        {/* Core Team Domains Table */}
        <div className={styles.tableContainer}>
          <h3 className={styles.tableTitleBlue}>Core Team Domains</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Domain Photo</th>
                <th>Title & Subtitle</th>
                <th>Members List</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domainGroups.map((g) => (
                <tr key={g._id}>
                  <td>
                    {g.photo ? (
                      <img
                        src={g.photo}
                        alt="Domain"
                        className={styles.tableImg}
                      />
                    ) : (
                      <div className={styles.noImg}>No Image</div>
                    )}
                  </td>
                  <td>
                    <b>{g.title}</b>
                    <p className={styles.muted}>{g.subtitle}</p>
                  </td>
                  <td>{g.members}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteDomainGroup(g._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Individual Members List Table */}
        <div className={styles.tableContainer}>
          <h3 className={styles.tableTitleGreen}>Individual Members List</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name & Domain</th>
                <th>Tier</th>
                <th>Social Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {individualMembers.map((m) => (
                <tr key={m._id}>
                  <td>
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt="Member"
                        className={styles.tableImg}
                      />
                    ) : (
                      <div className={styles.noImg}>No Image</div>
                    )}
                  </td>
                  <td>
                    <b>{m.name}</b>
                    <p className={styles.muted}>{m.domain}</p>
                  </td>
                  <td>{m.tier}</td>
                  <td className={styles.links}>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    )}
                    {m.github && (
                      <a href={m.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteIndividualMember(m._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
