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
        <div className="flex justify-center">
          <table className="w-full min-w-[1200px] bg-white">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium bg-white">Lead Name</th>
                <th className="text-left p-4 font-medium bg-white">Company</th>
                <th className="text-left p-4 font-medium bg-white">Contact</th>
                <th className="text-left p-4 font-medium bg-white">Status</th>
                <th className="text-left p-4 font-medium bg-white">Priority</th>
                <th className="text-left p-4 font-medium bg-white">Assignee</th>
                <th className="text-left p-4 font-medium bg-white">Lead Source</th>
                <th className="text-left p-4 font-medium bg-white">Follow-Up Time</th>
                <th className="text-left p-4 font-medium bg-white">Next Follow-up</th>
                <th className="text-left p-4 font-medium bg-white">Service</th>
                <th className="text-left p-4 font-medium bg-white">Location</th> {/* Added Location Header */}
                <th className="text-left p-4 font-medium bg-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50 bg-white">
                  <td className="p-4 text-sm font-medium bg-white">{lead.leadName}</td>
                  <td className="p-4 bg-white">
                    <div>
                      <div className="font-medium">{lead.companyName}</div>
                      <div className="text-sm text-gray-500">{lead.contactPerson}</div>
                    </div>
                  </td>
                  <td className="p-4 bg-white">
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
                  <td className="p-4 bg-white">
                    <Badge className={`${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="p-4 bg-white">
                    <Badge className={`${getPriorityColor(lead.priority)}`}>
                      {lead.priority}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm bg-white">{lead.assignee}</td>
                  <td className="p-4 text-sm bg-white">
                    {lead.leadSource || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-4 text-sm bg-white">
                    {lead.followUpTime ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {lead.followUpTime}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 bg-white">
                    {lead.nextFollowUpDate ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {lead.nextFollowUpDate}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm bg-white">
                   {lead.service || <span className="text-gray-400">-</span>}
                  </td>
                   {/* Added Location Data */}
                   <td className="p-4 text-sm bg-white">
                    {lead.location || <span className="text-gray-400">-</span>}
                   </td>

                  <td className="p-4 bg-white">
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