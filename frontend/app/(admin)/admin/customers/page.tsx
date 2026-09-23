'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@/types/api';
import { customersApi } from '@/lib/api/customers';
import { User as UserIcon, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await customersApi.list();
        if (response.data && Array.isArray(response.data)) {
          setCustomers(response.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-[var(--color-white)] rounded-xl"></div>
          <div className="h-12 bg-[var(--color-white)] rounded-xl"></div>
          <div className="h-12 bg-[var(--color-white)] rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <UserIcon className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-background-subtle)] text-[var(--color-ash)] border-b border-[var(--color-light-ash)]/40">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Customer</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Contact</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Role</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Joined</th>
                  <th className="px-6 py-4 text-right font-medium uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center text-[var(--color-black)] font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--color-black)]">{customer.name}</div>
                          <div className="text-[var(--color-ash)] text-xs mt-0.5">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-xs text-[var(--color-ash)]">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-[var(--color-background-subtle)] text-[var(--color-black)]">
                        {customer.role || 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ash)] text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Placeholder for future detailed view */}
                      <button className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 text-[var(--color-ash)] cursor-not-allowed">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
