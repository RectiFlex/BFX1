import { useState, useEffect } from 'react'
import { Save, Moon, Sun, Bell, Shield, Wallet, Globe, Mail } from 'lucide-react'

interface Settings {
  theme: 'dark' | 'light'
  notifications: {
    email: boolean
    push: boolean
    maintenance: boolean
    financial: boolean
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
  }
  wallet: {
    network: string
    autoConnect: boolean
  }
  display: {
    language: string
    dateFormat: string
    currency: string
  }
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  notifications: {
    email: true,
    push: true,
    maintenance: true,
    financial: true,
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
  },
  wallet: {
    network: 'ethereum',
    autoConnect: true,
  },
  display: {
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  },
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [savedStatus, setSavedStatus] = useState<'saved' | 'error' | null>(null)

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSavedStatus(null)
    try {
      localStorage.setItem('settings', JSON.stringify(settings))
      setSavedStatus('saved')
      setTimeout(() => setSavedStatus(null), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSavedStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="glass glass-hover px-4 py-2 flex items-center gap-2 bg-blue-500/20"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {savedStatus === 'saved' && (
        <div className="glass p-4 bg-green-500/20 text-green-400">
          Settings saved successfully
        </div>
      )}

      {savedStatus === 'error' && (
        <div className="glass p-4 bg-red-500/20 text-red-400">
          Error saving settings
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            {settings.theme === 'dark' ? (
              <Moon className="w-5 h-5 text-blue-400" />
            ) : (
              <Sun className="w-5 h-5 text-blue-400" />
            )}
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSettings(s => ({...s, theme: 'dark'}))}
                  className={`px-4 py-2 rounded-lg ${
                    settings.theme === 'dark' 
                      ? 'glass bg-blue-500/20 ring-2 ring-blue-400/30' 
                      : 'glass glass-hover'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setSettings(s => ({...s, theme: 'light'}))}
                  className={`px-4 py-2 rounded-lg ${
                    settings.theme === 'light'
                      ? 'glass bg-blue-500/20 ring-2 ring-blue-400/30'
                      : 'glass glass-hover'
                  }`}
                >
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  notifications: {...s.notifications, email: e.target.checked}
                }))}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Push Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  notifications: {...s.notifications, push: e.target.checked}
                }))}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Maintenance Alerts</label>
              <input
                type="checkbox"
                checked={settings.notifications.maintenance}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  notifications: {...s.notifications, maintenance: e.target.checked}
                }))}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Financial Updates</label>
              <input
                type="checkbox"
                checked={settings.notifications.financial}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  notifications: {...s.notifications, financial: e.target.checked}
                }))}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Two-Factor Authentication</label>
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  security: {...s.security, twoFactor: e.target.checked}
                }))}
                className="w-4 h-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  security: {...s.security, sessionTimeout: parseInt(e.target.value)}
                }))}
                className="glass p-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Wallet Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Network</label>
              <select
                value={settings.wallet.network}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  wallet: {...s.wallet, network: e.target.value}
                }))}
                className="glass p-2 w-full"
              >
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="goerli">Goerli Testnet</option>
                <option value="polygon">Polygon</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-connect</label>
              <input
                type="checkbox"
                checked={settings.wallet.autoConnect}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  wallet: {...s.wallet, autoConnect: e.target.checked}
                }))}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Display Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={settings.display.language}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  display: {...s.display, language: e.target.value}
                }))}
                className="glass p-2 w-full"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date Format</label>
              <select
                value={settings.display.dateFormat}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  display: {...s.display, dateFormat: e.target.value}
                }))}
                className="glass p-2 w-full"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={settings.display.currency}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  display: {...s.display, currency: e.target.value}
                }))}
                className="glass p-2 w-full"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Email Preferences</h2>
          </div>

          <div className="space-y-4 text-sm text-gray-400">
            <p>Configure your email notification preferences in the notifications section above.</p>
            <p>Email notifications will be sent to your registered email address.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings