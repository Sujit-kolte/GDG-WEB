import { Member, CoreTeam } from "@/models/Member";
import dbConnect from "@/lib/db";
import styles from "./MembersSection.module.css";

// Forces fresh data fetch from MongoDB on every request in Vercel
export const dynamic = "force-dynamic";

const getImgSrc = (image) => {
  if (Array.isArray(image) && image.length > 0 && image[0]) return image[0];
  if (typeof image === "string" && image.trim() !== "") return image;
  return null; // Prevents empty string console errors
};

export default async function MembersSection() {
  await dbConnect();

  const members = await Member.find().sort({ createdAt: -1 }).lean();
  const coreGroups = await CoreTeam.find().sort({ createdAt: -1 }).lean();

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
      <h1 className={styles["section-title"]}>Meet The Core team of GDGCOE</h1>

      {/* Dynamic Member Rendering */}
      {[organizers, leads, coleads].map(
        (tier, idx) =>
          tier.length > 0 && (
            <section key={idx} className={styles["tier-wrapper"]}>
              <div className={styles["tier-label"]}>
                {idx === 0
                  ? "Organizer"
                  : idx === 1
                    ? "Domain Leads"
                    : "Domain Co-Leads"}
              </div>
              <div className={styles["row-wrapper"]}>
                {tier.map((m, i) => (
                  <MemberCard key={m._id.toString()} member={m} index={i} />
                ))}
              </div>
            </section>
          ),
      )}

      {/* Core Team Domains */}
      <div id="core-team-container">
        <div className={styles["tier-label"]}>Our Core Team</div>
        {coreGroups.map((group) => (
          <div
            key={group._id.toString()}
            className={styles["group-photo-container"]}>
            <div className={styles["group-card"]}>
              <div className={styles["group-image"]}>
                {getImgSrc(group.image) ? (
                  <img
                    src={getImgSrc(group.image)}
                    alt={group.title}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.placeholder}>No Image</div>
                )}
              </div>
              <div className={styles["group-info"]}>
                <h2>{group.title}</h2>
                <p>{group.subtitle}</p>
                <p className={styles.membersListText}>{group.membersList}</p>
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
