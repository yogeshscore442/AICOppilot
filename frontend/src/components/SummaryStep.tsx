import React, { useState } from 'react';
import {
  CalendarPlus,
  Check,
  Copy,
  Download,
  FileCheck2,
  Printer,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ScheduleRow } from '../types';
import { downloadCalendarFile } from '../utils/calendar';
import { SafeMarkdown } from '../utils/markdown';

interface SummaryStepProps {
  summaryText: string;
  schedule: ScheduleRow[];
  onStartNewDocument: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  summaryText,
  schedule,
  onStartNewDocument,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadedIcs, setDownloadedIcs] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clinical_summary_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddReminders = () => {
    downloadCalendarFile(schedule);
    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 3000);
  };

  const hasScheduleReminders = schedule && schedule.some((r) => r.parsed && !r.as_needed);

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4 space-y-6">
      {/* Top Completion Header */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/30 p-5 text-center shadow-sm">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 mb-2">
          <FileCheck2 className="h-7 w-7" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-emerald-950 dark:text-emerald-200">
          Clinical Consultation Summary
        </h2>
        <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1">
          Review your finalized instructions, save calendar alerts, or print this document
        </p>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-sm transition-all min-h-[40px]"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-sm transition-all min-h-[40px]"
          >
            <Download className="h-4 w-4" />
            <span>Download .txt</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-sm transition-all min-h-[40px]"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>

          {hasScheduleReminders && (
            <button
              type="button"
              onClick={handleAddReminders}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all min-h-[40px]"
            >
              {downloadedIcs ? <Check className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
              <span>{downloadedIcs ? 'Calendar .ics Downloaded' : 'Add Reminders (.ics)'}</span>
            </button>
          )}
        </div>

        {hasScheduleReminders && (
          <p className="mt-3 text-[11px] text-emerald-800 dark:text-emerald-400">
            * Reminder times default to Morning 08:00, Afternoon 14:00, Evening 18:00, Night 21:00. You can adjust them in your calendar app.
          </p>
        )}
      </div>

      {/* Rendered Summary Document */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm print:border-none print:shadow-none">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 text-brand-600 dark:text-brand-400">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Structured Summary Record</h3>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
          <SafeMarkdown content={summaryText} />
        </div>
      </div>

      {/* Start New Document Button */}
      <div className="pt-4 text-center print:hidden">
        <button
          type="button"
          onClick={onStartNewDocument}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 min-h-[44px]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Upload New Medical Document</span>
        </button>
      </div>
    </div>
  );
};
