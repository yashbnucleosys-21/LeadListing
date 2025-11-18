import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Calendar, Clock, CheckCircle, AlertTriangle, Bell, Phone, Mail, Video, Eye, Edit, History, Trash } from 'lucide-react';
import { getAllLeads } from '@/api/leadApi';
import { getUsers, User as BackendUser } from '@/api/userApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL; // Set default baseURL for axios instance used in this component

// Interface for the API response when fetching leads
interface ApiLeadResponse {
  id: number;
  leadName: string;
  companyName: string;
  email: string;
  contactPerson: string;
  phone: string;
  assignee: string;
  // ✅ FIX: Expanded status types to include all possibilities used in frontend logic
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost' | 'pending' | 'completed' | 'overdue' | 'cancelled';
  notes?: string;
  leadSource?: string;
  nextFollowUpDate?: string;
  followUpTime?: string;
  location?: string;
  service: string;
  customAttributes?: Record<string, any>;
}

// Interface for the component's internal state
interface FollowUp {
  id: number;
  leadId: number;
  leadName: string; // Using companyName for display
  assignee: string;
  type: string;
  priority: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string; // Using service for description
  notes: string;
  createdDate: string;
  completedDate?: string;
  updatedAt?: Date | null;
}

// Interface for a single history log item (matches backend controller response)
interface FollowUpHistoryItem {
  id: number;
  description: string;
  notes: string | null;
  status: string;
  priority: string;
  createdAt: string; // ISO date string
  leadId: number;
}


const FollowUpManager: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [editFollowUp, setEditFollowUp] = useState<FollowUp | null>(null);
  const [historyFollowUp, setHistoryFollowUp] = useState<FollowUp | null>(null);

  const [historyLogs, setHistoryLogs] = useState<FollowUpHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);


  const [newFollowUp, setNewFollowUp] = useState<Omit<FollowUp, 'id' | 'leadId' | 'createdDate' | 'updatedAt'>>({
    leadName: '',
    assignee: '',
    type: 'call',
    priority: 'medium',
    status: 'pending',
    scheduledDate: '',
    scheduledTime: '',
    description: '',
    notes: '',
  });
  const [leadsData, setLeadsData] = useState<ApiLeadResponse[]>([]);
  const [selectedLeadForNewFollowUp, setSelectedLeadForNewFollowUp] = useState<ApiLeadResponse | null>(null);


  const types = ['call', 'email', 'meeting', 'demo'];
  const priorities = ['low', 'medium', 'high'];
  // ✅ FIX: Combined all relevant statuses from both API response and internal component logic
  const statuses = ['pending', 'completed', 'overdue', 'cancelled', 'new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [leadsResponse, usersResponse] = await Promise.all([
          getAllLeads(),
          getUsers(),
        ]);
        // ✅ FIX: Ensure response data is treated as array for safety
        const leadsData = Array.isArray(leadsResponse) ? leadsResponse as ApiLeadResponse[] : [];
        const usersData = Array.isArray(usersResponse) ? usersResponse : [];

        setLeadsData(leadsData);

        const companyList = Array.from(new Set(leadsData.map(lead => lead.companyName).filter(Boolean)));
        setCompanies(companyList);

        const assigneeList = Array.from(new Set(usersData.map(user => user.name).filter(Boolean)));
        setAssignees(assigneeList);

        const mappedFollowUps: FollowUp[] = leadsData.map((apiLead) => {
          // ✅ FIX: Ensure currentStatus can correctly become 'overdue' if applicable
          let currentStatus: FollowUp['status'] = apiLead.status; // Start with API status, then potentially update
          const scheduledDate = apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : '';
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize today for comparison

          // Logic to determine if a 'pending' follow-up is 'overdue'
          if (scheduledDate) { // Only check if a scheduledDate exists
            const followUpDate = new Date(scheduledDate);
            followUpDate.setHours(0, 0, 0, 0); // Normalize followUpDate for comparison

            if (currentStatus === 'pending' && followUpDate < today) {
              currentStatus = 'overdue';
            }
          }


          let followUpType = 'call';
          const serviceLower = apiLead.service.toLowerCase();
          if (serviceLower.includes('email')) followUpType = 'email';
          else if (serviceLower.includes('meeting')) followUpType = 'meeting';
          else if (serviceLower.includes('demo')) followUpType = 'demo';

          return {
            id: apiLead.id,
            leadId: apiLead.id,
            leadName: apiLead.companyName || 'Unknown Lead',
            assignee: apiLead.assignee || 'Unassigned',
            type: followUpType,
            priority: apiLead.priority || 'medium',
            status: currentStatus,
            scheduledDate: scheduledDate,
            scheduledTime: apiLead.followUpTime || '',
            description: apiLead.service || 'General Follow-up',
            notes: apiLead.notes || '',
            createdDate: apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            updatedAt: apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate) : new Date(),
          };
        });

        setFollowUps(mappedFollowUps);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch follow-ups. Please ensure the backend server is running and data is available.');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchHistoryForLead = async (leadId: number) => {
      try {
        setIsHistoryLoading(true);
        setHistoryLogs([]);
        const response = await axios.get<FollowUpHistoryItem[]>(`${API_BASE_URL}/leads/${leadId}/history`);
        setHistoryLogs(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Could not load follow-up history.");
      } finally {
        setIsHistoryLoading(false);
      }
    };
    if (historyFollowUp) {
      fetchHistoryForLead(historyFollowUp.leadId);
    }
  }, [historyFollowUp]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-indigo-100 text-indigo-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'won': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-rose-100 text-rose-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => ({ high: 'bg-red-100 text-red-800', medium: 'bg-orange-100 text-orange-800', low: 'bg-green-100 text-green-800' }[priority] || 'bg-gray-100 text-gray-800');
  const getTypeIcon = (type: string) => { switch (type) { case 'call': return <Phone className="h-4 w-4" />; case 'email': return <Mail className="h-4 w-4" />; case 'meeting': return <Video className="h-4 w-4" />; case 'demo': return <Video className="h-4 w-4" />; default: return <Calendar className="h-4 w-4" />; } };
  const isToday = (date: string) => date ? new Date(date).toDateString() === new Date().toDateString() : false;

  const filteredFollowUps = useMemo(() => followUps.filter((followUp) => {
    const matchesSearch = (followUp.leadName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || (followUp.assignee || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesStatus = filterStatus === 'all' || (followUp.status || '') === filterStatus;
    const matchesPriority = filterPriority === 'all' || (followUp.priority || '') === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || (followUp.assignee || '') === filterAssignee;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  }), [followUps, searchTerm, filterStatus, filterPriority, filterAssignee]);

  const handleAddFollowUp = async () => {
    if (!selectedLeadForNewFollowUp || !newFollowUp.scheduledDate) {
      alert('Please select a lead and schedule a date.');
      return;
    }
    try {
      const payload = {
        leadName: selectedLeadForNewFollowUp.leadName,
        companyName: selectedLeadForNewFollowUp.companyName,
        email: selectedLeadForNewFollowUp.email,
        contactPerson: selectedLeadForNewFollowUp.contactPerson,
        phone: selectedLeadForNewFollowUp.phone,
        assignee: newFollowUp.assignee,
        priority: newFollowUp.priority,
        status: newFollowUp.status,
        notes: newFollowUp.notes,
        leadSource: selectedLeadForNewFollowUp.leadSource,
        nextFollowUpDate: newFollowUp.scheduledDate,
        followUpTime: newFollowUp.scheduledTime,
        service: newFollowUp.description,
        location: selectedLeadForNewFollowUp.location,
      };

      await axios.put(`${API_BASE_URL}/leads/${selectedLeadForNewFollowUp.id}`, payload);

      const response = await axios.get<ApiLeadResponse[]>(`${API_BASE_URL}/leads`);
      const updatedLeadsData = Array.isArray(response.data) ? response.data : [];

      const mappedFollowUps: FollowUp[] = updatedLeadsData.map((apiLead) => {
        let currentStatus: FollowUp['status'] = apiLead.status;
        const scheduledDate = apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (scheduledDate) {
          const followUpDate = new Date(scheduledDate);
          followUpDate.setHours(0, 0, 0, 0);
          if (currentStatus === 'pending' && followUpDate < today) {
            currentStatus = 'overdue';
          }
        }

        let followUpType = 'call';
        const serviceLower = apiLead.service.toLowerCase();
        if (serviceLower.includes('email')) followUpType = 'email';
        else if (serviceLower.includes('meeting')) followUpType = 'meeting';
        else if (serviceLower.includes('demo')) followUpType = 'demo';

        return {
          id: apiLead.id,
          leadId: apiLead.id,
          leadName: apiLead.companyName || 'Unknown Lead',
          assignee: apiLead.assignee || 'Unassigned',
          type: followUpType,
          priority: apiLead.priority || 'medium',
          status: currentStatus,
          scheduledDate: scheduledDate,
          scheduledTime: apiLead.followUpTime || '',
          description: apiLead.service || 'General Follow-up',
          notes: apiLead.notes || '',
          createdDate: apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          updatedAt: apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate) : new Date(),
        };
      });

      setFollowUps(mappedFollowUps);

      setNewFollowUp({
        leadName: '', assignee: '', type: 'call', priority: 'medium', status: 'pending', scheduledDate: '', scheduledTime: '', description: '', notes: '',
      });
      setSelectedLeadForNewFollowUp(null);
      setIsAddDialogOpen(false);
    } catch (err: any) {
      setError(`Failed to schedule follow-up: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteFollowUp = async (followUpId: number) => {
    const followUpToDelete = followUps.find(f => f.id === followUpId);
    if (!followUpToDelete) return;

    if (!window.confirm(`Are you sure you want to delete follow-up for "${followUpToDelete.leadName}"?`)) return;

    try {
      // 1️⃣ Delete follow-up
      await axios.delete(`${API_BASE_URL}/leads/${followUpToDelete.leadId}`);

      // 2️⃣ Log deletion in history
      await axios.post(`${API_BASE_URL}/leads/${followUpToDelete.leadId}/history`, {
        description: 'Follow-up deleted',
        notes: `Follow-up for ${followUpToDelete.leadName} was deleted.`,
        status: followUpToDelete.status,
        priority: followUpToDelete.priority,
        leadId: followUpToDelete.leadId,
      });

      // 3️⃣ Remove from frontend state
      setFollowUps(prev => prev.filter(f => f.id !== followUpId));
    } catch (err) {
      setError('Failed to delete follow-up or log history.');
      console.error(err);
    }
  };




  const handleEditFollowUp = async () => {
    if (!editFollowUp) return;
    try {
      const apiPayload = {
        leadName: editFollowUp.leadName,
        companyName: editFollowUp.leadName,
        contactPerson: editFollowUp.leadName,
        status: editFollowUp.status,
        priority: editFollowUp.priority,
        assignee: editFollowUp.assignee,
        service: editFollowUp.description,
        nextFollowUpDate: editFollowUp.scheduledDate,
        followUpTime: editFollowUp.scheduledTime,
        notes: editFollowUp.notes,
      };
      const url = `${API_BASE_URL}/leads/${editFollowUp.leadId}`;
      await axios.put(url, apiPayload);

      setFollowUps(prev => prev.map(f => (f.id === editFollowUp.id) ? { ...f, ...editFollowUp } : f));

      const response = await axios.get<ApiLeadResponse[]>(`${API_BASE_URL}/leads`);
      const updatedLeadsData = Array.isArray(response.data) ? response.data : [];

      const mappedFollowUps: FollowUp[] = updatedLeadsData.map((apiLead) => {
        let currentStatus: FollowUp['status'] = apiLead.status;
        const scheduledDate = apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (scheduledDate) {
          const followUpDate = new Date(scheduledDate);
          followUpDate.setHours(0, 0, 0, 0);
          if (currentStatus === 'pending' && followUpDate < today) {
            currentStatus = 'overdue';
          }
        }
        let followUpType = 'call';
        const serviceLower = apiLead.service.toLowerCase();
        if (serviceLower.includes('email')) followUpType = 'email';
        else if (serviceLower.includes('meeting')) followUpType = 'meeting';
        else if (serviceLower.includes('demo')) followUpType = 'demo';

        return {
          id: apiLead.id,
          leadId: apiLead.id,
          leadName: apiLead.companyName || 'Unknown Lead',
          assignee: apiLead.assignee || 'Unassigned',
          type: followUpType,
          priority: apiLead.priority || 'medium',
          status: currentStatus,
          scheduledDate: scheduledDate,
          scheduledTime: apiLead.followUpTime || '',
          description: apiLead.service || 'General Follow-up',
          notes: apiLead.notes || '',
          createdDate: apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          updatedAt: apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate) : new Date(),
        };
      });

      setFollowUps(mappedFollowUps);
      setEditFollowUp(null);
    } catch (err: any) {
      setError(`Failed to update follow-up: ${err.message || 'Unknown error'}`);
    }
  };

  const markAsCompleted = async (id: number) => {
    const followUpToUpdate = followUps.find((f) => f.id === id);
    if (!followUpToUpdate) return;
    try {
      await axios.put(`${API_BASE_URL}/leads/${followUpToUpdate.leadId}`, { ...followUpToUpdate, status: 'completed' });
      setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } : f));
    } catch (err) {
      setError('Failed to update follow-up status.');
    }
  };

  const stats = useMemo(() => ({ today: followUps.filter(f => isToday(f.scheduledDate) && f.status === 'pending').length, overdue: followUps.filter(f => f.status === 'overdue').length, pending: followUps.filter(f => f.status === 'pending').length, completedThisWeek: followUps.filter(f => { if (!f.completedDate) return false; const completedDate = new Date(f.completedDate); const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); return completedDate >= weekAgo; }).length }), [followUps]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-2"><Bell className="h-5 w-5 text-orange-600" /><div><p className="text-sm text-gray-500">Today's Follow-ups</p><p className="text-2xl font-bold">{stats.today}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-600" /><div><p className="text-sm text-gray-500">Overdue</p><p className="text-2xl font-bold">{stats.overdue}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><Clock className="h-5 w-5 text-blue-600" /><div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /><div><p className="text-sm text-gray-500">Completed (7 days)</p><p className="text-2xl font-bold">{stats.completedThisWeek}</p></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-wrap">
          <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><Input placeholder="Search follow-ups..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64" /></div>
          <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{statuses.map((status) => (<SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>))}</SelectContent></Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}><SelectTrigger className="w-32"><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All Priority</SelectItem>{priorities.map((p) => (<SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>))}</SelectContent></Select>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}><SelectTrigger className="w-40"><SelectValue placeholder="Assignee" /></SelectTrigger><SelectContent><SelectItem value="all">All Assignees</SelectItem>{assignees.map((assignee) => (<SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>))}</SelectContent></Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Schedule Follow-up</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Follow-up</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newLeadName">Lead/Company Name</Label>
                <Select
                  value={selectedLeadForNewFollowUp?.id.toString()}
                  onValueChange={(value) => setSelectedLeadForNewFollowUp(leadsData.find(l => l.id === parseInt(value)) || null)}
                >
                  <SelectTrigger><SelectValue placeholder="Select Lead" /></SelectTrigger>
                  <SelectContent>
                    {leadsData.map(lead => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>{lead.companyName} ({lead.contactPerson})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newAssignee">Assign to</Label>
                <Select value={newFollowUp.assignee} onValueChange={(value) => setNewFollowUp({ ...newFollowUp, assignee: value })}>
                  <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
                  <SelectContent>
                    {assignees.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newType">Type</Label>
                <Select value={newFollowUp.type} onValueChange={(value) => setNewFollowUp({ ...newFollowUp, type: value })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {types.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPriority">Priority</Label>
                <Select value={newFollowUp.priority} onValueChange={(value) => setNewFollowUp({ ...newFollowUp, priority: value as any })}>
                  <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (<SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newStatus">Status</Label>
                <Select value={newFollowUp.status} onValueChange={(value) => setNewFollowUp({ ...newFollowUp, status: value })}>
                  <SelectTrigger id="newStatus"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newScheduledDate">Scheduled Date</Label>
                <Input id="newScheduledDate" type="date" value={newFollowUp.scheduledDate} onChange={(e) => setNewFollowUp({ ...newFollowUp, scheduledDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newScheduledTime">Scheduled Time</Label>
                <Input id="newScheduledTime" type="time" value={newFollowUp.scheduledTime} onChange={(e) => setNewFollowUp({ ...newFollowUp, scheduledTime: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="newDescription">Description</Label>
                <Input id="newDescription" value={newFollowUp.description} onChange={(e) => setNewFollowUp({ ...newFollowUp, description: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="newNotes">Notes</Label>
                <Textarea id="newNotes" value={newFollowUp.notes} onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddFollowUp} className="bg-blue-600 hover:bg-blue-700">Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 font-medium">Lead/Company</th><th className="text-left p-4 font-medium">Type & Description</th><th className="text-left p-4 font-medium">Assignee</th><th className="text-left p-4 font-medium">Scheduled</th><th className="text-left p-4 font-medium">Priority</th><th className="text-left p-4 font-medium">Status</th><th className="text-left p-4 font-medium">Actions</th></tr></thead>
              <tbody>
                {filteredFollowUps.map((followUp) => (
                  <tr key={followUp.id} className={`border-b hover:bg-gray-50 ${isToday(followUp.scheduledDate) && followUp.status === 'pending' ? 'bg-blue-50' : ''}`}>
                    <td className="p-4"><div className="font-medium">{followUp.leadName}</div>{isToday(followUp.scheduledDate) && followUp.status === 'pending' && (<Badge variant="outline" className="text-xs mt-1 bg-blue-100 text-blue-800">Due Today</Badge>)}</td>
                    <td className="p-4"><div className="space-y-1"><div className="flex items-center gap-2">{getTypeIcon(followUp.type)}<span className="font-medium text-sm">{followUp.description}</span></div><div className="text-sm text-gray-600">{followUp.notes}</div></div></td>
                    <td className="p-4">{followUp.assignee}</td>
                    <td className="p-4"><div className="space-y-1"><div className="flex items-center gap-1 text-sm"><Calendar className="h-3 w-3" />{followUp.scheduledDate || 'N/A'}</div><div className="flex items-center gap-1 text-sm text-gray-500"><Clock className="h-3 w-3" />{followUp.scheduledTime || 'N/A'}</div></div></td>
                    <td className="p-4"><Badge className={`${getPriorityColor(followUp.priority)}`}>{followUp.priority}</Badge></td>
                    <td className="p-4"><Badge className={`${getStatusColor(followUp.status)}`}>{followUp.status}</Badge></td>
                    <td className="p-4"><div className="flex gap-2">
                      {followUp.status === 'pending' && (<Button size="sm" variant="outline" onClick={() => markAsCompleted(followUp.id)} className="text-green-600 hover:text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Complete</Button>)}
                      <Button size="sm" variant="outline" onClick={() => setSelectedFollowUp(followUp)} className="text-blue-600 hover:text-blue-700"><Eye className="h-3 w-3 mr-1" /> View</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditFollowUp(followUp)} className="text-blue-600 hover:text-blue-700"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => setHistoryFollowUp(followUp)} className="text-blue-600 hover:text-blue-700"><History className="h-3 w-3 mr-1" /> History</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteFollowUp(followUp.id)} className="text-blue-600 hover:text-blue-700"><Trash className="h-3 w-3 mr-1" /> Delete</Button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* DIALOGS */}
      <Dialog open={!!selectedFollowUp} onOpenChange={() => setSelectedFollowUp(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Lead Details</DialogTitle></DialogHeader>{selectedFollowUp && (<div className="grid grid-cols-2 gap-4 py-4"><div><Label>Lead/Company Name</Label><Input value={selectedFollowUp.leadName} readOnly /></div><div><Label>Assignee</Label><Input value={selectedFollowUp.assignee} readOnly /></div><div><Label>Type</Label><Input value={selectedFollowUp.type} readOnly /></div><div><Label>Priority</Label><Input value={selectedFollowUp.priority} readOnly /></div><div><Label>Status</Label><Input value={selectedFollowUp.status} readOnly /></div><div><Label>Scheduled Date</Label><Input value={selectedFollowUp.scheduledDate} readOnly /></div><div className="col-span-2"><Label>Description</Label><Textarea value={selectedFollowUp.description} readOnly /></div><div className="col-span-2"><Label>Notes</Label><Textarea value={selectedFollowUp.notes} readOnly /></div></div>)}</DialogContent>
      </Dialog>

      <Dialog open={!!editFollowUp} onOpenChange={() => setEditFollowUp(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Follow-up</DialogTitle></DialogHeader>{editFollowUp && (<div><div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2"><Label htmlFor="editLeadName">Lead/Company Name</Label><Input id="editLeadName" value={editFollowUp.leadName} onChange={(e) => setEditFollowUp({ ...editFollowUp, leadName: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="editAssignee">Assign to</Label><Select value={editFollowUp.assignee} onValueChange={(value) => setEditFollowUp({ ...editFollowUp, assignee: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{assignees.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select></div>

          <div className="space-y-2">
            <Label htmlFor="editStatus">Status</Label>
            <Select value={editFollowUp.status} onValueChange={(value) => setEditFollowUp({ ...editFollowUp, status: value })}>
              <SelectTrigger id="editStatus"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2"><Label htmlFor="editPriority">Priority</Label><Select value={editFollowUp.priority} onValueChange={(value) => setEditFollowUp({ ...editFollowUp, priority: value as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{priorities.map((p) => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent></Select></div>

          <div className="space-y-2"><Label htmlFor="editDescription">Description</Label><Input id="editDescription" value={editFollowUp.description} onChange={(e) => setEditFollowUp({ ...editFollowUp, description: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="editScheduledDate">Scheduled Date</Label><Input id="editScheduledDate" type="date" value={editFollowUp.scheduledDate} onChange={(e) => setEditFollowUp({ ...editFollowUp, scheduledDate: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="editScheduledTime">Scheduled Time</Label><Input id="editScheduledTime" type="time" value={editFollowUp.scheduledTime} onChange={(e) => setEditFollowUp({ ...editFollowUp, scheduledTime: e.target.value })} /></div>
          <div className="col-span-2 space-y-2"><Label htmlFor="editNotes">Notes</Label><Textarea id="editNotes" value={editFollowUp.notes} onChange={(e) => setEditFollowUp({ ...editFollowUp, notes: e.target.value })} /></div>
        </div><div className="flex justify-end gap-2 mt-4"><Button variant="outline" onClick={() => setEditFollowUp(null)}>Cancel</Button><Button onClick={handleEditFollowUp} className="bg-blue-600 hover:bg-blue-700">Save</Button></div></div>)}
        </DialogContent>
      </Dialog>

      <Dialog open={!!historyFollowUp} onOpenChange={() => setHistoryFollowUp(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Follow-up History for: {historyFollowUp?.leadName}</DialogTitle><DialogDescription>A log of all updates and changes for this lead.</DialogDescription></DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {isHistoryLoading ? (<p>Loading history...</p>)
              : historyLogs.length > 0 ? (
                <div className="space-y-6">
                  {historyLogs.map(log => (
                    <div key={log.id} className="flex gap-4">
                      <div className="flex-shrink-0"><div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center"><History className="h-5 w-5 text-gray-500" /></div></div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">{log.description}</p>
                        <p className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
                        {log.notes && (<blockquote className="mt-2 border-l-4 pl-3 py-1 text-sm text-gray-600 bg-gray-50">Notes: {log.notes}</blockquote>)}
                        <div className="mt-2 flex gap-2"><Badge className={getStatusColor(log.status)}>{log.status}</Badge><Badge className={getPriorityColor(log.priority)}>{log.priority}</Badge></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (<p>No history found for this lead.</p>)}
          </div>
          <div className="flex justify-end gap-2 mt-4"><Button variant="outline" onClick={() => setHistoryFollowUp(null)}>Close</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error('ErrorBoundary caught an error:', error, errorInfo); }
  render() { if (this.state.hasError) { return <div className="p-4 text-red-600">Something went wrong. Please try again.</div>; } return this.props.children; }
}
const FollowUpManagerWithErrorBoundary: React.FC = () => (<ErrorBoundary><FollowUpManager /></ErrorBoundary>);
export default FollowUpManagerWithErrorBoundary;