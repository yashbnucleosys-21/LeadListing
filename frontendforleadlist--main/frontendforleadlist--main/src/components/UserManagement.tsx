import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Mail, Phone, Shield, Users, Trash, Eye } from 'lucide-react';
import { updateUser as apiUpdateUser } from '@/api/userApi';

// Import everything from your new API file
import { User, NewUserPayload, getUsers, addUser, deleteUser } from '@/api/userApi';
import { Role, getRoles } from '@/api/roleApi'; // Import roles API
import { on } from 'events';

const UserManagement = () => {
  // State for data, loading, and errors
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]); // State for roles
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
const [onClose, setOnClose] = useState<() => void>(() => () => {});
  // UI State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Form state for adding a new user
  const [newUser, setNewUser] = useState<NewUserPayload>({
    name: '',
    email: '',
    password: '', // Added password field
    phone: '',
    role: '',
    department: 'Sales',
    status: 'active'
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, roleData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(userData);
      setRoles(roleData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users and roles when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, roleData] = await Promise.all([getUsers(), getRoles()]);
        setUsers(userData);
        setRoles(roleData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once on mount

  const departments = ['Sales', 'Marketing', 'Support', 'Admin'];
  const statuses = ['active', 'inactive', 'on-leave'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Sales Manager': return 'bg-blue-100 text-blue-800';
      case 'Team Lead': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // // Updated to be async and call the API
  // const handleAddUser = async () => {
  //   if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
  //     alert('Please fill in required fields: Name, Email, and Role.');
  //     return;
  //   }
  //   try {
  //     const addedUser = await addUser(newUser);
  //     setUsers(prevUsers => [...prevUsers, addedUser]);
  //     setNewUser({
  //       name: '',
  //       email: '',
  //       phone: '',
  //        password: '',
  //       role: '',
  //       department: 'Sales',
  //       status: 'active'
  //     });
  //     setSelectedUser(addedUser);
  //     setUpdateMessage('User added successfully.');
  //    setOnClose(() => {
  //       return () => {
  //         setIsAddDialogOpen(false);
  //       setSelectedUser(addedUser);
  //     setUpdateMessage('User added successfully.');  
  //       } 
  //     });
  //   } catch (apiError: any) {
  //     console.error("Failed to add user:", apiError);
  //     alert(apiError.message || "Could not add user. Please try again.");
  //   }
  // };

  // const handleUpdateUser = async () => {
  //   if (!selectedUser) return;

  //   try {
  //     const updatedUser = await apiUpdateUser(selectedUser.id, {
  //       email: editedEmail,
  //       phone: editedPhone
  //     });

  //     setUsers(prevUsers =>
  //       prevUsers.map(user =>
  //         user.id === selectedUser.id ? updatedUser : user
  //       )
  //     );

  //     setSelectedUser(updatedUser);
  //     setIsEditingEmail(false);
  //     setIsEditingPhone(false);
  //     setUpdateMessage('User updated successfully.');
  //     setTimeout(() => setUpdateMessage(''), 3000);
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //     alert('Failed to update user.');
  //   }
  // };

  // const handleDeleteUser = async (id: number) => {
  //   if (!window.confirm('Are you sure you want to delete this user?')) return;

  //   try {
  //     await deleteUser(id);
  //     setUsers(prev => prev.filter(user => user.id !== id));
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //     alert('Failed to delete user.');
  //   }
  // };
    const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      alert('Please fill in required fields: Name, Email, Role, and Password.');
      return;
    }
    try {
      // 1. Call the API to add the user
      await addUser(newUser);
      
      // 2. Close the dialog and reset the form
      setIsAddDialogOpen(false);
      setNewUser({
        name: '', email: '', password: '', phone: '', role: '', department: 'Sales', status: 'active'
      });

      // 3. REFETCH the entire user list to show the new user correctly
      await fetchData();

    } catch (apiError: any) {
      console.error("Failed to add user:", apiError);
      if (apiError.response?.status === 409) {
        alert(apiError.response.data.message || 'This email is already in use.');
      } else {
        alert(apiError.message || "Could not add user. Please try again.");
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const updatedUser = await apiUpdateUser(selectedUser.id, {
        email: editedEmail,
        phone: editedPhone
      });
      // After updating, refetch to ensure data consistency
      await fetchData();
      setSelectedUser(null); // Close the dialog
      setUpdateMessage('User updated successfully.');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
    }
  };

  // ✅ FIX #3: The delete handler also refetches data.
  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      // Refetch the list to show that the user has been removed
      await fetchData();
      setIsDeleteDialogOpen(false); // Close the confirmation dialog
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Team Leads</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'Team Lead').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Sales Executives</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role.includes('Sales Executive')).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
              </div>
                 <div className="col-span-2 space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter a strong password"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map(status => (<SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Department</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Performance</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} className="text-center p-8 text-gray-500">Loading users...</td></tr>
                )}
                {error && (
                   <tr><td colSpan={7} className="text-center p-8 text-red-600 font-medium">{error}</td></tr>
                )}
                {!loading && !error && filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                         <div className="text-sm text-gray-500">
                         Joined: {new Date(user.joinDate).toISOString().split('T')[0]}
                         </div>

                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" />{user.email}</div>
                        <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" />{user.phone}</div>
                      </div>
                    </td>
                    <td className="p-4"><Badge className={`${getRoleColor(user.role)}`}>{user.role}</Badge></td>
                    <td className="p-4">{user.department}</td>
                    <td className="p-4"><Badge className={`${getStatusColor(user.status)}`}>{user.status}</Badge></td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm"><span className="font-medium">{user.leadsAssigned}</span> leads assigned</div>
                        <div className="text-sm"><span className="font-medium text-green-600">{user.leadsConverted}</span> converted</div>
                        <div className="text-xs text-gray-500">
                          {user.leadsAssigned > 0 ? Math.round((user.leadsConverted / user.leadsAssigned) * 100) : 0}% conversion rate
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                         {/* Edit Icon */}
                        <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setEditedEmail(user.email);
                                  setEditedPhone(user.phone);
                                  setIsEditingEmail(false);
                                  setIsEditingPhone(false);
                                  setIsViewOnly(false);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>

                               {/* View Icon */}
                                <Button
                                   size="sm"
                                   variant="outline"
                                  className="text-gray-600 hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsViewOnly(true); // view-only mode

                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                              {/* Delete Icon */}
                               <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-100"
                                onClick={() => {
                                  setUserToDelete(user); // Set user to delete
                                  setIsDeleteDialogOpen(true); // Open dialog
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

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                No, Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  if (!userToDelete) return;
                  try {
                    await deleteUser(userToDelete.id);
                    setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
                    setUserToDelete(null);
                    setIsDeleteDialogOpen(false);
                  } catch (err) {
                    console.error("Error deleting user:", err);
                    alert('Failed to delete user.');
                  }
                }}
              >
                Yes, Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

          </div>
        </CardContent>
      </Card>

      {selectedUser && (
  <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {isViewOnly ? `Viewing User - ${selectedUser.name}` : `User Details - ${selectedUser.name}`}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
            {selectedUser.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
            <p className="text-gray-600">{selectedUser.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left side */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <div className="flex items-center gap-2">
                {isEditingEmail && !isViewOnly ? (
                  <Input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : (
                  <p>{selectedUser.email}</p>
                )}
                {!isViewOnly && (
                  <Edit
                    className="w-4 h-4 cursor-pointer text-gray-500"
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                  />
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label className="text-sm font-medium text-gray-500">Phone</Label>
              <div className="flex items-center gap-2">
                {isEditingPhone && !isViewOnly ? (
                  <Input
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                  />
                ) : (
                  <p>{selectedUser.phone}</p>
                )}
                {!isViewOnly && (
                  <Edit
                    className="w-4 h-4 cursor-pointer text-gray-500"
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                  />
                )}
              </div>
            </div>

            {/* Department */}
            <div>
              <Label className="text-sm font-medium text-gray-500">Department</Label>
              <p>{selectedUser.department}</p>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <div className="mt-1">
                <Badge className={`${getStatusColor(selectedUser.status)}`}>
                  {selectedUser.status}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Join Date</Label>
              <p>{new Date(selectedUser.joinDate).toISOString().slice(0, 10)}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Role</Label>
              <div className="mt-1">
                <Badge className={`${getRoleColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Performance Metrics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{selectedUser.leadsAssigned}</p>
              <p className="text-sm text-gray-500">Leads Assigned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{selectedUser.leadsConverted}</p>
              <p className="text-sm text-gray-500">Leads Converted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {selectedUser.leadsAssigned > 0
                  ? Math.round((selectedUser.leadsConverted / selectedUser.leadsAssigned) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-500">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Footer */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
        {!isViewOnly && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleUpdateUser}
          >
            Update
          </Button>
        )}
      </div>

      {updateMessage && (
        <p className="text-green-600 text-sm mt-2 text-right pr-2">
          {updateMessage}
        </p>
      )}
    </DialogContent>
  </Dialog>
)}
    </div>
  );
};

export default UserManagement;


