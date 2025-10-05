import React, { useState } from 'react';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Eye, EyeOff, Pencil, Lock, Check, X } from 'lucide-react';

// Billing Details Component
const BillingDetailsSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [billingData, setBillingData] = useState({
    cardNumber: '**** **** **** 1234',
    cvv: '***',
    expiryDate: '08/25',
    country: 'Kuwait',
    postalCode: '91710'
  });
  const [editData, setEditData] = useState(billingData);
  const [cardVisibility, setCardVisibility] = useState({
    number: false,
    cvv: false
  });

  const handleEdit = () => {
    setEditData(billingData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setBillingData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(billingData);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Billing & Credit Card Details</h3>
        {!isEditing ? (
          <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Card Logos */}
      <div className="flex gap-2 mb-4">
        <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
          VISA
        </div>
        <div className="w-10 h-7 bg-gradient-to-r from-red-500 to-orange-500 rounded" />
        <div className="w-10 h-7 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
          AMEX
        </div>
        <div className="w-10 h-7 bg-gray-700 rounded flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">DISCOVER</span>
        </div>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Card number</Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-900">{billingData.cardNumber}</p>
              <button
                onClick={() => setCardVisibility(prev => ({ ...prev, number: !prev.number }))}
                className="text-gray-400 hover:text-gray-600"
              >
                {cardVisibility.number ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">CVV</Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-900">{billingData.cvv}</p>
              <button
                onClick={() => setCardVisibility(prev => ({ ...prev, cvv: !prev.cvv }))}
                className="text-gray-400 hover:text-gray-600"
              >
                {cardVisibility.cvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Expiry date</Label>
            <p className="mt-1 text-sm text-gray-900">{billingData.expiryDate}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Country</Label>
            <p className="mt-1 text-sm text-gray-900">{billingData.country}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Postal code</Label>
            <p className="mt-1 text-sm text-gray-900">{billingData.postalCode}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="card-number" className="text-sm font-medium text-gray-700">Card number</Label>
            <Input
              id="card-number"
              type="text"
              value={editData.cardNumber}
              onChange={(e) => setEditData({ ...editData, cardNumber: e.target.value })}
              className="mt-1"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div>
            <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV</Label>
            <Input
              id="cvv"
              type="text"
              value={editData.cvv}
              onChange={(e) => setEditData({ ...editData, cvv: e.target.value })}
              className="mt-1"
              placeholder="123"
              maxLength={3}
            />
          </div>

          <div>
            <Label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expiry date</Label>
            <Input
              id="expiry"
              type="text"
              value={editData.expiryDate}
              onChange={(e) => setEditData({ ...editData, expiryDate: e.target.value })}
              className="mt-1"
              placeholder="MM/YY"
            />
          </div>

          <div>
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
            <Input
              id="country"
              type="text"
              value={editData.country}
              onChange={(e) => setEditData({ ...editData, country: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="postal" className="text-sm font-medium text-gray-700">Postal code</Label>
            <Input
              id="postal"
              type="text"
              value={editData.postalCode}
              onChange={(e) => setEditData({ ...editData, postalCode: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default BillingDetailsSection;