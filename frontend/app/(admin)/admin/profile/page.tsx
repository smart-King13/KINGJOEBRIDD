'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { authApi } from '@/lib/api/auth';
import { User, Shield, Mail, Key, Loader2, CheckCircle2, Camera } from 'lucide-react';

export default function AdminProfilePage() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Initialize profile form
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      await authApi.updateProfile({ name, email });
      setProfileSuccess('Profile updated successfully.');
      if (refreshUser) await refreshUser(); // Refresh user state in AuthProvider
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      await authApi.updatePassword({ 
        current_password: currentPassword, 
        password: newPassword, 
        password_confirmation: confirmPassword 
      });
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await authApi.updateAvatar(formData);
      if (refreshUser) await refreshUser(); // Refresh user state to fetch new avatar_url
      setProfileSuccess('Avatar updated successfully.');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const avatarUrl = user?.avatar_url 
    ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${user.avatar_url}`)
    : null;

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div 
            className="relative h-24 w-24 rounded-full bg-[var(--color-black)] flex items-center justify-center text-[var(--color-white)] font-display text-4xl shadow-lg ring-4 ring-offset-4 ring-offset-[var(--color-white)] ring-[var(--color-light-ash)] overflow-hidden group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0) || 'A'}</span>
            )}

            {/* Hover overlay for upload */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
            />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="font-display text-3xl font-bold tracking-widest text-[var(--color-black)] uppercase">
              {user?.name || 'Administrator'}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-ash)] font-medium uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email || 'admin@kingjoebridd.com'}</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> {user?.role || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Details Form */}
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <form onSubmit={handleUpdateProfile} className="p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-[var(--color-black)]" />
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-black)]">Account Details</h3>
            </div>
            
            <div className="space-y-6 flex-1">
              {profileSuccess && (
                <div className="p-3 bg-green-50 text-green-700 text-xs tracking-wide uppercase font-bold rounded-lg flex items-center gap-2 border border-green-200">
                  <CheckCircle2 className="w-4 h-4" /> {profileSuccess}
                </div>
              )}
              {profileError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs tracking-wide uppercase font-bold rounded-lg border border-red-200">
                  {profileError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)] rounded-lg text-sm font-medium focus:ring-1 focus:ring-[var(--color-black)] focus:outline-none transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)] rounded-lg text-sm font-medium focus:ring-1 focus:ring-[var(--color-black)] focus:outline-none transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-2">Role</label>
                <div className="p-3 bg-[var(--color-background-subtle)] text-[var(--color-ash)] border border-[var(--color-light-ash)]/50 rounded-lg text-sm font-medium capitalize cursor-not-allowed">
                  {user?.role || 'Admin'}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-light-ash)]">
              <button 
                type="submit" 
                disabled={isUpdatingProfile || (name === user?.name && email === user?.email)}
                className="w-full py-3 bg-[var(--color-black)] text-[var(--color-white)] text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--color-white)] hover:text-[var(--color-black)] border border-[var(--color-black)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Settings Form */}
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <form onSubmit={handleUpdatePassword} className="p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-5 h-5 text-[var(--color-black)]" />
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-black)]">Security Settings</h3>
            </div>

            <div className="space-y-6 flex-1">
              {passwordSuccess && (
                <div className="p-3 bg-green-50 text-green-700 text-xs tracking-wide uppercase font-bold rounded-lg flex items-center gap-2 border border-green-200">
                  <CheckCircle2 className="w-4 h-4" /> {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs tracking-wide uppercase font-bold rounded-lg border border-red-200">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)] rounded-lg text-sm font-medium focus:ring-1 focus:ring-[var(--color-black)] focus:outline-none transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)] rounded-lg text-sm font-medium focus:ring-1 focus:ring-[var(--color-black)] focus:outline-none transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)] rounded-lg text-sm font-medium focus:ring-1 focus:ring-[var(--color-black)] focus:outline-none transition-shadow"
                  required
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-light-ash)]">
              <button 
                type="submit" 
                disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full py-3 bg-[var(--color-white)] text-[var(--color-black)] text-xs font-bold tracking-widest uppercase rounded-lg border border-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-white)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
