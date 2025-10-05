import React, { useState } from 'react';


const MembershipTypeSection: React.FC = () => {
  const [membershipType, setMembershipType] = useState<'monthly' | 'annual'>('annual');

  const handleMembershipChange = (type: 'monthly' | 'annual') => {
    setMembershipType(type);
    alert(`Membership changed to ${type === 'monthly' ? 'Monthly' : 'Annual'} plan`);
  };

  return (
    <div className="pt-6 border-t">
      <h3 className="text-base font-semibold mb-2">Membership Type</h3>
      <p className="text-sm text-gray-600 mb-4">
        Detailed breakdown of all ads posted at Profile {'>'} Billing Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleMembershipChange('monthly')}
          className={`p-4 rounded-lg border-2 transition-all ${
            membershipType === 'monthly'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-left">
            <p className="font-semibold text-gray-900">Pay Monthly</p>
            <p className="text-sm text-gray-600">$20 / Month</p>
          </div>
        </button>

        <button
          onClick={() => handleMembershipChange('annual')}
          className={`p-4 rounded-lg border-2 transition-all relative ${
            membershipType === 'annual'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            Current
          </span>
          <div className="text-left">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Pay Annually</p>
              <span className="text-xs font-semibold text-purple-600">Save 20%</span>
            </div>
            <p className="text-sm text-gray-600">$18 / Month</p>
          </div>
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        * Rates may be subject to change or revision.
      </p>
    </div>
  );
};
export default MembershipTypeSection;