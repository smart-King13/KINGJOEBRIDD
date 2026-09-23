'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/apiClient';
import { customersApi } from '@/lib/api/customers';
import { User, QuoteItem } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatMoney } from '@/lib/utils/format';

export default function AdminCreateQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const conversationId = searchParams.get('conversation_id');

  const [customer, setCustomer] = useState<User | null>(null);
  const [items, setItems] = useState<Partial<QuoteItem>[]>([
    { type: 'Custom Garment', description: '', quantity: 1, unit_price: 0 }
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      customersApi.get(userId).then(res => setCustomer(res.data)).catch(() => {});
    }
  }, [userId]);

  const addItem = () => {
    setItems([...items, { type: 'Custom Garment', description: '', quantity: 1, unit_price: 0 }]);
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unit_price || 0)), 0);
  const total = Math.max(0, subtotal - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('A User ID is required to create a quote.');
      return;
    }

    if (items.some(item => !item.description || !item.type || !item.quantity || item.unit_price === undefined)) {
      setError('All items must have a type, description, quantity, and unit price.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      user_id: userId,
      conversation_id: conversationId || undefined,
      discount: discount || 0,
      notes: notes || undefined,
      expires_at: expiresAt || undefined,
      items: items.map(item => ({
        type: item.type,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
    };

    try {
      const res = await apiClient<{ data: { id: string } }>('/quotes', {
        method: 'POST',
        data: payload
      });
      router.push(`/admin/quotes/${res.data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create quote.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        {conversationId ? (
          <Link href={`/admin/conversations/${conversationId}`} className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Conversation
          </Link>
        ) : (
          <Link href="/admin/quotes" className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Quotes
          </Link>
        )}
        <h1 className="font-display text-3xl font-medium text-[var(--color-black)] uppercase mb-2">
          Create Quote
        </h1>
        {customer && (
          <p className="text-sm text-[var(--color-ash)]">
            Drafting quote for <span className="font-medium text-[var(--color-black)]">{customer.name}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]">
          <div className="p-6 md:p-8 space-y-6">
            <h2 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
              Quote Items
            </h2>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-[var(--color-light-ash)]/50 bg-[var(--color-black)]/5">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">Type</label>
                        <Input 
                          value={item.type || ''} 
                          onChange={(e) => updateItem(index, 'type', e.target.value)} 
                          required
                          placeholder="e.g. Custom Garment"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">Description</label>
                        <Input 
                          value={item.description || ''} 
                          onChange={(e) => updateItem(index, 'description', e.target.value)} 
                          required
                          placeholder="e.g. Two-piece Wool Suit"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">Quantity</label>
                        <Input 
                          type="number"
                          min="1"
                          value={item.quantity || ''} 
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))} 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">Unit Price (NGN)</label>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price ? item.unit_price / 100 : ''} 
                          onChange={(e) => updateItem(index, 'unit_price', Math.round(parseFloat(e.target.value) * 100))} 
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {items.length > 1 && (
                    <div className="flex items-center">
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        className="text-xs text-red-600 uppercase tracking-widest font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addItem} className="text-xs mt-2">
              + ADD ANOTHER ITEM
            </Button>
          </div>
        </div>

        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]">
          <div className="p-6 md:p-8 space-y-6">
            <h2 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
              Pricing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">Discount (NGN)</label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount ? discount / 100 : ''}
                    onChange={(e) => setDiscount(Math.round(parseFloat(e.target.value || '0') * 100))} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">Expiration Date (Optional)</label>
                  <Input 
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)} 
                  />
                </div>
              </div>

              <div className="bg-[var(--color-black)]/5 p-6 space-y-3 flex flex-col justify-center">
                <div className="flex justify-between text-sm text-[var(--color-ash)]">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-black)] font-medium border-b border-[var(--color-light-ash)] pb-3">
                  <span>Discount</span>
                  <span>-{formatMoney(discount)}</span>
                </div>
                <div className="flex justify-between font-display text-2xl text-[var(--color-black)] pt-1">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">Notes to Customer</label>
              <textarea 
                className="w-full border border-[var(--color-ash)]/30 rounded-none p-3 text-sm min-h-[100px] focus:outline-none focus:border-[var(--color-black)]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special terms, conditions, or remarks..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            SAVE DRAFT QUOTE
          </Button>
        </div>
      </form>
    </div>
  );
}
