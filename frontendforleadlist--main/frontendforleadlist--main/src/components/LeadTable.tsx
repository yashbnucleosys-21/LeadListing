import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Phone, Mail, Calendar, Eye, Clock } from 'lucide-react';
import { Lead } from '@/types/Lead';
import { getStatusColor, getPriorityColor } from '@/utils/leadUtils';

interface LeadTableProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onCallLead: (lead: Lead) => void;
}

const LeadTable = ({ leads, onViewLead, onEditLead, onCallLead }: LeadTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-center overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Lead Name</th>
                <th className="text-left px-4 py-3 font-semibold">Company</th>
                <th className="text-left px-4 py-3 font-semibold">Contact</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Priority</th>
                <th className="text-left px-4 py-3 font-semibold">Assignee</th>
                <th className="text-left px-4 py-3 font-semibold">Lead Source</th>
                <th className="text-left px-4 py-3 font-semibold">Follow-Up Time</th>
                <th className="text-left px-4 py-3 font-semibold">Next Follow-up</th>
                <th className="text-left px-4 py-3 font-semibold">Service</th>
                <th className="text-left px-4 py-3 font-semibold">Location</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                >
                  <td className="px-4 py-3 font-medium">{lead.leadName}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{lead.companyName}</div>
                      <div className="text-gray-500">{lead.contactPerson}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-500" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-500" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`${getStatusColor(lead.status)}`}>{lead.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`${getPriorityColor(lead.priority)}`}>{lead.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">{lead.assignee}</td>
                  <td className="px-4 py-3">
                    {lead.leadSource || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    {lead.followUpTime ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        {lead.followUpTime}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.nextFollowUpDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        {lead.nextFollowUpDate}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.service || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    {lead.location || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onViewLead(lead)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onEditLead(lead)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onCallLead(lead)}>
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadTable;
