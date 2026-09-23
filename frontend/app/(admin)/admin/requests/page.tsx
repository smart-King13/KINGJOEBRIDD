'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StyleRequest } from '@/types/api';
import { styleRequestsApi } from '@/lib/api/styleRequests';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PenTool } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<StyleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRequests() {
      try {
        const response = await styleRequestsApi.list();
        // Unwrap paginated response
        if (response.data && Array.isArray(response.data)) {
          setRequests(response.data);
        } else if (response.data && Array.isArray((response.data as any).data)) {
          setRequests((response.data as any).data);
        } else if (Array.isArray(response as any)) {
          setRequests(response as any);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    }

    loadRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Style Requests</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Style Requests</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {requests.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <PenTool className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No style requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-background-subtle)] text-[var(--color-ash)] border-b border-[var(--color-light-ash)]/40">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Customer</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Style</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Status</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Requested</th>
                  <th className="px-6 py-4 text-right font-medium uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                    <td className="px-6 py-4">
                      {req.user ? (
                        <div>
                          <div className="font-medium text-[var(--color-black)] mb-1">{req.user.name}</div>
                          <div className="text-[11px] text-[var(--color-ash)]">{req.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-[var(--color-ash)] text-xs italic">Unknown Customer</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {req.style ? (
                        <div className="font-medium text-[var(--color-black)]">{req.style.name}</div>
                      ) : (
                        <span className="text-[var(--color-ash)] text-xs italic">Custom Request</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ash)] text-xs">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 text-[var(--color-ash)] hover:text-[var(--color-black)] hover:border-[var(--color-black)] transition-colors inline-block"
                      >
                        View
                      </Link>
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
