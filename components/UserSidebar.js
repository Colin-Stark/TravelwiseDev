import Link from "next/link";
import { Image } from "react-bootstrap";

export default function Sidebar() {
  return (
    <div className="bg-dark text-white p-4 rounded h-100">
      {/* User Info */}
      <div className="d-flex align-items-center mb-4">
        <Image src="/avatar.png" roundedCircle width="50" height="50" />
        <div className="ms-3">
          <h5>Marc Gurwitz</h5>
          <small className="text-muted">marc.gurwitz@icloud.com</small>
        </div>
      </div>

      {/* Navigation */}
      <nav className="d-flex flex-column gap-3">
        <Link href="/home" className="text-white text-decoration-none">🏠 Home</Link>
        <Link href="/resetPassword" className="text-white text-decoration-none">📥 Reset Password</Link>
        <Link href="/profile" className="btn btn-secondary text-white">👤 Profile</Link>
      </nav>
    </div>
  );
}
