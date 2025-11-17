import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/shadecn-card";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Pencil, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateProfile } from "@/features/slicer/AuthSlice";

const AccountDetailsSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const [accountData, setAccountData] = useState({
    email: user?.email,
    fullName: user?.fullName,
    phone: user?.phone,
  });

  const [editData, setEditData] = useState(accountData);
  const [isChanged, setIsChanged] = useState(false);

  // ✅ Detect if user has made any changes
  useEffect(() => {
    const hasChanged =
      editData.email !== accountData.email ||
      editData.fullName !== accountData.fullName ||
      editData.phone !== accountData.phone;

    setIsChanged(hasChanged);
  }, [editData, accountData]);

  const handleEdit = () => {
    setEditData(accountData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!isChanged) return;
    setAccountData(editData);
    try {
      const res = await dispatch(UpdateProfile(editData) as any).unwrap();
      console.log(res, "res");
    } catch (error) {
      console.log(error);
    }
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
            Edit details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>

            {/* ✅ Save button enabled only if any field changed */}
            <Button
              size="sm"
              disabled={!isChanged}
              className={`gap-2 ${
                isChanged
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleSave}
            >
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
              <p className="mt-1 text-sm text-gray-900">
                {accountData.fullName}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <p className="mt-1 text-sm text-gray-900">{accountData.phone}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={editData.fullName}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
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
