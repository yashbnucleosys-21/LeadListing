import * as LeadServices from '../services/lead.service.js';

// Create a new Lead
export const createLead = async (req, res) => {
  try {
    const leadData = req.body;

    if (!leadData.companyName || !leadData.email) {
      return res.status(400).json({ message: 'companyName and email are required' });
    }

    const newLead = await LeadServices.createLead(leadData);
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating Lead:', error);
    res.status(500).json({ message: 'Server error while creating Lead' });
  }
};

// Get All Leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await LeadServices.getAllLeads();
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Server error while fetching leads' });
  }
};

// Update a Lead
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const leadData = req.body;
    const updated = await LeadServices.updateLead(Number(id), leadData);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Failed to update lead' });
  }
};

// Delete a Lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    await LeadServices.deleteLead(Number(id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Failed to delete lead' });
  }
};

// Get Lead by ID (Optional)
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await LeadServices.getLeadById(Number(id));
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Failed to fetch lead' });
  }
};
