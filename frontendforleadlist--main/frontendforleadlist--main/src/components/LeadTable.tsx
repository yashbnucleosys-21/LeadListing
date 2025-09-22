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
        {/* ✅ Added responsive wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="text-left p-4 font-medium">Lead Name</th>
                <th className="text-left p-4 font-medium">Company</th>
                <th className="text-left p-4 font-medium">Contact</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Priority</th>
                <th className="text-left p-4 font-medium">Assignee</th>
                <th className="text-left p-4 font-medium">Lead Source</th>
                <th className="text-left p-4 font-medium">Follow-Up Time</th>
                <th className="text-left p-4 font-medium">Next Follow-up</th>
                <th className="text-left p-4 font-medium">Service</th>
                <th className="text-left p-4 font-medium">Location</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">{lead.leadName}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{lead.companyName}</div>
                      <div className="text-sm text-gray-500">{lead.contactPerson}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getPriorityColor(lead.priority)}`}>
                      {lead.priority}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">{lead.assignee}</td>
                  <td className="p-4 text-sm">
                    {lead.leadSource || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-4 text-sm">
                    {lead.followUpTime ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {lead.followUpTime}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {lead.nextFollowUpDate ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {lead.nextFollowUpDate}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {lead.service || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-4 text-sm">
                    {lead.location || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-4">
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
