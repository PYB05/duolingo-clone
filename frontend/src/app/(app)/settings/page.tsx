'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { sfx } from '@/lib/sfx';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => api.getMe() });
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const [displayName, setDisplayName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(20);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [listeningEnabled, setListeningEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || user.username);
      setDailyGoal(user.daily_goal_xp || 20);
    }
  }, [user]);

  useEffect(() => {
    if (settings) {
      setSoundEnabled(settings.sound_effects);
      setAnimationsEnabled(settings.animations);
      setListeningEnabled(settings.listening_exercises);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async () => {
      await api.updateMe({
        display_name: displayName,
        daily_goal_xp: dailyGoal,
      });
      await api.updateSettings({
        sound_effects: soundEnabled,
        animations: animationsEnabled,
        listening_exercises: listeningEnabled,
      });
    },
    onSuccess: () => {
      sfx.play('correct');
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err: any) => {
      sfx.play('wrong');
      alert(err.message || 'Could not save settings.');
    },
  });

  const goalOptions = [
    { label: 'Casual', xp: 10, time: '3 min / day' },
    { label: 'Regular', xp: 20, time: '7 min / day' },
    { label: 'Serious', xp: 30, time: '12 min / day' },
    { label: 'Intense', xp: 50, time: '20 min / day' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 select-none pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black duo-text-primary mb-1">Preferences & Settings</h1>
        <p className="duo-text-secondary font-bold text-sm">
          Customize your learning experience, daily targets, and display theme.
        </p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-feather/15 border-2 border-feather text-feather font-extrabold flex items-center justify-between animate-fade-in">
          <span>✓ Settings saved successfully!</span>
        </div>
      )}

      {/* Theme Appearance Setting */}
      <section className="mb-8 duo-bg-surface border-2 duo-border rounded-3xl p-6">
        <h2 className="text-xl font-black duo-text-primary mb-2">Display Theme</h2>
        <p className="duo-text-secondary font-bold text-xs mb-4">
          Choose between Duolingo Dark mode (#131F24) and Light mode (#FFFFFF).
        </p>
        <ThemeToggle className="w-full sm:w-auto" />
      </section>

      {/* Account Info */}
      <section className="mb-8 duo-bg-surface border-2 duo-border rounded-3xl p-6">
        <h2 className="text-xl font-black duo-text-primary mb-4">Account Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black duo-text-secondary uppercase tracking-wider mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 duo-border duo-bg-page focus:border-macaw outline-none font-bold duo-text-primary text-sm transition-colors"
              placeholder="Your Name"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-black duo-text-secondary uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                disabled
                value={user?.username || 'learner'}
                className="w-full px-4 py-3 rounded-2xl border-2 duo-border duo-bg-subtle duo-text-muted font-bold text-sm cursor-not-allowed"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-black duo-text-secondary uppercase tracking-wider mb-2">
                Virtual Date
              </label>
              <input
                type="text"
                disabled
                value={user?.simulated_today || 'Today'}
                className="w-full px-4 py-3 rounded-2xl border-2 duo-border duo-bg-subtle duo-text-muted font-bold text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Daily Goal Target */}
      <section className="mb-8 duo-bg-surface border-2 duo-border rounded-3xl p-6">
        <h2 className="text-xl font-black duo-text-primary mb-1">Daily Study Goal</h2>
        <p className="duo-text-secondary font-bold text-sm mb-4">
          How much time do you want to commit to Spanish each day?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {goalOptions.map((g) => {
            const isSelected = dailyGoal === g.xp;
            return (
              <button
                key={g.xp}
                type="button"
                onClick={() => setDailyGoal(g.xp)}
                className={`p-4 rounded-2xl border-2 font-extrabold text-left transition-all ${
                  isSelected
                    ? 'border-macaw bg-sky/20 text-macaw border-b-4'
                    : 'duo-border hover:duo-bg-subtle duo-text-secondary'
                }`}
              >
                <div className="text-sm font-black mb-1">{g.label}</div>
                <div className="text-xs duo-text-muted">{g.xp} XP / day</div>
                <div className="text-[10px] duo-text-secondary mt-1">{g.time}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Learning & Audio Preferences */}
      <section className="mb-8 duo-bg-surface border-2 duo-border rounded-3xl p-6">
        <h2 className="text-xl font-black duo-text-primary mb-4">Learning Preferences</h2>
        <div className="space-y-5">
          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold duo-text-primary text-sm">Sound Effects</p>
              <p className="text-xs font-bold duo-text-secondary">
                Play responsive audio feedback for correct and wrong answers.
              </p>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-6 h-6 rounded-lg text-feather accent-feather cursor-pointer"
            />
          </div>

          <div className="border-t duo-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-extrabold duo-text-primary text-sm">Animations & Confetti</p>
              <p className="text-xs font-bold duo-text-secondary">
                Display celebratory confetti and mascot animations.
              </p>
            </div>
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={(e) => setAnimationsEnabled(e.target.checked)}
              className="w-6 h-6 rounded-lg text-feather accent-feather cursor-pointer"
            />
          </div>

          <div className="border-t duo-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-extrabold duo-text-primary text-sm">Listening Exercises</p>
              <p className="text-xs font-bold duo-text-secondary">
                Include audio drills with text-to-speech pronunciation.
              </p>
            </div>
            <input
              type="checkbox"
              checked={listeningEnabled}
              onChange={(e) => setListeningEnabled(e.target.checked)}
              className="w-6 h-6 rounded-lg text-feather accent-feather cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={() => updateSettingsMutation.mutate()}
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? 'SAVING...' : 'SAVE CHANGES'}
        </Button>
      </div>
    </div>
  );
}
