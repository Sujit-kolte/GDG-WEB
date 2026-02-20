"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protection: Ensure only logged-in users stay here
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading")
    return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>GDG SKNCOE Admin</h1>
        <div className={styles.userSection}>
          <span>Welcome, {session?.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Management Console</h2>
        <p className={styles.subtitle}>
          Select a category to manage data and upload to Cloudinary.
        </p>

        <div className={styles.buttonGrid}>
          {/* Link to existing Events Page */}
          <Link href="/admin/events" className={styles.navButton}>
            <span className={styles.icon}>📅</span>
            <span className={styles.label}>Events</span>
          </Link>

          {/* Link to existing Members Page */}
          <Link href="/admin/members" className={styles.navButton}>
            <span className={styles.icon}>👥</span>
            <span className={styles.label}>Members</span>
          </Link>

          {/* Link to existing Snippets Page */}
          <Link href="/admin/snippets" className={styles.navButton}>
            <span className={styles.icon}>💻</span>
            <span className={styles.label}>Snippets</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
