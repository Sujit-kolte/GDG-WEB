"use client";

import { useState, useEffect } from "react";
import styles from "./MembersSection.module.css";

/**
 * Cloudinary Image Logic
 * Same logic as your other sections to ensure images show up on Vercel
 */
const getImgSrc = (image) => {
  if (!image) return "/placeholder.png";
  const path = Array.isArray(image) ? image[0] : image;
  if (typeof path !== "string" || path.trim() === "") return "/placeholder.png";

  if (path.startsWith("http")) return path; // Cloudinary URL
  return path.startsWith("/") ? path : `/${path}`; // Local Fallback
};

export default function MembersSection() {
  const [members, setMembers] = useState([]);
  const [coreGroups, setCoreGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // We fetch from your API routes just like Snippets does
        const [memberRes, groupRes] = await Promise.all([
          fetch("/api/members", { cache: "no-store" }),
          fetch("/api/core-team", { cache: "no-store" }),
        ]);

        const memberData = await memberRes.json();
        const groupData = await groupRes.json();

        if (memberData.success) setMembers(memberData.data);
        if (groupData.success) setCoreGroups(groupData.data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading Team...</div>;

  const organizers = members.filter(
    (m) => m.tier?.toLowerCase()?.trim() === "organizer",
  );
  const leads = members.filter(
    (m) => m.tier?.toLowerCase()?.trim() === "domain lead",
  );
  const coleads = members.filter(
    (m) =>
      m.tier?.toLowerCase()?.trim() === "co-lead" ||
      m.tier?.toLowerCase()?.trim() === "domain co-lead",
  );

  return (
    <div className={styles.container}>
      <div className={styles["section-header"]}>
        <h1 className={styles["section-title"]}>
          Meet The Core team of GDGCOE
        </h1>
      </div>

      {/* Organizer Section */}
      {organizers.length > 0 && (
        <section>
          <div className={styles["tier-label"]}>Organizer</div>
          <div className={styles["row-wrapper"]}>
            {organizers.map((m, i) => (
              <MemberCard key={m._id} member={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Leads Section */}
      {leads.length > 0 && (
        <section>
          <div className={styles["tier-label"]}>Domain Leads</div>
          <div className={styles["row-wrapper"]}>
            {leads.map((m, i) => (
              <MemberCard key={m._id} member={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Co-Leads Section */}
      {coleads.length > 0 && (
        <section>
          <div className={styles["tier-label"]}>Domain Co-Leads</div>
          <div className={styles["row-wrapper"]}>
            {coleads.map((m, i) => (
              <MemberCard key={m._id} member={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Core Team Groups */}
      <div id="core-team-container">
        <div className={styles["tier-label"]}>Our Core Team</div>
        {coreGroups.map((group) => (
          <div key={group._id} className={styles["group-photo-container"]}>
            <div className={styles["group-card"]}>
              <div className={styles["group-image"]}>
                <img
                  src={getImgSrc(group.image || group.photo)}
                  alt={group.title}
                />
              </div>
              <div className={styles["group-info"]}>
                <h2>{group.title}</h2>
                <p>{group.subtitle}</p>
                <p className={styles.membersListText}>
                  {group.membersList || group.members}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member, index }) {
  const rotation = index % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)";
  const src = getImgSrc(member.image || member.photo);

  return (
    <div className={styles["member-card"]} style={{ transform: rotation }}>
      <div className={styles["image-box"]}>
        <img src={src} alt={member.name} loading="lazy" />
      </div>
      <div className={styles.info}>
        <h3>{member.name}</h3>
        <p>{member.domain}</p>
        <div className={styles["social-links"]}>
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          )}
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
