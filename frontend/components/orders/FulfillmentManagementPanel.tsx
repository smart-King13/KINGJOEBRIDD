"use client";
import React, { useState, useEffect } from 'react';
import { Heading3, BodyMuted } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ordersApi } from '@/lib/api/orders';
import { Fulfillment } from '@/types/api';

const FULFILLMENT_TYPES = ['pickup', 'delivery'];

const STATUSES_DELIVERY = ['pending', 'shipped', 'delivered'];
const STATUSES_PICKUP = ['pending', 'ready_for_pickup', 'picked_up'];

const STAGE_LABELS: Record<string, string> = {
  pending: 'Pending',
  shipped: 'Shipped',
  ready_for_pickup: 'Ready for Pickup',
  delivered: 'Delivered',
  picked_up: 'Picked Up'
};

import { useRouter } from 'next/navigation';

interface FulfillmentManagementPanelProps {
  orderId: string;
  fulfillment?: Fulfillment | null;
}

export function FulfillmentManagementPanel({ orderId, fulfillment }: FulfillmentManagementPanelProps) {
  const router = useRouter();
  const [type, setType] = useState(fulfillment?.type || 'delivery');
  const [status, setStatus] = useState(fulfillment?.status || 'pending');
  const [recipientName, setRecipientName] = useState(fulfillment?.recipient_name || '');
  const [phone, setPhone] = useState(fulfillment?.phone || '');
  const [address, setAddress] = useState(fulfillment?.address || '');
  const [deliveryFee, setDeliveryFee] = useState(fulfillment?.delivery_fee?.toString() || '');
  const [tracking, setTracking] = useState(fulfillment?.tracking_reference || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset status if type changes
  useEffect(() => {
    if (type === 'pickup' && !STATUSES_PICKUP.includes(status)) {
      setStatus('pending');
    } else if (type === 'delivery' && !STATUSES_DELIVERY.includes(status)) {
      setStatus('pending');
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const payload: Partial<Fulfillment> = {
        type: type as 'pickup' | 'delivery',
        status: status as any,
        recipient_name: recipientName || null,
        phone: phone || null,
        address: type === 'delivery' ? (address || null) : null,
        delivery_fee: type === 'delivery' && deliveryFee ? parseInt(deliveryFee, 10) : null,
        tracking_reference: type === 'delivery' ? (tracking || null) : null,
      };

      await ordersApi.upsertFulfillment(orderId, payload);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update fulfillment.');
    } finally {
      setLoading(false);
    }
  };

  const currentStatuses = type === 'pickup' ? STATUSES_PICKUP : STATUSES_DELIVERY;

  return (
    <div className="space-y-6 mt-12 pt-12 border-t border-border">
      <Heading3>Manage Fulfillment</Heading3>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Type</label>
            <Select value={type} onChange={(e) => setType(e.target.value as 'delivery' | 'pickup')} disabled={loading}>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as any)} disabled={loading}>
              {currentStatuses.map(s => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Recipient Name</label>
            <Input 
              value={recipientName} 
              onChange={(e) => setRecipientName(e.target.value)} 
              disabled={loading}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Phone Number</label>
            <Input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              disabled={loading}
              placeholder="e.g. +1234567890"
            />
          </div>
        </div>

        {type === 'delivery' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2 text-black">Delivery Address</label>
              <Textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                disabled={loading}
                placeholder="Full delivery address..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Delivery Fee (Cents)</label>
                <Input 
                  type="number"
                  value={deliveryFee} 
                  onChange={(e) => setDeliveryFee(e.target.value)} 
                  disabled={loading}
                  placeholder="e.g. 5000 for $50.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Tracking Reference</label>
                <Input 
                  value={tracking} 
                  onChange={(e) => setTracking(e.target.value)} 
                  disabled={loading}
                  placeholder="e.g. TRK-123456"
                />
              </div>
            </div>
          </>
        )}

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Saving...' : 'Save Fulfillment'}
        </Button>
      </form>
    </div>
  );
}
