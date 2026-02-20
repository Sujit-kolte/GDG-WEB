import { Member, CoreTeam } from "@/models/Member";
import dbConnect from "@/lib/db";
import styles from "./MembersSection.module.css";

// 🚀 CRITICAL FIX FOR VERCEL:
// Force Next.js to bypass the cache and run the DB query on every page load.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const getImgSrc = (image) => {
  if (!image) return "/placeholder.png";

  // Handle array if Cloudinary returns one
  const path = Array.isArray(image) ? image[0] : image;

  if (typeof path !== "string" || path.trim() === "") return "/placeholder.png";

  // If it's a Cloudinary URL (starts with http), it works on Vercel.
  // If it's local (e.g., assets/...), it works via the public folder.
  if (path.startsWith("http") || path.startsWith("/")) return path;

  return `/${path}`;
};

export default async function MembersSection() {
  // Ensure DB connection is active for this request
  await dbConnect();

  // Fetch data directly from MongoDB
  const membersData = await Member.find().sort({ createdAt: -1 }).lean();
  const groupsData = await CoreTeam.find().sort({ createdAt: -1 }).lean();

  // Convert MongoDB _id to string to prevent hydration/serialization errors on Vercel
  const members = JSON.parse(JSON.stringify(membersData));
  const coreGroups = JSON.parse(JSON.stringify(groupsData));

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

      {/* Render Sections (Only if they have members) */}
      {[
        { label: "Organizer", data: organizers },
        { label: "Domain Leads", data: leads },
        { label: "Domain Co-Leads", data: coleads },
      ].map(
        (tier) =>
          tier.data.length > 0 && (
            <section key={tier.label} className={styles.tierSection}>
              <div className={styles["tier-label"]}>{tier.label}</div>
              <div className={styles["row-wrapper"]}>
                {tier.data.map((m, i) => (
                  <MemberCard key={m._id} member={m} index={i} />
                ))}
              </div>
            </section>
          ),
      )}

      {/* Core Team Container */}
      <div id="core-team-container">
        <div className={styles["tier-label"]}>Our Core Team</div>
        {coreGroups.map((group) => (
          <div key={group._id} className={styles["group-photo-container"]}>
            <div className={styles["group-card"]}>
              <div className={styles["group-image"]}>
                <img
                  src={getImgSrc(group.image || group.photo)}
                  alt={group.title}
                  loading="lazy"
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
