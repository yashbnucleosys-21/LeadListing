import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { statuses, priorities } from '@/types/Lead';
import { addLead, updateLead } from '@/api/leadApi';
import { User, getUsers } from '@/api/userApi';
import { Lead } from '@/types/Lead';
import { toast } from 'sonner';

interface LeadFormProps {
  onClose: () => void;
  onAddLead?: (lead: Lead) => void;
  leadToEdit?: Lead;
  onUpdateLead?: (lead: Lead) => void;
}

const leadSources = [
  'Website',
  'Social Media',
  'Referral',
  'Cold Call',
  'Email Campaign',
  'Event',
  'Advertisement',
  'Other',
];

const services = ['Web Development', 'Mobile App', 'SEO', 'Marketing', 'UI/UX Design'];

const LeadForm = ({ onClose, onAddLead, leadToEdit, onUpdateLead }: LeadFormProps) => {
  const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
  const [newLead, setNewLead] = useState({
    leadName: '',
    companyName: '',
    email: '',
    contactPerson: '',
    phone: '',
    assignTo: '',
    priority: 'medium',
    status: 'new',
    notes: '',
    nextFollowUp: '',
    followUpTime: '',
    leadSource: '',
    service: '',
    location: '',
  });

  // Fetch users and filter for "Employee" role
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getUsers();
        const employeeUsers = allUsers.filter(user => user.role === 'Employee');
        setAssignableUsers(employeeUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Could not load employee list for assignment.');
      }
    };
    fetchUsers();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (leadToEdit) {
      setNewLead({
        leadName: leadToEdit.leadName || '',
        companyName: leadToEdit.companyName,
        email: leadToEdit.email,
        contactPerson: leadToEdit.contactPerson,
        phone: leadToEdit.phone,
        assignTo: leadToEdit.assignee,
        priority: leadToEdit.priority,
        status: leadToEdit.status,
        notes: leadToEdit.notes || '',
        nextFollowUp: leadToEdit.nextFollowUpDate
          ? new Date(leadToEdit.nextFollowUpDate).toISOString().substring(0, 10)
          : '',
        followUpTime: leadToEdit.followUpTime || '',
        leadSource: leadToEdit.leadSource || '',
        service: leadToEdit.service || '',
        location: leadToEdit.location || '',
      });
    }
  }, [leadToEdit]);

  const handleAddLead = async () => {
    try {
      const payload = {
        leadName: newLead.leadName,
        companyName: newLead.companyName,
        email: newLead.email,
        contactPerson: newLead.contactPerson,
        phone: newLead.phone,
        assignee: newLead.assignTo,
        priority: newLead.priority,
        status: newLead.status,
        notes: newLead.notes || undefined,
        leadSource: newLead.leadSource || undefined,
        nextFollowUpDate: newLead.nextFollowUp,
        followUpTime: newLead.followUpTime,
        service: newLead.service || undefined,
        location: newLead.location || undefined,
      };

      // This API call now triggers history logging on the backend
      const createdLead: Lead = await addLead(payload as unknown as Omit<Lead, 'id'>);
      toast.success('Lead added successfully ✅');
      if (onAddLead) onAddLead(createdLead);
      resetFormAndClose();
    } catch (error: any) {
      console.error('❌ Failed to add lead:', error);
      toast.error('Failed to add lead ❌.');
    }
  };

  const handleUpdateLead = async () => {
    if (!leadToEdit) return;
    try {
      const payload: Lead = {
        ...leadToEdit,
        leadName: newLead.leadName,
        companyName: newLead.companyName,
        email: newLead.email,
        contactPerson: newLead.contactPerson,
        phone: newLead.phone,
        assignee: newLead.assignTo,
        priority: newLead.priority,
        status: newLead.status,
        notes: newLead.notes || undefined,
        nextFollowUpDate: newLead.nextFollowUp,
        followUpTime: newLead.followUpTime || undefined,
        leadSource: newLead.leadSource || undefined,
        service: newLead.service || undefined,
        location: newLead.location || undefined,
      };

      // This API call already triggers history logging on the backend
      const updatedLead: Lead = await updateLead(payload);
      toast.success('Lead updated successfully ✅');
      if (onUpdateLead) onUpdateLead(updatedLead);
      resetFormAndClose();
    } catch (error: any) {
      console.error('❌ Failed to update lead:', error);
      toast.error('Failed to update lead ❌.');
    }
  };

  const resetFormAndClose = () => {
    setNewLead({
      leadName: '',
      companyName: '',
      email: '',
      contactPerson: '',
      phone: '',
      assignTo: '',
      priority: 'medium',
      status: 'new',
      notes: '',
      nextFollowUp: '',
      followUpTime: '',
      leadSource: '',
      service: '',
      location: '',
    });
    onClose();
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-4 overflow-y-auto h-[80vh] bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-4">
        {/* Lead Name */}
        <div className="col-span-2 space-y-2">
          <Label htmlFor="leadName">Lead Name</Label>
          <Input
            id="leadName"
            value={newLead.leadName}
            onChange={(e) => setNewLead({ ...newLead, leadName: e.target.value })}
          />
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={newLead.companyName}
            onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
          />
        </div>

        {/* Contact Person */}
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={newLead.contactPerson}
            onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={newLead.status} onValueChange={(value) => setNewLead({ ...newLead, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={newLead.priority} onValueChange={(value) => setNewLead({ ...newLead, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Next Follow-up Date */}
        <div className="space-y-2">
          <Label htmlFor="nextFollowUp">Next Follow-up Date</Label>
          <Input
            id="nextFollowUp"
            type="date"
            value={newLead.nextFollowUp}
            onChange={(e) => setNewLead({ ...newLead, nextFollowUp: e.target.value })}
          />
        </div>

        {/* Follow-up Time */}
        <div className="space-y-2">
          <Label htmlFor="followUpTime">Follow-up Time</Label>
          <Input
            id="followUpTime"
            type="time"
            value={newLead.followUpTime}
            onChange={(e) => setNewLead({ ...newLead, followUpTime: e.target.value })}
          />
        </div>

        {/* Assign To */}
        <div className="space-y-2">
          <Label htmlFor="assignTo">Assign To</Label>
          <Select value={newLead.assignTo} onValueChange={(value) => setNewLead({ ...newLead, assignTo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {assignableUsers.map((user) => (
                <SelectItem key={user.id} value={user.name}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lead Source */}
        <div className="space-y-2">
          <Label htmlFor="leadSource">Lead Source</Label>
          <Select value={newLead.leadSource} onValueChange={(value) => setNewLead({ ...newLead, leadSource: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Lead Source" />
            </SelectTrigger>
            <SelectContent>
              {leadSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Service */}
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Select
            value={newLead.service}
            onValueChange={(value) => setNewLead({ ...newLead, service: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={newLead.location}
            onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
            placeholder="Enter location"
          />
        </div>

        {/* Notes */}
        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            value={newLead.notes}
            onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
          />
        </div>
      </div>
      
      <div className="col-span-2 flex justify-end mt-4">
        <Button
          onClick={leadToEdit ? handleUpdateLead : handleAddLead}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {leadToEdit ? 'Update Lead' : 'Add Lead'}
        </Button>
      </div>
    </div>
  );
};

export default LeadForm;