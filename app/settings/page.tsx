/**
 * SETTINGS PAGE
 * User settings and preferences
 */

'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { User, Globe, Trash2, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { user, theme, toggleTheme } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState('English');

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. You will be logged out.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <h1 className="section-title mb-16">Settings</h1>

        {/* Profile Settings */}
        <Card className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            {theme === 'dark' ? (
              <Moon className="w-6 h-6 text-[var(--accent-blue)]" />
            ) : (
              <Sun className="w-6 h-6 text-[var(--accent-primary)]" />
            )}
            <h2 className="text-xl font-bold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">Theme</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Currently using {theme} mode
              </p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              Toggle Theme
            </Button>
          </div>
        </Card>

        {/* Language */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-[var(--accent-blue)]" />
            <h2 className="text-xl font-bold">Language & Region</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Language
              </label>
              <select
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-primary)]"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Saved Places */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Saved Places</h2>
          <div className="space-y-3">
            {['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia'].map((place) => (
              <div
                key={place}
                className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] rounded-lg"
              >
                <span>{place}</span>
                <button className="text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-2 border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/10"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
}
