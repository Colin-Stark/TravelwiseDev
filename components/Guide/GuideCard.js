import styles from "@/styles/GuidePage.module.css";

export default function GuideCard({
  name,
  ProfileImage,
  Category,
  country,
  description,
}) {
  return (
    <div className={styles.UniformCard}>
      <div className={styles.CardImageWrapper}>
        <img src={ProfileImage} alt={name} className={styles.CardImage} />
      </div>

      <div className={styles.CardContent}>
        <h5>{name}</h5>
        <p className={styles.Category}>{Category}</p>
        <p className={styles.Country}>{country}</p>

        <p className={styles.Description}>
          {description.length > 85 ? description.slice(0, 85) + "..." : description}
        </p>
      </div>
    </div>
  );
}
