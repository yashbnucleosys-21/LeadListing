import React from "react";

const LeadTable = ({ leads }) => {
  return (
    <div className="overflow-x-auto border rounded-2xl shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Lead Name</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Company</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Contact</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Priority</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Assignee</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Lead Source</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Follow-Up Time</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Next Follow-up</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Service</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Location</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3">{lead.name}</td>
              <td className="px-4 py-3">{lead.company}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span>{lead.email || "NA"}</span>
                  <span className="text-gray-500 text-xs">{lead.phone}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    lead.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : lead.priority === "medium"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {lead.priority}
                </span>
              </td>
              <td className="px-4 py-3">{lead.assignee}</td>
              <td className="px-4 py-3">{lead.source}</td>
              <td className="px-4 py-3">{lead.followUpTime}</td>
              <td className="px-4 py-3">{lead.nextFollowUp}</td>
              <td className="px-4 py-3">{lead.service}</td>
              <td className="px-4 py-3">{lead.location}</td>
              <td className="px-4 py-3 space-x-2">
                <button className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                  Edit
                </button>
                <button className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
