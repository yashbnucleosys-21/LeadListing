import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Phone, Clock, User, Calendar, Play } from 'lucide-react';

interface CallRecord {
  id: number;
  leadId: number;
  leadName: string;
  caller: string;
  callType: string;
  duration: string;
  outcome: string;
  date: string;
  time: string;
  notes: string;
  nextAction: string;
  nextFollowUp: string;
}

const CallHistory = () => {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [filterCaller, setFilterCaller] = useState('all');

  const [newCall, setNewCall] = useState({
    leadName: '',
    caller: '',
    callType: 'outbound',
    duration: '',
    outcome: '',
    notes: '',
    nextAction: '',
    nextFollowUp: ''
  });

  const callers = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh'];
  const callTypes = ['inbound', 'outbound'];
  const outcomes = ['interested', 'not-interested', 'qualified', 'follow-up', 'no-answer', 'busy', 'voicemail'];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'interested': return 'bg-green-100 text-green-800';
      case 'qualified': return 'bg-emerald-100 text-emerald-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      case 'not-interested': return 'bg-red-100 text-red-800';
      case 'no-answer': return 'bg-gray-100 text-gray-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      case 'voicemail': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCallTypeColor = (type: string) => type === 'inbound' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';

  // Fetch calls from backend
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/call-logs`);
        const data: CallRecord[] = await res.json();
        setCalls(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching call records:', error);
      }
    };
    fetchCalls();
  }, []);

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          call.caller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutcome = filterOutcome === 'all' || call.outcome === filterOutcome;
    const matchesCaller = filterCaller === 'all' || call.caller === filterCaller;
    return matchesSearch && matchesOutcome && matchesCaller;
  });

  const handleAddCall = () => {
    const call: CallRecord = {
      id: calls.length + 1,
      leadId: Math.floor(Math.random() * 100),
      ...newCall,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setCalls([call, ...calls]);
    setNewCall({ leadName: '', caller: '', callType: 'outbound', duration: '', outcome: '', notes: '', nextAction: '', nextFollowUp: '' });
    setIsAddDialogOpen(false);
  };

  const getTotalDuration = () => {
    return calls.reduce((total, call) => {
      const [minutes, seconds] = call.duration?.split(':').map(Number) || [0,0];
      return total + (minutes * 60) + seconds;
    }, 0);
  };

  const formatTotalDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Calls</p>
              <p className="text-2xl font-bold">{calls.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Duration</p>
              <p className="text-2xl font-bold">{formatTotalDuration(getTotalDuration())}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Qualified Calls</p>
              <p className="text-2xl font-bold">{calls.filter(c => c.outcome === 'qualified').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Today's Calls</p>
              <p className="text-2xl font-bold">{calls.filter(c => c.date === new Date().toISOString().split('T')[0]).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters, Actions & Table remain same */}
      {/* ...keep all your existing JSX for filters, add-dialog, and table rendering */}
      {/* Just replace calls state with fetched `calls` from backend */}
    </div>
  );
};

export default CallHistory;
