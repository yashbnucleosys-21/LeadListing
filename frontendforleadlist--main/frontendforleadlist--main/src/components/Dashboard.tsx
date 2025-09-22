import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Phone,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface Lead {
  id: number;
  companyName: string;
  status: string;
  priority: string;
  assignee?: string;
  nextFollowUpDate?: string; // "YYYY-MM-DD"
  followUpTime?: string;      // "10:00 AM"
  followUpType?: string;      // "Call" | "Email" etc.
}

interface FollowUp {
  id: number;
  lead: string;
  time: string;
  type: string;
  assignee: string;
  scheduledDate: string;
  status: string;
}

// ✅ Helper: check if date is today
const isToday = (dateStr: string) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    todayFollowUps: 0,
    activeCalls: 0,
    conversionRate: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [todayFollowUps, setTodayFollowUps] = useState<FollowUp[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "qualified": return "bg-green-100 text-green-800";
      case "proposal": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Mark follow-up as completed
  const markAsCompleted = (id: number) => {
    setTodayFollowUps(prev =>
      prev.map(f => (f.id === id ? { ...f, status: "completed" } : f))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const leadsRes = await fetch(`${apiUrl}/leads`);
        const leadsData = await leadsRes.json();
        const leads: Lead[] = Array.isArray(leadsData)
          ? leadsData
          : leadsData?.data || [];

        setRecentLeads(leads.slice(-5).reverse());

        // ✅ Filter only today's follow-ups
        const todayFUs: FollowUp[] = leads
          .filter(l => l.nextFollowUpDate && isToday(l.nextFollowUpDate))
          .map(l => ({
            id: l.id,
            lead: l.companyName,
            time: l.followUpTime || "N/A",
            type: l.followUpType || "Call",
            assignee: l.assignee || "Unassigned",
            scheduledDate: l.nextFollowUpDate!,
            status: "pending",
          }));

        setTodayFollowUps(todayFUs);

        const totalLeads = leads.length;
        const newLeads = leads.filter(l => l.status === "new").length;
        const activeCalls = leads.filter(l => l.status === "contacted").length;
        const conversionRate = Math.round(
          (leads.filter(l => l.status === "qualified").length / Math.max(totalLeads, 1)) * 100
        );

        setStats({
          totalLeads,
          newLeads,
          todayFollowUps: todayFUs.length,
          activeCalls,
          conversionRate,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <UserPlus className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Follow-ups</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayFollowUps}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCalls}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads & Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{lead.companyName}</div>
                    <div className="text-sm text-gray-500">
                      Assigned to: {lead.assignee || "Unassigned"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(lead.priority)}`}>
                      {lead.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Today's Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayFollowUps.map((f) => (
                <div key={f.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{f.lead}</div>
                    <div className="text-sm text-gray-500">{f.type} • {f.assignee}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline">{f.time}</Badge>
                    <Button size="sm" variant="outline" onClick={() => markAsCompleted(f.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Mark Done
                    </Button>
                  </div>
                </div>
              ))}
              {todayFollowUps.length === 0 && (
                <p className="text-gray-500 text-sm">No follow-ups for today.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
