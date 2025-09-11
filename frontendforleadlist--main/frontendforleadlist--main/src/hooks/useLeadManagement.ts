
import { useState } from 'react';
import { Lead } from '@/types/Lead';
import { useToast } from '@/hooks/use-toast';

export const useLeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      companyName: 'Acme Corp',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '+91 98765 43210',
      status: 'new',
      priority: 'high',
      assignee: 'Rahul Sharma',
      createdDate: '2024-01-15',
      lastContact: '2024-01-16',
      nextFollowUp: '2024-01-18',
      notes: 'Interested in cloud migration services'
    },
    {
      id: 2,
      companyName: 'Tech Solutions',
      contactPerson: 'Jane Smith',
      email: 'jane@techsol.com',
      phone: '+91 87654 32109',
      status: 'contacted',
      priority: 'medium',
      assignee: 'Priya Patel',
      createdDate: '2024-01-14',
      lastContact: '2024-01-17',
      nextFollowUp: '2024-01-20',
      notes: 'Needs custom software development'
    },
    {
      id: 3,
      companyName: 'Digital Dynamics',
      contactPerson: 'Mike Johnson',
      email: 'mike@digitald.com',
      phone: '+91 76543 21098',
      status: 'qualified',
      priority: 'high',
      assignee: 'Amit Kumar',
      createdDate: '2024-01-12',
      lastContact: '2024-01-17',
      nextFollowUp: '2024-01-19',
      notes: 'Ready for proposal, budget confirmed'
    }
  ]);

  const { toast } = useToast();

  const addLead = (leadData: any) => {
    const lead: Lead = {
      id: leads.length + 1,
      ...leadData,
      createdDate: new Date().toISOString().split('T')[0],
      lastContact: '',
      nextFollowUp: ''
    };
    setLeads([...leads, lead]);
    toast({
      title: "Lead Added",
      description: "New lead has been successfully added.",
    });
  };

  const updateLead = (updatedLead: Lead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    toast({
      title: "Lead Updated",
      description: "Lead information has been successfully updated.",
    });
  };

  const callLead = (lead: Lead) => {
    const updatedLeads = leads.map(l => 
      l.id === lead.id 
        ? { ...l, lastContact: new Date().toISOString().split('T')[0] }
        : l
    );
    setLeads(updatedLeads);
    
    toast({
      title: "Call Initiated",
      description: `Calling ${lead.contactPerson} at ${lead.phone}`,
    });
    
    console.log(`Initiating call to ${lead.phone}`);
  };

  return {
    leads,
    addLead,
    updateLead,
    callLead
  };
};
