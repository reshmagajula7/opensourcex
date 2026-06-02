import React from 'react';
import { useGetUserProfile } from '../hooks/useApi.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { User, Mail, Calendar, Github, Shield, Award, Users } from 'lucide-react';

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-40 w-full bg-slate-900 rounded-xl" />
        <Skeleton className="h-48 w-full bg-slate-900 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage and view your linked GitHub profile details.</p>
      </div>

      {/* Main card */}
      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-b border-slate-800" />
        <CardContent className="p-6 relative">
          {/* Avatar positioning */}
          <div className="absolute -top-12 left-6">
            <img
              src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
              alt={profile?.username}
              className="w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-900 shadow-xl"
            />
          </div>

          <div className="pt-14 space-y-6">
            {/* User name & role */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  {profile?.username}
                </h2>
                <p className="text-sm text-indigo-400 font-medium capitalize mt-0.5">{profile?.role || 'Contributor'}</p>
              </div>

              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-slate-100 rounded-lg text-sm text-slate-350 transition-colors self-start sm:self-center"
                >
                  <Github size={16} />
                  <span>GitHub Profile</span>
                </a>
              )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <div className="p-4 bg-slate-950/45 rounded-xl border border-slate-850">
                <p className="text-sm text-slate-350 italic leading-relaxed">"{profile.bio}"</p>
              </div>
            )}

            {/* Profile fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-850">
              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Mail size={16} className="text-slate-500 shrink-0" />
                <span className="truncate">{profile?.email || 'No email sync\'d'}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Calendar size={16} className="text-slate-500 shrink-0" />
                <span>Joined {new Date(profile?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Award size={16} className="text-indigo-400 shrink-0" />
                <span>Contribution Score: <strong className="text-indigo-300 font-black">{profile?.contributionScore ?? 0}</strong></span>
              </div>

              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Users size={16} className="text-slate-500 shrink-0" />
                <span>{profile?.followers ?? 0} followers &bull; {profile?.following ?? 0} following</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}