import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash, Users } from 'lucide-react';
import { Role, NewRolePayload, getRoles, addRole, updateRole, deleteRole } from '@/api/roleApi';

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [editedRoleName, setEditedRoleName] = useState('');
  const [newRole, setNewRole] = useState<NewRolePayload>({ name: '' });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const data = await getRoles();
        setRoles(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (!newRole.name.trim()) return alert('Please fill in the role name.');
    try {
      const addedRole = await addRole(newRole);
      setRoles(prev => [...prev, addedRole]);
      setNewRole({ name: '' });
      setIsAddDialogOpen(false);
    } catch (apiError: any) {
      alert(apiError.message || "Could not add role.");
    }
  };

  const handleUpdateRole = async () => {
    if (!roleToEdit || !editedRoleName.trim()) return;
    try {
      const updated = await updateRole(roleToEdit.id, { name: editedRoleName });
      setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
      setIsEditDialogOpen(false);
      setRoleToEdit(null);
    } catch (err) {
      alert('Failed to update role.');
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete.id);
      setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (err) {
      alert('Failed to delete role.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-5 flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Roles</p>
              <p className="text-2xl font-semibold">{roles.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Action */}
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                placeholder="Enter role name"
                value={newRole.name}
                onChange={(e) => setNewRole({ name: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddRole}>Add Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Manage Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Role Name</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={3} className="text-center p-8 text-gray-500">Loading roles...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={3} className="text-center p-8 text-red-600 font-medium">{error}</td>
                  </tr>
                )}
                {!loading && !error && roles.map((role) => (
                  <tr key={role.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4 font-mono text-sm text-gray-600">{role.id}</td>
                    <td className="p-4 font-medium">{role.name}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-gray-100 transition"
                          onClick={() => { setRoleToEdit(role); setEditedRoleName(role.name); setIsEditDialogOpen(true); }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-100 transition"
                          onClick={() => { setRoleToDelete(role); setIsDeleteDialogOpen(true); }}
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
          <div className="space-y-4 mt-4">
            <Label htmlFor="edit-name">Role Name</Label>
            <Input
              id="edit-name"
              value={editedRoleName}
              onChange={(e) => setEditedRoleName(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateRole}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-700">
            Are you sure you want to delete <strong>{roleToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteRole}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
