import Link from "next/link";
import { Nav } from "react-bootstrap";

export default function DashboardSidebar() {
  return (
    <div className="bg-dark text-white p-4 vh-100">
      <h4 className="mb-4">TravelWise</h4>
      <Nav className="flex-column gap-3">
        <Link href="/dashboard" className="text-white text-decoration-none">🏠 Homepage</Link>
        <Link href="/dashboard" className="text-white text-decoration-none">📊 Dashboard</Link>
        <Link href="/itinerary" className="text-white text-decoration-none">🗂 Itinerary Management</Link>
        <Link href="/expenses" className="text-white text-decoration-none">💵 Expense Tracking</Link>
        <Link href="/guides" className="text-white text-decoration-none">🧑‍🤝‍🧑 Local Guide Booking</Link>
        <Link href="/recommendations" className="text-white text-decoration-none">🌍 Destination Recommendations</Link>
      </Nav>
    </div>
  );
}
