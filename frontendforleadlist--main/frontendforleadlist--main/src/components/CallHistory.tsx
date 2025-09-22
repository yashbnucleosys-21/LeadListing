import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  leadId?: number;
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
  const [callers, setCallers] = useState<string[]>([]);
  const [callTypes, setCallTypes] = useState<string[]>([]);
  const [outcomes, setOutcomes] = useState<string[]>([]);

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

  // Fetch calls and metadata dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callsRes, callersRes, typesRes, outcomesRes] = await Promise.all([
          fetch('/api/calls'),
          fetch('/api/callers'),
          fetch('/api/call-types'),
          fetch('/api/call-outcomes')
        ]);
        setCalls(await callsRes.json());
        setCallers(await callersRes.json());
        setCallTypes(await typesRes.json());
        setOutcomes(await outcomesRes.json());
      } catch (err) {
        console.error('Failed to fetch call data', err);
      }
    };
    fetchData();
  }, []);

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

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          call.caller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutcome = filterOutcome === 'all' || call.outcome === filterOutcome;
    const matchesCaller = filterCaller === 'all' || call.caller === filterCaller;
    return matchesSearch && matchesOutcome && matchesCaller;
  });

  const handleAddCall = async () => {
    try {
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCall)
      });
      const createdCall = await res.json();
      setCalls(prev => [createdCall, ...prev]);
      setNewCall({
        leadName: '',
        caller: '',
        callType: 'outbound',
        duration: '',
        outcome: '',
        notes: '',
        nextAction: '',
        nextFollowUp: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Failed to add call', err);
    }
  };

  const getTotalDuration = () => {
    return calls.reduce((total, call) => {
      const [minutes, seconds] = call.duration.split(':').map(Number);
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

      {/* Filters & Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterOutcome} onValueChange={setFilterOutcome}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              {outcomes.map(outcome => (
                <SelectItem key={outcome} value={outcome}>{outcome.replace('-', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCaller} onValueChange={setFilterCaller}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by caller" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Callers</SelectItem>
              {callers.map(caller => (
                <SelectItem key={caller} value={caller}>{caller}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Call Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Call Record</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lead/Company Name</Label>
                <Input value={newCall.leadName} onChange={e => setNewCall({...newCall, leadName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Caller</Label>
                <Select value={newCall.caller} onValueChange={value => setNewCall({...newCall, caller: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select caller" />
                  </SelectTrigger>
                  <SelectContent>
                    {callers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Call Type</Label>
                <Select value={newCall.callType} onValueChange={value => setNewCall({...newCall, callType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {callTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (mm:ss)</Label>
                <Input value={newCall.duration} onChange={e => setNewCall({...newCall, duration: e.target.value})} placeholder="15:30" />
              </div>
              <div className="space-y-2">
                <Label>Call Outcome</Label>
                <Select value={newCall.outcome} onValueChange={value => setNewCall({...newCall, outcome: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    {outcomes.map(o => <SelectItem key={o} value={o}>{o.replace('-', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Next Follow-up Date</Label>
                <Input type="date" value={newCall.nextFollowUp} onChange={e => setNewCall({...newCall, nextFollowUp: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Call Notes</Label>
                <Textarea rows={3} value={newCall.notes} onChange={e => setNewCall({...newCall, notes: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Next Action</Label>
                <Input value={newCall.nextAction} onChange={e => setNewCall({...newCall, nextAction: e.target.value})} placeholder="e.g., Send proposal" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCall} className="bg-blue-600 hover:bg-blue-700">Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Call Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Lead/Company</th>
                  <th className="text-left p-4 font-medium">Caller</th>
                  <th className="text-left p-4 font-medium">Type & Duration</th>
                  <th className="text-left p-4 font-medium">Outcome</th>
                  <th className="text-left p-4 font-medium">Date & Time</th>
                  <th className="text-left p-4 font-medium">Next Follow-up</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map(call => (
                  <tr key={call.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{call.leadName}</td>
                    <td className="p-4 flex items-center gap-2"><User className="h-4 w-4 text-gray-400" />{call.caller}</td>
                    <td className="p-4 space-y-1">
                      <Badge className={getCallTypeColor(call.callType)}>{call.callType}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500"><Clock className="h-3 w-3" />{call.duration}</div>
                    </td>
                    <td className="p-4"><Badge className={getOutcomeColor(call.outcome)}>{call.outcome.replace('-', ' ')}</Badge></td>
                    <td className="p-4 space-y-1"><div className="font-medium text-sm">{call.date}</div><div className="text-sm text-gray-500">{call.time}</div></td>
                    <td className="p-4">{call.nextFollowUp ? <div className="flex items-center gap-1 text-sm"><Calendar className="h-3 w-3 text-orange-500" />{call.nextFollowUp}</div> : <span className="text-gray-400">-</span>}</td>
                    <td className="p-4 flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Follow-up</Button>
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

export default CallHistory;
