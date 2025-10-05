import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/shadecn-card';
import { Label } from '@/components/common/label';
import { Switch } from '@/components/common/switch';

// Ad Settings Component
const AdSettingsSection: React.FC = () => {
  const [adSettings, setAdSettings] = useState({
    showPhone: true,
    showLocation: true
  });

  const handleToggle = (setting: 'showPhone' | 'showLocation', value: boolean) => {
    setAdSettings(prev => ({ ...prev, [setting]: value }));
    const settingName = setting === 'showPhone' ? 'phone number' : 'location';
    alert(`${settingName} visibility ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Ad Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="show-phone" className="text-sm font-medium cursor-pointer">
            Show my phone number in ad
          </Label>
          <Switch
            id="show-phone"
            checked={adSettings.showPhone}
            onCheckedChange={(checked) => handleToggle('showPhone', checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="show-location" className="text-sm font-medium cursor-pointer">
            Show my location in ad
          </Label>
          <Switch
            id="show-location"
            checked={adSettings.showLocation}
            onCheckedChange={(checked) => handleToggle('showLocation', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default AdSettingsSection;