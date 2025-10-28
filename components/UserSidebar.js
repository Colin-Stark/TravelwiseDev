import Link from "next/link";
import { Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getUserCookie } from "/lib/cookies";

export default function UserSidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = getUserCookie()?.email;
      if (!email) return;
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="bg-dark text-white p-4 rounded h-100">
      {/* User Info */}
      <div className="d-flex align-items-center mb-4">
        <div className="ms-3">
          <h5 className="text-truncate" title={user ? `${user.firstName} ${user.lastName}` : ""}>{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</h5>
          <small className="text-muted text-truncate" title={user ? user.email : ""}>{user ? user.email : ""}</small>
        </div>
      </div>

      {/* Navigation */}
      <nav className="d-flex flex-column gap-3">
        <Link href="/home" className="text-white text-decoration-none">🏠 Emergency Contact</Link>
        <Link href="/resetPassword" className="text-white text-decoration-none">📥 Reset Password</Link>
        <Link href="/profile" className="btn btn-secondary text-white">👤 Profile</Link>
      </nav>
    </div>
  );
}
