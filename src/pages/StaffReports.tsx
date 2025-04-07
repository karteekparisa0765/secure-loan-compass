import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom"; // for navigation

interface Application {
  id: number;
  first_name: string;
  last_name: string;
  loan_purpose: string;
  loan_amount: number;
  status: string;
  submitted_at: string;
}

export default function StaffReports() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("loan_applications")
      .select("*")
      .in("status", ["accepted", "rejected"]);

    if (error) {
      console.error("Error fetching applications:", error.message);
    } else {
      setApplications(data as Application[]);
    }

    setLoading(false);
  };

  const totalAccepted = applications.filter(app => app.status === "accepted").length;
  const totalRejected = applications.filter(app => app.status === "rejected").length;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded shadow">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4 text-gray-800">Application Reports</h2>
      <div className="mb-4 text-sm text-gray-700">
        <span className="text-green-600 font-semibold">Total Accepted: {totalAccepted}</span>
        {" | "}
        <span className="text-red-600 font-semibold">Total Rejected: {totalRejected}</span>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-900 text-white text-left text-sm uppercase">
              <th className="px-4 py-2">Applicant Name</th>
              <th className="px-4 py-2">Loan Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">Loading...</td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No accepted or rejected applications yet.
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id} className="border-t text-sm text-gray-700">
                  <td className="px-4 py-2">{app.first_name} {app.last_name}</td>
                  <td className="px-4 py-2">{app.loan_purpose}</td>
                  <td className="px-4 py-2">${app.loan_amount}</td>
                  <td className="px-4 py-2 capitalize">{app.status}</td>
                  <td className="px-4 py-2">
                    {app.submitted_at ? new Date(app.submitted_at).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
