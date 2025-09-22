import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Phone,
  Mail,
  Video,
  Eye,
  Edit,
  History
} from 'lucide-react';

axios.defaults.baseURL = 'https://leadlisting.onrender.com';

interface ApiLeadResponse {
  id: number;
  leadName: string;
  companyName: string;
  email: string;
  contactPerson: string;
  phone: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost' | 'completed' | 'overdue' | 'cancelled' | 'pending';
  notes?: string;
  leadSource?: string;
  nextFollowUpDate?: string;
  followUpTime?: string;
  location?: string;
  service: string;
}

interface FollowUp {
  id: number;
  leadId: number;
  leadName: string;
  assignee: string;
  type: string;
  priority: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  notes: string;
  createdDate: string;
  completedDate?: string;
  updatedAt?: Date | null;
}

interface FollowUpHistoryItem {
  id: number;
  description: string;
  notes: string | null;
  status: string;
  priority: string;
  createdAt: string;
  leadId: number;
}

const FollowUpManager: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
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

  const tableRef = useRef<HTMLDivElement>(null);

  const [newFollowUp, setNewFollowUp] = useState<Omit<FollowUp, 'id' | 'leadId'>>({
    leadName: '',
    assignee: '',
    type: 'call',
    priority: 'medium',
    status: 'pending',
    scheduledDate: '',
    scheduledTime: '',
    description: '',
    notes: '',
    createdDate: new Date().toISOString().split('T')[0],
  });

  const assignees = ['Shruti', 'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh'];
  const types = ['call', 'email', 'meeting', 'demo'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'completed', 'overdue', 'cancelled', 'contacted', 'new', 'qualified', 'proposal', 'won', 'lost'];

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiLeadResponse[]>('/api/leads');
        const data = Array.isArray(response.data) ? response.data : [];
        if (!data.length) { setError('No leads found'); setLoading(false); return; }

        const companyList = Array.from(new Set(data.map(lead => lead.companyName).filter(Boolean)));
        setCompanies(companyList);

        const mappedFollowUps: FollowUp[] = data.map(apiLead => {
          let currentStatus = apiLead.status;
          const scheduledDate = apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : '';
          const isTaskOverdue = currentStatus === 'pending' && scheduledDate && new Date(scheduledDate) < new Date() && new Date(scheduledDate).toDateString() !== new Date().toDateString();
          if (isTaskOverdue) currentStatus = 'overdue';

          const serviceLower = apiLead.service.toLowerCase();
          let followUpType = 'call';
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
            scheduledDate,
            scheduledTime: apiLead.followUpTime ? new Date(apiLead.followUpTime).toTimeString().substring(0,5) : '',
            description: apiLead.service || '',
            notes: apiLead.notes || '',
            createdDate: apiLead.nextFollowUpDate ? new Date(apiLead.nextFollowUpDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            updatedAt: apiLead.followUpTime ? new Date(apiLead.followUpTime) : new Date()
          };
        });

        setFollowUps(mappedFollowUps);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch follow-ups. Please ensure the backend server is running.');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };
    fetchFollowUps();
  }, []);

  useEffect(() => {
    const fetchHistoryForLead = async (leadId: number) => {
      try {
        setIsHistoryLoading(true);
        setHistoryLogs([]);
        const response = await axios.get<FollowUpHistoryItem[]>(`/api/leads/${leadId}/history`);
        setHistoryLogs(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Could not load follow-up history.");
      } finally {
        setIsHistoryLoading(false);
      }
    };
    if (historyFollowUp) fetchHistoryForLead(historyFollowUp.leadId);
  }, [historyFollowUp]);

  const getStatusColor = (status: string) => ({
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    contacted: 'bg-purple-100 text-purple-800',
    qualified: 'bg-blue-100 text-blue-800',
    won: 'bg-emerald-100 text-emerald-800',
    lost: 'bg-rose-100 text-rose-800'
  }[status] || 'bg-gray-100 text-gray-800');

  const getPriorityColor = (priority: string) => ({
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-green-100 text-green-800'
  }[priority] || 'bg-gray-100 text-gray-800');

  const getTypeIcon = (type: string) => {
    switch(type){
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'demo': return <Video className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const isToday = (date: string) => date ? new Date(date).toDateString() === new Date().toDateString() : false;

  const filteredFollowUps = useMemo(() => followUps.filter(followUp => {
    const matchesSearch = (followUp.leadName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (followUp.assignee || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || followUp.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || followUp.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || followUp.assignee === filterAssignee;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  }), [followUps, searchTerm, filterStatus, filterPriority, filterAssignee]);

  const markAsCompleted = async (id: number) => {
    const followUpToUpdate = followUps.find(f => f.id === id);
    if (!followUpToUpdate) return;
    try {
      await axios.patch(`/api/leads/${followUpToUpdate.leadId}`, { status: 'completed' });
      setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } : f));
    } catch(err) {
      setError('Failed to update follow-up status.');
    }
  };

  const stats = useMemo(() => ({
    today: followUps.filter(f => isToday(f.scheduledDate) && f.status === 'pending').length,
    overdue: followUps.filter(f => f.status === 'overdue').length,
    pending: followUps.filter(f => f.status === 'pending').length,
    completedThisWeek: followUps.filter(f => {
      if (!f.completedDate) return false;
      const completedDate = new Date(f.completedDate);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return completedDate >= weekAgo;
    }).length
  }), [followUps]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-2"><Bell className="h-5 w-5 text-orange-600"/><div><p className="text-sm text-gray-500">Today's Follow-ups</p><p className="text-2xl font-bold">{stats.today}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-600"/><div><p className="text-sm text-gray-500">Overdue</p><p className="text-2xl font-bold">{stats.overdue}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><Clock className="h-5 w-5 text-blue-600"/><div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600"/><div><p className="text-sm text-gray-500">Completed (7 days)</p><p className="text-2xl font-bold">{stats.completedThisWeek}</p></div></CardContent></Card>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
            <Input placeholder="Search follow-ups..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64"/>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Status"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Priority"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {priorities.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Assignee"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {assignees.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2"/>Schedule Follow-up</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">{/* Add Dialog Form */}</DialogContent>
        </Dialog>
      </div>

      {/* FOLLOW-UP TABLE */}
      <Card>
        <CardContent className="p-0" ref={tableRef}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Lead/Company</th>
                  <th className="text-left p-4 font-medium">Type & Description</th>
                  <th className="text-left p-4 font-medium">Assignee</th>
                  <th className="text-left p-4 font-medium">Scheduled</th>
                  <th className="text-left p-4 font-medium">Priority</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFollowUps.map(followUp => (
                  <tr key={followUp.id} className={`border-b hover:bg-gray-50 ${isToday(followUp.scheduledDate) && followUp.status === 'pending' ? 'bg-blue-50' : ''}`}>
                    <td className="p-4">
                      <div className="font-medium">{followUp.leadName}</div>
                      {isToday(followUp.scheduledDate) && followUp.status === 'pending' && (
                        <Badge variant="outline" className="text-xs mt-1 bg-blue-100 text-blue-800">Due Today</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">{getTypeIcon(followUp.type)}<span className="font-medium text-sm">{followUp.description}</span></div>
                        <div className="text-sm text-gray-600">{followUp.notes}</div>
                      </div>
                    </td>
                    <td className="p-4">{followUp.assignee}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm"><Calendar className="h-3 w-3"/>{followUp.scheduledDate || 'N/A'}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500"><Clock className="h-3 w-3"/>{followUp.scheduledTime || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="p-4"><Badge className={getPriorityColor(followUp.priority)}>{followUp.priority}</Badge></td>
                    <td className="p-4"><Badge className={getStatusColor(followUp.status)}>{followUp.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {followUp.status === 'pending' && (
                          <Button size="sm" variant="outline" onClick={() => markAsCompleted(followUp.id)} className="text-green-600 hover:text-green-700"><CheckCircle className="h-3 w-3 mr-1"/> Complete</Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelectedFollowUp(followUp)} className="text-blue-600 hover:text-blue-700"><Eye className="h-3 w-3 mr-1"/> View</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditFollowUp(followUp)} className="text-blue-600 hover:text-blue-700"><Edit className="h-3 w-3 mr-1"/> Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => setHistoryFollowUp(followUp)} className="text-blue-600 hover:text-blue-700"><History className="h-3 w-3 mr-1"/> History</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUpManager;
