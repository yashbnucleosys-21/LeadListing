import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Phone, Mail, Calendar, Eye, Clock, Trash2 } from 'lucide-react';
import { Lead } from '@/types/Lead';
import { getStatusColor, getPriorityColor } from '@/utils/leadUtils';

interface LeadTableProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onCallLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void
}

const LeadTable = ({ leads, onViewLead, onEditLead, onCallLead, onDeleteLead }: LeadTableProps) => {
  // ✅ helper: format ISO dates nicely
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Lead Name</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Contact</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Priority</th>
                <th className="text-left px-4 py-3 font-medium">Assignee</th>
                <th className="text-left px-4 py-3 font-medium">Lead Source</th>
                <th className="text-left px-4 py-3 font-medium">Follow-Up Time</th>
                <th className="text-left px-4 py-3 font-medium">Next Follow-up</th>
                <th className="text-left px-4 py-3 font-medium">Service</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  {/* Lead Name */}
                  <td className="px-4 py-3 font-medium">{lead.leadName}</td>

                  {/* Company */}
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{lead.companyName}</div>
                      {lead.contactPerson && (
                        <div className="text-xs text-gray-500">{lead.contactPerson}</div>
                      )}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {lead.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      )}
                      {!lead.email && !lead.phone && <span className="text-gray-400">-</span>}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    <Badge className={getPriorityColor(lead.priority)}>{lead.priority}</Badge>
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3">{lead.assignee}</td>

                  {/* Lead Source */}
                  <td className="px-4 py-3">
                    {lead.leadSource || <span className="text-gray-400">-</span>}
                  </td>

                  {/* Follow-Up */}
                  <td className="px-4 py-3">
                    {lead.followUpTime ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(lead.followUpTime)}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Next Follow-up */}
                  <td className="px-4 py-3">
                    {lead.nextFollowUpDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(lead.nextFollowUpDate)}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Service */}
                  <td className="px-4 py-3">{lead.service || <span className="text-gray-400">-</span>}</td>

                  {/* Location */}
                  <td className="px-4 py-3">{lead.location || <span className="text-gray-400">-</span>}</td>

                  {/* Actions */}
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
                      <Button
                        size="sm"
                        variant="outline" // same style as other buttons
                        className="text-red-600 hover:bg-red-50" // make it look destructive but consistent
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${lead.leadName}?`)) {
                            onDeleteLead(lead);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
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
