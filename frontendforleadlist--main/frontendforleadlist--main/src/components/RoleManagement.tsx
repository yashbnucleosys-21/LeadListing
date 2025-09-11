import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash, Users } from 'lucide-react';

// Import everything from your new API file for roles
import { Role, NewRolePayload, getRoles, addRole, updateRole, deleteRole } from '@/api/roleApi';

const RoleManagement = () => {
  // State for data, loading, and errors
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State for tracking which role is being acted upon
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [editedRoleName, setEditedRoleName] = useState('');

  // Form state for adding a new role
  const [newRole, setNewRole] = useState<NewRolePayload>({
    name: '',
  });

  // Fetch roles when the component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true); // Start loading
        const data = await getRoles();
        setRoles(data);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchRoles();
  }, []); // The empty dependency array ensures this runs only once on mount

  // Handle adding a new role
  const handleAddRole = async () => {
    if (!newRole.name) {
      alert('Please fill in the role name.');
      return;
    }
    try {
      const addedRole = await addRole(newRole);
      setRoles(prevRoles => [...prevRoles, addedRole]);
      setNewRole({ name: '' }); // Reset form
      setIsAddDialogOpen(false); // Close dialog
    } catch (apiError: any) {
      console.error("Failed to add role:", apiError);
      alert(apiError.message || "Could not add role. Please try again.");
    }
  };

  // Handle updating an existing role
  const handleUpdateRole = async () => {
    if (!roleToEdit || !editedRoleName) return;

    try {
      const updatedData = { name: editedRoleName };
      const updated = await updateRole(roleToEdit.id, updatedData);
      setRoles(prev => prev.map(role => (role.id === updated.id ? updated : role)));
      setIsEditDialogOpen(false);
      setRoleToEdit(null);
    } catch (err) {
      console.error("Error updating role:", err);
      alert('Failed to update role.');
    }
  };

  // Handle deleting a role (opens confirmation)
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete.id);
      setRoles(prev => prev.filter(role => role.id !== roleToDelete.id));
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (err) {
      console.error("Error deleting role:", err);
      alert('Failed to delete role.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <Label htmlFor="name">Role Name</Label>
              <Input id="name" value={newRole.name} onChange={(e) => setNewRole({ name: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddRole} className="bg-blue-600 hover:bg-blue-700">Add Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
            <CardTitle>Manage Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Role ID</th>
                  <th className="text-left p-4 font-medium">Role Name</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={3} className="text-center p-8 text-gray-500">Loading roles...</td></tr>
                )}
                {error && (
                   <tr><td colSpan={3} className="text-center p-8 text-red-600 font-medium">{error}</td></tr>
                )}
                {!loading && !error && roles.map((role) => (
                  <tr key={role.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm text-gray-600">{role.id}</td>
                    <td className="p-4 font-medium">{role.name}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {/* Edit Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRoleToEdit(role);
                            setEditedRoleName(role.name);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-100"
                          onClick={() => {
                            setRoleToDelete(role);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={editedRoleName}
                onChange={(e) => setEditedRoleName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateRole} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="py-4">Are you sure you want to delete the role <strong>{roleToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                No, Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteRole}
              >
                Yes, Delete
              </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;