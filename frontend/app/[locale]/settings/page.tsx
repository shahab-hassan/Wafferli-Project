'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/shadecn-card';
import AccountDetailsSection from '@/components/settings/account-detail';
import { ChangePasswordSection } from '@/components/settings/change-password';
import BillingDetailsSection from '@/components/settings/billing-detail';
import MembershipTypeSection from '@/components/settings/membership-type';
import AdSettingsSection from '@/components/settings/ad-setting';
import { useRole } from '@/contexts/roleContext'; // import role context

// Main Settings Page
const SettingsPage: React.FC = () => {
  const { role } = useRole(); // get current role

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Account Details with embedded Change Password */}
        <div className="space-y-6">
          <AccountDetailsSection />
          <ChangePasswordSection />
        </div>

        {/* Seller-only sections */}
        {role === "seller" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Seller Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <BillingDetailsSection />
                <MembershipTypeSection />
              </CardContent>
            </Card>

            {/* Ad Settings */}
            <AdSettingsSection />
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
