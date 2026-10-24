import React from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';
import { HealthResponse } from '../types';

interface HealthBannerProps {
  health: HealthResponse | null;
  serverError: string | null;
}

export const HealthBanner: React.FC<HealthBannerProps> = ({ health, serverError }) => {
  if (serverError) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>
              Backend server at <code className="font-mono bg-amber-100 dark:bg-amber-950/50 px-1 py-0.5 rounded">localhost:8000</code> is currently unreachable. You can use Mock Mode to test all features.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (health && health.api_key_configured === false) {
    return (
      <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2.5 text-xs text-red-800 dark:text-red-200">
        <div className="max-w-5xl mx-auto flex items-center gap-2.5">
          <KeyRound className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <span>
            <strong>Setup Required:</strong> Google Gemini API key is missing. Set <code className="font-mono bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded">GEMINI_API_KEY=your_key</code> in your backend <code className="font-mono">.env</code> file.
          </span>
        </div>
      </div>
    );
  }

  return null;
};
