import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lead } from '@/types/Lead';

interface CallDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const CallDialog = ({ lead, isOpen, onClose }: CallDialogProps) => {
  const [description, setDescription] = useState('');

  // Reset description when dialog opens/closes or lead changes
  useEffect(() => {
    if (isOpen) {
      setDescription('');
    }
  }, [isOpen, lead]);

 const handleSubmit = async () => {
  if (!description.trim()) {
    toast.error('Please enter a call description');
    return;
  }

  if (!lead) {
    toast.error('No lead selected');
    return;
  }

  try {
    await axios.post('http://localhost:5000/api/call-logs', {
      leadId: lead.id,
      name: lead.contactPerson,
      email: lead.email,
      phone: lead.phone,
      description:"...",
    });

    toast.success('Call log saved');
    onClose();
  } catch (error) {
    toast.error('Failed to save call log');
    console.error(error);
  }
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Call Description</DialogTitle>
        </DialogHeader>

        {lead ? (
          <div className="space-y-4">
            <p><strong>Name:</strong> {lead.contactPerson}</p>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>Phone:</strong> {lead.phone}</p>

            <Textarea
              placeholder="Enter call description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </div>
        ) : (
          <p>No lead data available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
