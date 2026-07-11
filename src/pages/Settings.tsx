import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

interface UserSettings {
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export default function Settings() {
  const [isDark, setIsDark] = useDarkMode();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5000,
  });

  const handleChange = (key: keyof UserSettings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  };

  return (
    <div className="settings card">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="setting-group mb-4">
        <label className="block font-semibold mb-2">Theme</label>
        <select
          value={isDark ? 'dark' : 'light'}
          onChange={(e) => setIsDark(e.target.value === 'dark')}
          className="input-field"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="setting-group mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.autoRefresh}
            onChange={(e) => handleChange('autoRefresh', e.target.checked)}
          />
          Auto-refresh match data
        </label>
      </div>
      <button onClick={handleSave} className="btn btn-primary">
        Save Settings
      </button>
    </div>
  );
}
