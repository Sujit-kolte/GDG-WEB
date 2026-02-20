import { Member, CoreTeam } from "@/models/Member";
import dbConnect from "@/lib/db";
import styles from "./MembersSection.module.css";

// Force Next.js to skip the cache and fetch fresh data from MongoDB
export const dynamic = "force-dynamic";

const getImgSrc = (image) => {
  if (Array.isArray(image) && image.length > 0 && image[0]) return image[0];
  if (typeof image === "string" && image.trim() !== "") return image;
  return null;
};

export default async function MembersSection() {
  await dbConnect();

  // Fetching data - dynamic rendering ensures these are fresh
  const members = await Member.find().sort({ createdAt: -1 }).lean();
  const coreGroups = await CoreTeam.find().sort({ createdAt: -1 }).lean();

  // Helper to safely check tiers
  const filterByTier = (tierName) =>
    members.filter(
      (m) => m.tier?.toLowerCase()?.trim() === tierName.toLowerCase(),
    );

  const organizers = filterByTier("organizer");
  const leads = filterByTier("domain lead");
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
        <section id="organizer-section">
          <div className={styles["tier-label"]}>Organizer</div>
          <div className={styles["row-wrapper"]}>
            {organizers.map((m, i) => (
              <MemberCard key={m._id.toString()} member={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Leads Section */}
      {leads.length > 0 && (
        <section id="leads-section">
          <div className={styles["tier-label"]}>Domain Leads</div>
          <div className={styles["row-wrapper"]}>
            {leads.map((m, i) => (
              <MemberCard key={m._id.toString()} member={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Co-Leads Section */}
      {coleads.length > 0 && (
        <section id="coleads-section">
          <div className={styles["tier-label"]}>Domain Co-Leads</div>
          <div className={styles["row-wrapper"]}>
            {coleads.map((m, i) => (
              <MemberCard key={m._id.toString()} member={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Core Team Container */}
      <div id="core-team-container">
        <div className={styles["tier-label"]}>Our Core Team</div>
        {coreGroups.map((group) => {
          const imgSrc = getImgSrc(group.image);
          return (
            <div
              key={group._id.toString()}
              className={styles["group-photo-container"]}>
              <div className={styles["group-card"]}>
                <div className={styles["group-image"]}>
                  {imgSrc ? (
                    <img src={imgSrc} alt={group.title} loading="lazy" />
                  ) : (
                    <div className={styles.placeholder}>No Group Image</div>
                  )}
                </div>
                <div className={styles["group-info"]}>
                  <h2>{group.title}</h2>
                  <p>{group.subtitle}</p>
                  <p className={styles.membersListText}>{group.membersList}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MemberCard({ member, index }) {
  const rotation = index % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)";
  const imgSrc = getImgSrc(member.image);

  return (
    <div className={styles["member-card"]} style={{ transform: rotation }}>
      <div className={styles["image-box"]}>
        {imgSrc ? (
          <img src={imgSrc} alt={member.name} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>GDG Member</div>
        )}
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
