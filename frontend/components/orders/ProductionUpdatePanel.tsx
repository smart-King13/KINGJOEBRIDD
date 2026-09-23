"use client";
import React, { useState } from 'react';
import { Heading3, Body, BodyMuted } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ordersApi } from '@/lib/api/orders';
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

import { useRouter } from 'next/navigation';

interface ProductionUpdatePanelProps {
  orderId: string;
  currentStatus: string;
  updates: ProductionUpdate[];
}

export function ProductionUpdatePanel({ orderId, currentStatus, updates }: ProductionUpdatePanelProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === currentStatus && !note) {
      setError('Please change the status or add a note.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await ordersApi.updateProduction(orderId, { status, note });
      setNote('');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update production.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Heading3>Manage Production</Heading3>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
            {PRODUCTION_STAGES.map(s => (
              <option key={s} value={s}>{STAGE_LABELS[s]}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Note (Optional)</label>
          <Textarea 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Add internal production notes or status details..." 
            disabled={loading}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Updating...' : 'Update Production'}
        </Button>
      </form>

      <div className="pt-8 mt-8 border-t border-border">
        <Heading3 className="text-xl mb-4">Production History</Heading3>
        {updates.length === 0 ? (
          <BodyMuted>No production updates recorded yet.</BodyMuted>
        ) : (
          <div className="space-y-4">
            {[...updates].reverse().map(update => (
              <div key={update.id} className="p-4 border border-border">
                <div className="flex justify-between items-start mb-2">
                  <Body className="font-medium">{STAGE_LABELS[update.status]}</Body>
                  <BodyMuted className="text-sm">{new Date(update.created_at).toLocaleString()}</BodyMuted>
                </div>
                {update.note && <BodyMuted>{update.note}</BodyMuted>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
