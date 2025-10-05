import React ,{ useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/shadecn-card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Pencil, Check, X } from 'lucide-react';

const AccountDetailsSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountData, setAccountData] = useState({
    email: '123test@gmail.com',
    name: 'David the goat',
    phone: '+965 123456'
  });
  const [editData, setEditData] = useState(accountData);

  const handleEdit = () => {
    setEditData(accountData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setAccountData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(accountData);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Account details</CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
            Edit details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleCancel}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={handleSave}>
              <Check className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
        </div>
        
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <p className="mt-1 text-sm text-gray-900">{accountData.email}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Name</Label>
              <p className="mt-1 text-sm text-gray-900">{accountData.name}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
              <p className="mt-1 text-sm text-gray-900">{accountData.phone}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default AccountDetailsSection;