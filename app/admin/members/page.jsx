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

  // ✅ Completed handleAddDomainGroup logic
  const handleAddDomainGroup = async (e) => {
    e.preventDefault();
    const photoUrl = await uploadToCloudinary(domPhoto, "Members/core-team");

    const payload = {
      title: domTitle,
      subtitle: domSubtitle,
      members: domMembers, // Maps to membersList in your schema
      image: photoUrl, // Maps to image in your schema
    };

    const res = await fetch("/api/core-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if ((await res.json())?.success) {
      alert("✅ Core Team Group Added!");
      setDomTitle("");
      setDomSubtitle("");
      setDomMembers("");
      setDomPhoto(null);
      fetchAllMembers();
    }
  };

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
        {/* Individual Form ... existing code ... */}

        {/* Domain Group Form */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>👥 Core Team Group</div>
          <form onSubmit={handleAddDomainGroup} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Group Title</label>
              <input
                type="text"
                value={domTitle}
                onChange={(e) => setDomTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                type="text"
                value={domSubtitle}
                onChange={(e) => setDomSubtitle(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Members List</label>
              <textarea
                value={domMembers}
                onChange={(e) => setDomMembers(e.target.value)}
                placeholder="Member names..."
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Group Photo</label>
              <input
                type="file"
                onChange={(e) => setDomPhoto(e.target.files?.[0])}
                required
              />
            </div>
            <button
              className={styles.blueBtn}
              type="submit"
              disabled={isUploading}>
              {isUploading ? "Uploading..." : "Add Group"}
            </button>
          </form>
        </div>
      </div>

      {/* Tables section as you had it ... */}
    </div>
  );
}
