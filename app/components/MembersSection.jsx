import { Member, CoreTeam } from "@/models/Member";
import dbConnect from "@/lib/db";
import styles from "./MembersSection.module.css";

/**
 * Cloudinary Image Logic
 * - If image is array -> take first
 * - If image is string and not empty -> return directly
 * - Else -> return null to avoid console warnings
 */
const getImgSrc = (image) => {
  if (Array.isArray(image) && image.length > 0 && image[0]) return image[0];
  if (typeof image === "string" && image.trim() !== "") return image;
  // Returning null instead of an empty string prevents the console error
  return null;
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
      <div className={styles["section-header"]}>
        <h1 className={styles["section-title"]}>
          Meet The Core team of GDGCOE
        </h1>
      </div>

      {/* Organizer Section */}
      {organizers.length > 0 && (
        <div id="organizer-section">
          <div className={styles["tier-label"]}>Organizer</div>
          <div className={styles["row-wrapper"]} id="organizer-row">
            {organizers.map((m, i) => (
              <MemberCard key={m._id.toString()} member={m} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Leads Section */}
      {leads.length > 0 && (
        <div id="leads-section">
          <div className={styles["tier-label"]}>Domain Leads</div>
          <div className={styles["row-wrapper"]} id="leads-row">
            {leads.map((m, i) => (
              <MemberCard key={m._id.toString()} member={m} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Co-Leads Section */}
      {coleads.length > 0 && (
        <div id="coleads-section">
          <div className={styles["tier-label"]}>Domain Co-Leads</div>
          <div className={styles["row-wrapper"]} id="coleads-row">
            {coleads.map((m, i) => (
              <MemberCard key={m._id.toString()} member={m} index={i} />
            ))}
          </div>
        </div>
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
                  {/* Conditional Rendering: Only render img if imgSrc is not null */}
                  {imgSrc ? (
                    <img src={imgSrc} alt={group.title} />
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
        {/* Conditional Rendering to fix the empty string error */}
        {imgSrc ? (
          <img src={imgSrc} alt={member.name} />
        ) : (
          <div className={styles.placeholder}>GDG Member</div>
        )}
      </div>

      <div className={styles.info}>
        <h3>{member.name}</h3>
        <p>{member.domain}</p>

        <div className={styles["social-links"]}>
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          )}

          {member.github && (
            <a href={member.github} target="_blank" rel="noreferrer">
              <i className="fab fa-github"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
