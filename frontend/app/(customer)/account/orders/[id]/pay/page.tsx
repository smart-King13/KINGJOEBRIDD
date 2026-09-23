'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api/orders';
import { paymentsApi } from '@/lib/api/payments';
import { Order, Payment } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatMoney } from '@/lib/utils/format';
import Link from 'next/link';

export default function OrderPaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paymentType, setPaymentType] = useState<'deposit' | 'balance' | 'full'>('full');
  const [amountInput, setAmountInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrderAndPayments = async () => {
      try {
        const orderRes = await ordersApi.get(params.id);
        const paymentsRes = await paymentsApi.list(params.id);
        setOrder(orderRes.data);
        setPayments(paymentsRes.data);
        
        // Auto-set amount to balance initially
        const total = orderRes.data.snapshot.quote?.total || 0;
        const paid = paymentsRes.data.filter(p => p.status === 'successful').reduce((sum, p) => sum + p.amount, 0);
        const balance = total - paid;
        
        setAmountInput((balance / 100).toString()); // Frontend input uses major units

      } catch (err: any) {
        setError('Failed to load order information.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderAndPayments();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setError(null);
    setIsSubmitting(true);

    const numAmountMajor = parseFloat(amountInput);
    if (isNaN(numAmountMajor) || numAmountMajor <= 0) {
      setError('Please enter a valid amount.');
      setIsSubmitting(false);
      return;
    }

    const amountMinor = Math.round(numAmountMajor * 100);

    try {
      const res = await paymentsApi.initialize(order.id, amountMinor, paymentType);
      
      // Redirect to provider authorization URL
      if (res.data.authorization_url) {
        if (res.data.authorization_url.includes('checkout.sandbox.payment')) {
          // Simulate mock provider return redirect for local testing
          router.push(`/payment/return?payment_id=${res.data.payment.id}`);
        } else {
          window.location.href = res.data.authorization_url;
        }
      } else {
        throw new Error('No authorization URL returned.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse bg-[var(--color-ash)]/10 max-w-2xl"></div>;
  }

  if (error || !order) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 max-w-2xl">
        {error || 'Order not found.'}
      </div>
    );
  }

  const quoteTotal = order.snapshot.quote?.total || 0;
  const successfulPayments = payments.filter(p => p.status === 'successful');
  const totalPaid = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = quoteTotal - totalPaid;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'deposit' | 'balance' | 'full';
    setPaymentType(type);
    
    if (type === 'full' || type === 'balance') {
      setAmountInput((remainingBalance / 100).toString());
    } else if (type === 'deposit') {
      setAmountInput(((quoteTotal * 0.5) / 100).toString());
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link href={`/account/orders/${order.id}`} className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO ORDER
        </Link>
        <h1 className="font-display text-3xl font-medium text-[var(--color-black)] uppercase mb-2">
          Make a Payment
        </h1>
        <p className="text-sm text-[var(--color-ash)]">
          Securely complete payment for Order {order.id.split('-')[0]}
        </p>
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 p-6 md:p-8">
        <div className="space-y-4 mb-8 text-sm">
          <div className="flex justify-between items-center text-[var(--color-black)] border-b border-[var(--color-ash)]/20 pb-4">
            <span>Order Total</span>
            <span className="font-medium">{formatMoney(quoteTotal)}</span>
          </div>
          <div className="flex justify-between items-center text-green-700 border-b border-[var(--color-ash)]/20 pb-4">
            <span>Already Paid</span>
            <span>-{formatMoney(totalPaid)}</span>
          </div>
          <div className="flex justify-between items-center text-[var(--color-black)] font-medium text-lg pt-2 pb-4 border-b border-[var(--color-ash)]/20">
            <span>Remaining Balance</span>
            <span>{formatMoney(remainingBalance)}</span>
          </div>

          {payments.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xs font-bold tracking-widest text-[var(--color-black)] mb-4 uppercase">Payment History</h3>
              <ul className="space-y-3">
                {payments.map(p => (
                  <li key={p.id} className="flex justify-between items-center bg-[var(--color-ash)]/5 p-4 border border-[var(--color-ash)]/10">
                    <div>
                      <p className="font-medium text-[var(--color-black)] capitalize">{p.type}</p>
                      <p className="text-xs text-[var(--color-ash)] mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[var(--color-black)]">{formatMoney(p.amount)}</p>
                      <p className={`text-xs mt-1 font-medium tracking-widest uppercase ${p.status === 'successful' ? 'text-green-700' : 'text-yellow-700'}`}>
                        {p.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {remainingBalance <= 0 ? (
          <div className="p-4 bg-green-50 text-green-800 border border-green-200 text-center">
            This order is already paid in full.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="bg-[var(--color-ash)]/5 p-4 border border-[var(--color-ash)]/20 mb-6 text-sm text-[var(--color-black)]">
              <strong>Note:</strong> Deposits must be at least 50% of the quote total.
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="paymentType" className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">
                  Payment Type
                </label>
                <Select
                  id="paymentType"
                  value={paymentType}
                  onChange={handleTypeChange}
                  disabled={isSubmitting}
                >
                  {totalPaid === 0 && <option value="deposit">Deposit (50% Minimum)</option>}
                  {totalPaid === 0 && <option value="full">Pay in Full</option>}
                  {totalPaid > 0 && <option value="balance">Pay Remaining Balance</option>}
                </Select>
              </div>

              <div>
                <label htmlFor="amount" className="block text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">
                  Amount (NGN)
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                PROCEED TO PAYMENT
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
