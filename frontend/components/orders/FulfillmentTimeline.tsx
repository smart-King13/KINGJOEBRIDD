import React from 'react';
import { Heading3, Body, BodyMuted } from '@/components/ui/Typography';
import { Fulfillment } from '@/types/api';

const FULFILLMENT_STAGES_DELIVERY = ['pending', 'shipped', 'delivered'];
const FULFILLMENT_STAGES_PICKUP = ['pending', 'ready_for_pickup', 'picked_up'];

const STAGE_LABELS: Record<string, string> = {
  pending: 'Pending',
  shipped: 'Shipped',
  ready_for_pickup: 'Ready for Pickup',
  delivered: 'Delivered',
  picked_up: 'Picked Up'
};

interface FulfillmentTimelineProps {
  fulfillment?: Fulfillment | null;
}

export function FulfillmentTimeline({ fulfillment }: FulfillmentTimelineProps) {
  if (!fulfillment) {
    return (
      <div className="py-8 text-center border border-border mt-12">
        <BodyMuted>Fulfillment details will appear here once they are arranged.</BodyMuted>
      </div>
    );
  }

  const stages = fulfillment.type === 'pickup' ? FULFILLMENT_STAGES_PICKUP : FULFILLMENT_STAGES_DELIVERY;
  const currentIndex = stages.indexOf(fulfillment.status);

  return (
    <div className="space-y-6 mt-12 border-t border-border pt-12">
      <Heading3>Fulfillment</Heading3>
      <div className="space-y-0">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

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
                {index < stages.length - 1 && (
                  <div className={`w-0.5 h-full min-h-6 my-1 ${isCompleted ? 'bg-black' : 'bg-border'}`} />
                )}
              </div>
              <div className="pb-6 -mt-1">
                <Body className={isUpcoming ? 'text-text-secondary' : 'text-black'}>
                  {STAGE_LABELS[stage]}
                </Body>
                {isCurrent && fulfillment.tracking_reference && stage === 'shipped' && (
                  <BodyMuted className="text-sm mt-1">
                    Tracking: {fulfillment.tracking_reference}
                  </BodyMuted>
                )}
                {isCurrent && fulfillment.type === 'delivery' && stage === 'pending' && fulfillment.address && (
                  <BodyMuted className="text-sm mt-1 whitespace-pre-wrap">
                    Delivery to: {fulfillment.address}
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
