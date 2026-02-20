"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function MembersPage() {
  // Individual Member Form States
  const [indName, setIndName] = useState("");
  const [indDomain, setIndDomain] = useState("");
  const [indTier, setIndTier] = useState("Organizer");
  const [indLinkedin, setIndLinkedin] = useState("");
  const [indGithub, setIndGithub] = useState("");
  const [indPhoto, setIndPhoto] = useState(null);

  // Domain Group Form States
  const [domTitle, setDomTitle] = useState("");
  const [domSubtitle, setDomSubtitle] = useState("");
  const [domMembers, setDomMembers] = useState("");
  const [domPhoto, setDomPhoto] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [individualMembers, setIndividualMembers] = useState([]);
  const [domainGroups, setDomainGroups] = useState([]);

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      const [coreRes, indRes] = await Promise.all([
        fetch("/api/core-team", { cache: "no-store" }),
        fetch("/api/members", { cache: "no-store" }),
      ]);

      const coreData = await coreRes.json();
      const indData = await indRes.json();

      if (coreData?.success) setDomainGroups(coreData.data);
      if (indData?.success) setIndividualMembers(indData.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  const uploadToCloudinary = async (file, folderName) => {
    if (!file) return "";
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
      );
      formData.append("folder", folderName);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();
      return data.secure_url || "";
    } catch (err) {
      console.error("Cloudinary Error:", err);
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddIndividual = async (e) => {
    e.preventDefault();
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

    if ((await res.json())?.success) {
      alert("✅ Member Added!");
      setIndName("");
      setIndDomain("");
      setIndLinkedin("");
      setIndGithub("");
      setIndPhoto(null);
      fetchAllMembers();
    }
  };

  // ✅ IMPROVED DELETE LOGIC: Removes from UI immediately
  const deleteDomainGroup = async (id) => {
    if (!confirm("Delete this domain group?")) return;
    try {
      const res = await fetch(`/api/core-team/${id}`, { method: "DELETE" });
      if ((await res.json())?.success) {
        setDomainGroups((prev) => prev.filter((g) => g._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteIndividualMember = async (id) => {
    if (!confirm("Delete this member?")) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if ((await res.json())?.success) {
        setIndividualMembers((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error(err);
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
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Domain Name</label>
              <input
                type="text"
                value={indDomain}
                onChange={(e) => setIndDomain(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tier</label>
              <select
                value={indTier}
                onChange={(e) => setIndTier(e.target.value)}>
                <option value="Organizer">Organizer</option>
                <option value="Domain Lead">Domain Lead</option>
                <option value="Co-Lead">Co-Lead</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>LinkedIn</label>
              <input
                type="url"
                value={indLinkedin}
                onChange={(e) => setIndLinkedin(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>GitHub</label>
              <input
                type="url"
                value={indGithub}
                onChange={(e) => setIndGithub(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Photo</label>
              <input
                type="file"
                onChange={(e) => setIndPhoto(e.target.files?.[0])}
                required
              />
            </div>
            <button
              className={styles.greenBtn}
              type="submit"
              disabled={isUploading}>
              {isUploading ? "Uploading..." : "Add Member"}
            </button>
          </form>
        </div>

        {/* Domain Group Form */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>👥 Core Team Group</div>
          <form onSubmit={handleAddDomainGroup} className={styles.form}>
            {/* ... (Same structure as individual for domain group) */}
            <button
              className={styles.blueBtn}
              type="submit"
              disabled={isUploading}>
              Add Group
            </button>
          </form>
        </div>
      </div>

      <div className={styles.displayContainer}>
        <div className={styles.tableContainer}>
          <h3 className={styles.tableTitleGreen}>Member List</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {individualMembers.map((m) => (
                <tr key={m._id}>
                  <td>
                    <img
                      src={m.photo}
                      className={styles.tableImg}
                      alt="member"
                    />
                  </td>
                  <td>
                    <b>{m.name}</b>
                    <br />
                    {m.domain}
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
