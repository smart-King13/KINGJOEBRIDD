'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StyleRequest } from '@/types/api';
import { styleRequestsApi } from '@/lib/api/styleRequests';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [request, setRequest] = useState<StyleRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadRequest() {
      if (!id) return;
      try {
        const response = await styleRequestsApi.get(id as string);
        if (response.data) {
          setRequest(response.data);
        } else if ((response as any).data?.data) {
          setRequest((response as any).data.data);
        } else {
          setRequest(response as any);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load request details');
      } finally {
        setIsLoading(false);
      }
    }
    loadRequest();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!request || !id) return;
    setIsUpdating(true);
    try {
      const response = await styleRequestsApi.updateStatus(id as string, newStatus);
      const updatedData = response.data || (response as any).data?.data || response;
      setRequest(updatedData);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Request Details</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-64 bg-[var(--color-ash)]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Request Details</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error || 'Request not found'}
        </div>
        <button onClick={() => router.back()} className="text-sm underline">
          &larr; Back
        </button>
      </div>
    );
  }

  const statusOptions = ['pending', 'in_discussion', 'quote_sent', 'rejected', 'completed'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/requests" className="text-sm text-[var(--color-ash)] hover:text-[var(--color-black)] mb-2 inline-block transition-colors">
            &larr; Back to Requests
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Style Request Details</h1>
          <div className="text-sm text-[var(--color-ash)] mt-1">
            Submitted on {new Date(request.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={request.status} />
          <select
            className="text-sm border border-[var(--color-ash)]/30 rounded p-1"
            value={request.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 rounded-lg p-6 space-y-4">
            <h2 className="text-[12px] font-bold tracking-widest uppercase border-b border-[var(--color-ash)]/20 pb-2">
              Request Information
            </h2>
            
            <div>
              <p className="text-sm text-[var(--color-ash)] mb-1">Description</p>
              <p className="text-base whitespace-pre-wrap">{request.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--color-ash)] mb-1">Preferred Color</p>
                <p className="text-sm font-medium">{request.preferred_color || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-ash)] mb-1">Preferred Material</p>
                <p className="text-sm font-medium">{request.preferred_material || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-[var(--color-ash)] mb-1">Sourcing Preference</p>
                <p className="text-sm font-medium">
                  {request.sourcing_preference 
                    ? request.sourcing_preference.replace('_', ' ').toUpperCase()
                    : 'Not specified'}
                </p>
              </div>
            </div>

            {request.notes && (
              <div>
                <p className="text-sm text-[var(--color-ash)] mb-1">Additional Notes</p>
                <p className="text-sm whitespace-pre-wrap bg-[var(--color-ash)]/5 p-3 rounded">{request.notes}</p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 rounded-lg p-6 space-y-4">
              <h2 className="text-[12px] font-bold tracking-widest uppercase border-b border-[var(--color-ash)]/20 pb-2">
                Attachments
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {request.attachments.map((file) => (
                  <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="block border border-[var(--color-ash)]/20 rounded p-2 hover:border-[var(--color-black)] transition-colors">
                    <div className="aspect-square bg-[var(--color-ash)]/10 rounded flex items-center justify-center mb-2 overflow-hidden">
                      {file.file_type.startsWith('image/') ? (
                        <img src={file.url} alt={file.file_name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-xs uppercase">{file.file_type.split('/')[1] || 'FILE'}</span>
                      )}
                    </div>
                    <p className="text-xs truncate" title={file.file_name}>{file.file_name}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          
          <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 rounded-lg p-6 space-y-4">
            <h2 className="text-[12px] font-bold tracking-widest uppercase border-b border-[var(--color-ash)]/20 pb-2">
              Customer
            </h2>
            {request.user ? (
              <div>
                <p className="font-medium">{request.user.name}</p>
                <p className="text-sm text-[var(--color-ash)]">{request.user.email}</p>
                <Link href={`/admin/measurements`} className="text-xs underline mt-2 inline-block">
                  View Measurements
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-ash)]">Unknown Customer</p>
            )}
          </div>

          <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 rounded-lg p-6 space-y-4">
            <h2 className="text-[12px] font-bold tracking-widest uppercase border-b border-[var(--color-ash)]/20 pb-2">
              Selected Style
            </h2>
            {request.style ? (
              <div>
                <p className="font-medium">{request.style.name}</p>
                {request.style.images && request.style.images[0] && (
                  <img src={request.style.images[0].file_path} alt={request.style.name} className="w-full aspect-[3/4] object-cover mt-2 rounded" />
                )}
                <Link href={`/admin/styles/${request.style.slug}/edit`} className="text-xs underline mt-2 inline-block">
                  View Style Details
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-ash)] italic">No base style selected. Custom request.</p>
            )}
          </div>

          <div className="bg-[var(--color-black)] text-white rounded-lg p-6 space-y-4">
            <h2 className="text-[12px] font-bold tracking-widest uppercase border-b border-white/20 pb-2">
              Communication
            </h2>
            <p className="text-sm text-[var(--color-ash)]">
              Continue the discussion with the customer to finalize details.
            </p>
            <Link href={`/admin/conversations?context=style_request&id=${request.id}`} className="block text-center text-[12px] font-bold tracking-widest uppercase bg-[var(--color-white)] text-[var(--color-black)] px-4 py-3 hover:bg-[var(--color-ash)] transition-colors rounded">
              Open Conversation
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
