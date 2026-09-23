import React from 'react';
import { Heading3, Body, BodyMuted } from '@/components/ui/Typography';
import { ProductionUpdate } from '@/types/api';

const PRODUCTION_STAGES = [
  'not_started',
  'cutting',
  'sewing',
  'finishing',
  'quality_check',
  'ready'
];

const STAGE_LABELS: Record<string, string> = {
  not_started: 'Not Started',
  cutting: 'Cutting',
  sewing: 'Sewing',
  finishing: 'Finishing',
  quality_check: 'Quality Check',
  ready: 'Ready'
};

interface ProductionTimelineProps {
  currentStatus: string;
  updates: ProductionUpdate[];
}

export function ProductionTimeline({ currentStatus, updates }: ProductionTimelineProps) {
  const currentIndex = PRODUCTION_STAGES.indexOf(currentStatus);

  if (updates.length === 0 && currentStatus === 'not_started') {
    return (
      <div className="py-8 text-center border border-border">
        <BodyMuted>Production has not started yet.</BodyMuted>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Heading3>Production</Heading3>
      <div className="space-y-0">
        {PRODUCTION_STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;
          
          const update = [...updates].reverse().find(u => u.status === stage);

          return (
            <div key={stage} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                  ${isCompleted ? 'bg-black border-black text-white' : ''}
                  ${isCurrent ? 'border-black bg-white' : ''}
                  ${isUpcoming ? 'border-border bg-white' : ''}
                `}>
                  {isCompleted && (
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCurrent && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </div>
                {index < PRODUCTION_STAGES.length - 1 && (
                  <div className={`w-0.5 h-full min-h-6 my-1 ${isCompleted ? 'bg-black' : 'bg-border'}`} />
                )}
              </div>
              <div className="pb-6 -mt-1">
                <Body className={isUpcoming ? 'text-text-secondary' : 'text-black'}>
                  {STAGE_LABELS[stage]}
                </Body>
                {update && (
                  <BodyMuted className="text-sm mt-1">
                    {new Date(update.created_at).toLocaleDateString()}
                    {update.note && <span className="block mt-1">{update.note}</span>}
                  </BodyMuted>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
