import React, { useState } from 'react';

interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5000,
  });

  const handleChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="setting-group">
        <label>Theme</label>
        <select value={settings.theme} onChange={e => handleChange('theme', e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
}
