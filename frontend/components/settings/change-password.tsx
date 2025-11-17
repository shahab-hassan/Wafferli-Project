import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/shadecn-card";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Eye, EyeOff, Pencil, Lock, Check, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { ChangePassword } from "@/features/slicer/AuthSlice";

const ChangePasswordSection: React.FC = () => {
  const [isLoading, setIsloading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();

  const [errors, setErrors] = useState<string[]>([]);

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors([]);
  };

  const handleChangePassword = async () => {
    const newErrors: string[] = [];

    if (!formData.currentPassword) {
      newErrors.push("Current password is required");
    }
    if (!formData.newPassword) {
      newErrors.push("New password is required");
    }
    if (formData.newPassword.length < 8) {
      newErrors.push("New password must be at least 8 characters");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.push("New passwords do not match");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const obj = {
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };
    try {
      setIsloading(true);
      await dispatch(ChangePassword(obj) as any);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error);
      setIsloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}

        <div className="relative">
          <Label htmlFor="current-password" className="text-sm font-medium">
            Current Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="current-password"
              type={passwordVisibility.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
              className="pl-10 pr-10"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {passwordVisibility.current ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="new-password" className="text-sm font-medium">
            New Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="new-password"
              type={passwordVisibility.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              className="pl-10 pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {passwordVisibility.new ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm New Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirm-password"
              type={passwordVisibility.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              className="pl-10 pr-10"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {passwordVisibility.confirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          onClick={handleChangePassword}
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white"
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
};
export { ChangePasswordSection };
