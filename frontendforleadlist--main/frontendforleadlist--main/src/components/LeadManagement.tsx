import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { Lead, statuses } from '@/types/Lead';
import { getAllLeads } from '@/api/leadApi';
import { User, getUsers } from '@/api/userApi';
import { filterLeads } from '@/utils/leadUtils';
import LeadForm from '@/components/LeadForm';
import LeadTable from '@/components/LeadTable';
import LeadDetailsDialog from '@/components/LeadDetailsDialog';
import CallDialog from '@/components/CallDialog';
import { getAllCallLogs } from '../api/callLogApi'; // ✅ ADDED: Import to trigger refresh in parent for CallHistory
import { deleteLead } from '@/api/leadApi'; // ✅ import delete API


const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // ✅ ADDED: Loading state
  const [error, setError] = useState<string | null>(null); // ✅ ADDED: Error state

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [callLeadData, setCallLeadData] = useState<Lead | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      const [leadsData, usersData] = await Promise.all([
        getAllLeads(),
        getUsers(),
      ]);
      setLeads(leadsData);
      setUsers(usersData);
      setError(null); // Clear any previous errors
    } catch (apiError: any) { // ✅ UPDATED: Catch API errors
      setError(apiError.message || 'An unexpected error occurred while fetching data.');
      console.error('Error fetching data:', apiError);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLeads = filterLeads(leads, searchTerm, filterStatus);

  const employeeUsers = users.filter((user) => user.role === 'Employee');

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setIsEditDialogOpen(false);
    setEditingLead(null);
  };

  const handleAddLeadSuccess = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    setIsAddDialogOpen(false); // Close dialog on success
  };

  const handleCallLead = (lead: Lead) => {
    setCallLeadData(lead);
    setIsCallDialogOpen(true);
  };

  // ✅ ADDED: Callback to refresh data after a call is logged
  const handleCallLogged = () => {
    fetchData(); // Re-fetch leads (to get updated last contact, etc. if implemented) and call logs
  };

  const handleDeleteLead = async (lead: Lead) => {
    try {
      await deleteLead(lead.id);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete lead');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assign To Dropdown */}
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Assign to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employeeUsers.map((user) => (
                <SelectItem key={user.id} value={user.name}> {/* Changed value to user.name */}
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Lead Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <LeadForm
              onClose={() => setIsAddDialogOpen(false)}
              onAddLead={handleAddLeadSuccess} // ✅ UPDATED
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Leads Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading leads...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <LeadTable
          leads={filteredLeads}
          onViewLead={setSelectedLead}
          onEditLead={handleEditLead}
          onCallLead={handleCallLead}
          onDeleteLead={handleDeleteLead} // ✅ pass delete callback
        />
      )}

      {/* View Lead Dialog */}
      <LeadDetailsDialog
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <LeadForm
            leadToEdit={editingLead}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingLead(null);
            }}
            onUpdateLead={handleUpdateLead}
          />
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <CallDialog
        lead={callLeadData}
        isOpen={isCallDialogOpen}
        onClose={() => {
          setIsCallDialogOpen(false);
          setCallLeadData(null);
        }}
        onCallLogged={handleCallLogged} // ✅ Pass the callback
      />
    </div>
  );
};

export default LeadManagement;