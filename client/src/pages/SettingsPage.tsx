import { useState } from 'react';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useUIStore } from '@/stores/uiStore';
import { User, Building, Shield, Moon, Sun, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'organization', label: 'Organization', icon: <Building className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <AnimatedPage className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="hidden md:flex flex-col gap-1 w-48 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer',
                activeTab === tab.id
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
              <div className="space-y-4 max-w-md">
                <Input id="fullname" label="Full Name" defaultValue="Rahul Sharma" />
                <Input id="email" label="Email" type="email" defaultValue="rahul@company.com" disabled />
                <Input id="phone" label="Phone" type="tel" defaultValue="+91 98765 43210" />
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Role</label>
                  <Badge variant="brand">Owner</Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Theme</label>
                  <div className="flex gap-2">
                    <Button variant={theme === 'light' ? 'primary' : 'outline'} size="sm" onClick={() => setTheme('light')}>
                      <Sun className="h-4 w-4" /> Light
                    </Button>
                    <Button variant={theme === 'dark' ? 'primary' : 'outline'} size="sm" onClick={() => setTheme('dark')}>
                      <Moon className="h-4 w-4" /> Dark
                    </Button>
                  </div>
                </div>
                <Button size="md">Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'organization' && (
            <Card>
              <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
              <div className="space-y-4 max-w-md">
                <Input id="orgname" label="Company Name" defaultValue="TechSolutions Pvt Ltd" />
                <Input id="gstin" label="GSTIN" defaultValue="29ABCDE1234F1Z5" />
                <Input id="msme" label="MSME Registration" defaultValue="UDYAM-KA-01-0012345" />
                <Button size="md">Update Organization</Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader><CardTitle>Security</CardTitle></CardHeader>
              <div className="space-y-4 max-w-md">
                <Input id="current-pass" label="Current Password" type="password" placeholder="••••••••" />
                <Input id="new-pass" label="New Password" type="password" placeholder="Min. 8 characters" />
                <Input id="confirm-pass" label="Confirm New Password" type="password" placeholder="••••••••" />
                <Button size="md">Update Password</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <div className="space-y-4">
                {['New tender matches', 'Deadline reminders', 'AI draft completions', 'Security alerts', 'Compliance warnings'].map((pref) => (
                  <div key={pref} className="flex items-center justify-between py-2">
                    <span className="text-sm text-[var(--text-primary)]">{pref}</span>
                    <input type="checkbox" defaultChecked className="accent-brand-500 w-4 h-4 cursor-pointer" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
