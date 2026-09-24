'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { styleRequestsApi } from '@/lib/api/styleRequests';
import { conversationsApi } from '@/lib/api/conversations';
import { Attachment } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Radio } from '@/components/ui/Radio';
import { AttachmentUploader } from './AttachmentUploader';
import { Scissors, Package, CheckCircle2 } from 'lucide-react';

export function StyleRequestForm({ styleId, externalStyle }: { styleId?: string; externalStyle?: string }) {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [preferredColor, setPreferredColor] = useState('');
  const [preferredMaterial, setPreferredMaterial] = useState('');
  const [sourcingPreference, setSourcingPreference] = useState<'customer_provided' | 'kingjoebridd_sourced' | ''>('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      setError('Description is required.');
      return;
    }

    if (!sourcingPreference) {
      setError('Please select a material sourcing preference.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const finalNotes = externalStyle 
        ? `Reference Image: ${externalStyle}\n\n${notes}`
        : notes || undefined;

      // 1. Create the Style Request
      const requestRes = await styleRequestsApi.create({
        style_id: styleId || undefined,
        description,
        preferred_color: preferredColor || undefined,
        preferred_material: preferredMaterial || undefined,
        sourcing_preference: sourcingPreference as 'customer_provided' | 'kingjoebridd_sourced',
        notes: finalNotes,
        attachment_ids: attachments.map(a => a.id),
      });

      // 2. Open/Create conversation for it
      const convoRes = await conversationsApi.create({
        context_type: 'style_request',
        context_id: requestRes.data.id,
      });

      // 3. Navigate to conversation
      const conversationId = (convoRes as any).data?.data?.id || convoRes.data?.id || (convoRes as any).id;
      alert(`Redirecting to: /account/conversations/${conversationId}`);
      router.push(`/account/conversations/${conversationId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit your request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-sm">
          {error}
        </div>
      )}

      {externalStyle && (
        <div className="mb-6 p-4 rounded-2xl bg-[var(--color-ash)]/10 flex flex-col sm:flex-row items-start gap-4">
          <div className="relative w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={externalStyle} alt="Reference Style" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm tracking-wider text-[var(--color-black)] mb-1">REFERENCE STYLE ATTACHED</h3>
            <p className="text-xs text-[var(--color-ash)] mb-3">This image will be included with your request for the tailor to review.</p>
            <button 
              type="button"
              onClick={() => router.push('/style-requests/new')}
              className="text-xs font-bold tracking-widest text-red-500 hover:text-red-700 uppercase transition-colors"
            >
              Remove Image
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-xs sm:text-sm font-medium tracking-wider sm:tracking-widest text-[var(--color-black)] mb-2">
            WHAT WOULD YOU LIKE US TO MAKE? <span className="text-red-500">*</span>
          </label>
          <p className="text-[10px] sm:text-xs text-[var(--color-ash)] mb-2">
            Tell us about your occasion, desired fit, and the overall look you want to achieve.
          </p>
          <Textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your vision..."
            required
            disabled={isSubmitting}
            className="rounded-2xl p-5 border-[var(--color-light-ash)] focus:border-[var(--color-black)] focus:ring-[var(--color-black)] transition-all bg-[var(--color-background-subtle)]/50 text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="color" className="block text-xs sm:text-sm font-medium tracking-wider sm:tracking-widest text-[var(--color-black)] mb-2">
              PREFERRED COLOR (OPTIONAL)
            </label>
            <Input
              id="color"
              type="text"
              variant="rounded"
              value={preferredColor}
              onChange={(e) => setPreferredColor(e.target.value)}
              placeholder="e.g. Navy Blue, Emerald Green"
              disabled={isSubmitting}
              className="bg-[var(--color-background-subtle)]/50"
            />
          </div>

          <div>
            <label htmlFor="material" className="block text-xs sm:text-sm font-medium tracking-wider sm:tracking-widest text-[var(--color-black)] mb-2">
              PREFERRED MATERIAL (OPTIONAL)
            </label>
            <Input
              id="material"
              type="text"
              variant="rounded"
              value={preferredMaterial}
              onChange={(e) => setPreferredMaterial(e.target.value)}
              placeholder="e.g. Silk, Wool blend"
              disabled={isSubmitting}
              className="bg-[var(--color-background-subtle)]/50"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-light-ash)]/60">
          <label className="block text-xs sm:text-sm font-medium tracking-wider sm:tracking-widest text-[var(--color-black)] mb-4">
            MATERIAL SOURCING <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label 
              className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden group ${
                sourcingPreference === 'kingjoebridd_sourced' 
                  ? 'border-[var(--color-black)] bg-[var(--color-black)] text-[var(--color-white)] shadow-xl' 
                  : 'border-[var(--color-light-ash)] bg-[var(--color-white)] hover:border-[var(--color-black)]/30 hover:shadow-md'
              }`}
            >
              {sourcingPreference === 'kingjoebridd_sourced' && (
                <div className="absolute top-4 right-4 text-[var(--color-white)] animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
                sourcingPreference === 'kingjoebridd_sourced'
                  ? 'bg-[var(--color-white)]/20 text-[var(--color-white)]'
                  : 'bg-[var(--color-background-subtle)] text-[var(--color-black)]'
              }`}>
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <Radio 
                  name="sourcing_preference" 
                  value="kingjoebridd_sourced"
                  checked={sourcingPreference === 'kingjoebridd_sourced'}
                  onChange={() => setSourcingPreference('kingjoebridd_sourced')}
                  className="sr-only"
                />
                <span className={`font-display text-lg tracking-wide block mb-1 ${
                  sourcingPreference === 'kingjoebridd_sourced' ? 'text-[var(--color-white)]' : 'text-[var(--color-black)]'
                }`}>Source it for me</span>
                <p className={`text-sm ${
                  sourcingPreference === 'kingjoebridd_sourced' ? 'text-[var(--color-light-ash)]' : 'text-[var(--color-ash)]'
                }`}>
                  KINGJOEBRIDD will find and provide the premium materials needed.
                </p>
              </div>
            </label>
            
            <label 
              className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden group ${
                sourcingPreference === 'customer_provided' 
                  ? 'border-[var(--color-black)] bg-[var(--color-black)] text-[var(--color-white)] shadow-xl' 
                  : 'border-[var(--color-light-ash)] bg-[var(--color-white)] hover:border-[var(--color-black)]/30 hover:shadow-md'
              }`}
            >
              {sourcingPreference === 'customer_provided' && (
                <div className="absolute top-4 right-4 text-[var(--color-white)] animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
                sourcingPreference === 'customer_provided'
                  ? 'bg-[var(--color-white)]/20 text-[var(--color-white)]'
                  : 'bg-[var(--color-background-subtle)] text-[var(--color-black)]'
              }`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <Radio 
                  name="sourcing_preference" 
                  value="customer_provided"
                  checked={sourcingPreference === 'customer_provided'}
                  onChange={() => setSourcingPreference('customer_provided')}
                  className="sr-only"
                />
                <span className={`font-display text-lg tracking-wide block mb-1 ${
                  sourcingPreference === 'customer_provided' ? 'text-[var(--color-white)]' : 'text-[var(--color-black)]'
                }`}>I have my material</span>
                <p className={`text-sm ${
                  sourcingPreference === 'customer_provided' ? 'text-[var(--color-light-ash)]' : 'text-[var(--color-ash)]'
                }`}>
                  I will provide my own fabric for this garment.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-8">
          <label htmlFor="notes" className="block text-xs sm:text-sm font-medium tracking-wider sm:tracking-widest text-[var(--color-black)] mb-2">
            ADDITIONAL NOTES (OPTIONAL)
          </label>
          <Textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any timeline constraints or specific design details..."
            disabled={isSubmitting}
            className="rounded-2xl p-5 border-[var(--color-light-ash)] focus:border-[var(--color-black)] transition-all bg-[var(--color-background-subtle)]/50"
          />
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-[var(--color-light-ash)]/60">
        <label className="block text-xs sm:text-sm font-medium tracking-wider sm:tracking-widest text-[var(--color-black)]">
          INSPIRATION IMAGES (OPTIONAL)
        </label>
        <p className="text-[10px] sm:text-xs text-[var(--color-ash)]">
          Upload reference photos, sketches, or PDFs to help us understand your vision.
        </p>
        <AttachmentUploader 
          onAttachmentsChange={setAttachments} 
          maxFiles={5}
        />
      </div>

      <div className="pt-8">
        <Button 
          type="submit" 
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full sm:w-auto px-12"
        >
          SUBMIT REQUEST
        </Button>
      </div>
    </form>
  );
}
