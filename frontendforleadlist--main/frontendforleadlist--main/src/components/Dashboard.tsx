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
  name: string;
  status: string;
  priority: string;
  assignee?: string;
}

interface FollowUp {
  id: number;
  lead: string;
  time: string;
  type: string;
  assignee: string;
}

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

  // Helper: status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper: priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Get leads
        const leadsRes = await fetch("http://localhost:5000/api/leads");
        const leads: Lead[] = await leadsRes.json();

        // Calculate stats
        setStats({
          totalLeads: leads.length,
          newLeads: leads.filter((l) => l.status === "new").length,
          todayFollowUps: todayFollowUps.length, // will replace once API is ready
          activeCalls: leads.filter((l) => l.status === "contacted").length,
          conversionRate: Math.round(
            (leads.filter((l) => l.status === "qualified").length /
              Math.max(leads.length, 1)) *
              100
          ),
        });

        // Recent leads (latest 5)
        setRecentLeads(leads.slice(-5).reverse());

        // ✅ Follow-ups (mock until backend gives endpoint)
        setTodayFollowUps([
          {
            id: 1,
            lead: "Acme Corp",
            time: "10:00 AM",
            type: "Call",
            assignee: "Rahul Sharma",
          },
          {
            id: 2,
            lead: "Tech Solutions",
            time: "2:00 PM",
            type: "Email",
            assignee: "Priya Patel",
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <UserPlus className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Follow-ups
            </CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayFollowUps}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCalls}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-gray-500">
                      Assigned to: {lead.assignee || "Unassigned"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </Badge>
                    <Badge
                      className={`text-xs ${getPriorityColor(lead.priority)}`}
                    >
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
              <Calendar className="h-5 w-5" />
              Today's Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayFollowUps.map((followup) => (
                <div
                  key={followup.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{followup.lead}</div>
                    <div className="text-sm text-gray-500">
                      {followup.type} • {followup.assignee}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{followup.time}</Badge>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Done
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

