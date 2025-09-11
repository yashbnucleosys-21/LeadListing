import prisma from '../prisma.js';
import { createFollowUpHistory } from './followUpHistory.service.js';
// export const createLead = async (leadData) => {
//   let combinedDateTime = null;

//   if (leadData.nextFollowUpDate && leadData.followUpTime) {
//     const [hours, minutes] = leadData.followUpTime.split(':');
//     const date = new Date(leadData.nextFollowUpDate);
//     date.setHours(parseInt(hours), parseInt(minutes));
//     combinedDateTime = date.toISOString();
//   }

//   const newLead = await prisma.lead.create({
//     data: {
//       leadName: leadData.leadName || "",
//       companyName: leadData.companyName,
//       email: leadData.email,
//       contactPerson: leadData.contactPerson,
//       phone: leadData.phone,
//       assignee: leadData.assignee,
//       priority: leadData.priority,
//       status: leadData.status,
//       leadSource: leadData.leadSource || "",
//       notes: leadData.notes,
//       nextFollowUpDate: leadData.nextFollowUpDate
//         ? new Date(leadData.nextFollowUpDate)
//         : null,
//       followUpTime: combinedDateTime,
//       service: leadData.service,
//       location: leadData.location,
//     },
//   });

//   return newLead;
// };
export const createLead = async (leadData) => {
  let combinedDateTime = null;
  if (leadData.nextFollowUpDate && leadData.followUpTime) {
    const [hours, minutes] = leadData.followUpTime.split(':');
    const date = new Date(leadData.nextFollowUpDate);
    date.setHours(parseInt(hours), parseInt(minutes));
    combinedDateTime = date.toISOString();
  }

  // First, create the new lead as before
  const newLead = await prisma.lead.create({
    data: {
      leadName: leadData.leadName || "",
      companyName: leadData.companyName,
      email: leadData.email,
      contactPerson: leadData.contactPerson,
      phone: leadData.phone,
      assignee: leadData.assignee,
      priority: leadData.priority,
      status: leadData.status,
      leadSource: leadData.leadSource || "",
      notes: leadData.notes,
      nextFollowUpDate: leadData.nextFollowUpDate ? new Date(leadData.nextFollowUpDate) : null,
      followUpTime: combinedDateTime,
      service: leadData.service,
      location: leadData.location,
    },
  });

  // ✅ 2. After the lead is created, create its FIRST history log
  if (newLead) {
    // Create a specific description for the creation event
    const creationHistoryData = {
      ...leadData,
      description: `Lead created with status: ${leadData.status}. Assigned to: ${leadData.assignee}.`
    };
    await createFollowUpHistory(newLead.id, creationHistoryData);
  }

  // Finally, return the created lead as before
  return newLead;
};

export const getAllLeads = async () => {
  return prisma.lead.findMany({
    orderBy: { id: 'desc' },
  });
};

// export const updateLead = async (id, leadData) => {
//   let combinedDateTime = null;

//   if (leadData.nextFollowUpDate && leadData.followUpTime) {
//     const [hours, minutes] = leadData.followUpTime.split(':');
//     const date = new Date(leadData.nextFollowUpDate);
//     date.setHours(parseInt(hours), parseInt(minutes));
//     combinedDateTime = date.toISOString();
//   }

//   return await prisma.lead.update({
//     where: { id },
//     data: {
//   leadName: leadData.leadName || "",
//   companyName: leadData.companyName,
//   email: leadData.email,
//   contactPerson: leadData.contactPerson,
//   phone: leadData.phone,
//   assignee: leadData.assignee,
//   priority: leadData.priority,
//   status: leadData.status,
//   leadSource: leadData.leadSource || "",
//   notes: leadData.notes,
//   nextFollowUpDate: leadData.nextFollowUpDate
//     ? new Date(leadData.nextFollowUpDate)
//     : null,
//   followUpTime: combinedDateTime,
//   service: leadData.service,
//    location: leadData.location,
// },
//   });
// };
export const updateLead = async (id, leadData) => {
  let combinedDateTime = null;
  if (leadData.nextFollowUpDate && leadData.followUpTime) {
    const [hours, minutes] = leadData.followUpTime.split(':');
    const date = new Date(leadData.nextFollowUpDate);
    date.setHours(parseInt(hours), parseInt(minutes));
    combinedDateTime = date.toISOString();
  }

  // First, update the lead as usual
  const updatedLead = await prisma.lead.update({
    where: { id },
    data: {
      leadName: leadData.leadName,
      companyName: leadData.companyName,
      email: leadData.email,
      contactPerson: leadData.contactPerson,
      phone: leadData.phone,
      assignee: leadData.assignee,
      priority: leadData.priority,
      status: leadData.status,
      leadSource: leadData.leadSource,
      notes: leadData.notes,
      nextFollowUpDate: leadData.nextFollowUpDate
        ? new Date(leadData.nextFollowUpDate)
        : null,
      followUpTime: combinedDateTime,
      service: leadData.service,
      location: leadData.location,
    },
  });

  // ✅ 3. After the lead is successfully updated, create a history log
  if (updatedLead) {
    // We pass the lead's ID and the data that was used for the update
    await createFollowUpHistory(id, leadData);
  }

  return updatedLead;
};