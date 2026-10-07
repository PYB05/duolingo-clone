'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GemIcon, HeartIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { DuoLoadingScreen } from '@/components/ui/DuoLoadingScreen';

export default function ShopPage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => api.getMe() });
  const { data: shop, isLoading } = useQuery({ queryKey: ['shop'], queryFn: () => api.getShop() });

  const purchaseMutation = useMutation({
    mutationFn: (itemKey: string) => api.purchaseItem(itemKey),
    onSuccess: (data) => {
      alert(`🎉 ${data.message}`);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Purchase failed.');
    },
  });

  if (isLoading || !shop) {
    return (
      <DuoLoadingScreen
        message="LOADING SHOP..."
        subtext="Stocking up streaks, freezes, and hearts!"
      />
    );
  }

  return (
    <div className="pb-16 select-none max-w-xl mx-auto space-y-6">
      {/* Gem Balance Header Banner */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-sky/20 border-2 border-sky-border">
        <div>
          <h1 className="text-2xl font-black duo-text-primary">Shop</h1>
          <p className="text-xs sm:text-sm font-bold duo-text-secondary mt-1">
            Exchange your earned gems for power-ups and hearts.
          </p>
        </div>
        <div className="flex items-center gap-2 duo-bg-surface px-4 py-2.5 rounded-2xl border-2 border-sky-border shadow-sm">
          <GemIcon className="w-6 h-6" />
          <span className="font-black text-lg text-macaw">{shop.gems}</span>
        </div>
      </div>

      {/* Shop Items List */}
      <div className="space-y-4">
        {/* Heart Refill Item */}
        <div className="flex items-center justify-between p-5 rounded-2xl border-2 duo-border duo-bg-surface gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center shrink-0">
              <HeartIcon className="w-8 h-8 text-cardinal" />
            </div>
            <div>
              <h3 className="font-black text-base duo-text-primary">Refill Hearts</h3>
              <p className="text-xs font-bold duo-text-secondary mt-0.5">
                Instantly replenish all 5 hearts to keep learning without waiting.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              disabled={shop.gems < 350 || (user?.hearts ?? 5) >= 5}
              onClick={() => purchaseMutation.mutate('heart_refill')}
            >
              <div className="flex items-center gap-1 font-black">
                <GemIcon className="w-4 h-4" />
                <span>350</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Streak Freeze Item */}
        <div className="flex items-center justify-between p-5 rounded-2xl border-2 duo-border duo-bg-surface gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border-2 border-blue-500/30 flex items-center justify-center shrink-0">
              <span className="text-3xl">🧊</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base duo-text-primary">Streak Freeze</h3>
                <span className="text-xs font-extrabold text-macaw bg-sky/20 px-2 py-0.5 rounded-lg border border-sky-border">
                  {user?.streak_freezes || 0} / 2 EQUIPPED
                </span>
              </div>
              <p className="text-xs font-bold duo-text-secondary mt-0.5">
                Protects your streak if you miss a full day of practice.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              disabled={shop.gems < 200 || (user?.streak_freezes || 0) >= 2}
              onClick={() => purchaseMutation.mutate('streak_freeze')}
            >
              <div className="flex items-center gap-1 font-black">
                <GemIcon className="w-4 h-4" />
                <span>200</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Double or Nothing Placeholder */}
        <div className="flex items-center justify-between p-5 rounded-2xl border-2 duo-border duo-bg-surface gap-4 opacity-70">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center shrink-0">
              <span className="text-3xl">🪙</span>
            </div>
            <div>
              <h3 className="font-black text-base duo-text-primary">Double or Nothing</h3>
              <p className="text-xs font-bold duo-text-secondary mt-0.5">
                Maintain a 7-day streak to double your 50 gem wager!
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="text-xs font-black duo-text-muted uppercase tracking-wider px-3 py-2">
              COMING SOON
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
