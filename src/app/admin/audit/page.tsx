'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { AuditLog } from '@/types';
import { Activity } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AuditPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AuditContent />
    </ProtectedRoute>
  );
}

function AuditContent() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  async function loadAuditLogs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, users(*)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-emphasis mb-2">Audit Logs</h1>
          <p className="text-text-secondary">Complete history of all platform actions</p>
        </div>

        <div className="card">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 bg-background rounded-lg animate-pulse">
                  <div className="h-4 bg-surface-elevated rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-surface-elevated rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">No audit logs found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-background rounded-lg hover:bg-surface-elevated transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`badge text-xs ${
                            log.action.includes('create')
                              ? 'badge-success'
                              : log.action.includes('delete')
                              ? 'badge-error'
                              : log.action.includes('vote') || log.action.includes('sign')
                              ? 'badge-primary'
                              : 'badge-warning'
                          }`}
                        >
                          {log.action.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-text-secondary">
                          {log.entity_type}
                        </span>
                      </div>
                      <div className="text-sm text-text-primary mb-1">
                        <span className="font-medium">{log.user?.full_name || 'System'}</span>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <span className="text-text-secondary ml-2">
                            — {JSON.stringify(log.details)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {formatDateTime(log.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
