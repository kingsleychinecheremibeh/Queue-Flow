'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

const QueueContext = createContext(undefined);

export function QueueProvider({ children }) {
  const [queues, setQueues] = useState([]);
  const { user } = useAuth();
  const channelRef = useRef(null);

  const safeSort = useCallback((items) => {
    return [...(items || [])].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeA - timeB;
    });
  }, []);

  // INITIAL LOAD
  useEffect(() => {
    async function initFetch() {
      const { data, error } = await supabase
        .from('queues')
        .select(`*, items:queue_entries (*, profiles:user_id (full_name))`)
        .eq('is_archived', false)
        .order('created_at', { ascending: true });

      if (!error && data) {
        const formatted = data.map(q => ({ ...q, items: safeSort(q.items) }));
        setQueues(formatted);
      }
    }
    initFetch();
  }, [safeSort]);

  // REALTIME SYNC
  useEffect(() => {
    let isMounted = true;
    const channel = supabase.channel('queue-global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_entries' }, async (payload) => {
        if (!isMounted) return;
        // ... (existing entry notification/logic remains same)
        fetchUpdatedEntries(payload); 
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queues' }, (payload) => {
        if (!isMounted) return;
        handleQueueChange(payload);
      })
      .subscribe();

    return () => { isMounted = false; supabase.removeChannel(channel); };
  }, [user?.id]);

  // --- API METHODS ---

  const createQueue = async (queueData) => {
    if (!user) return { error: { message: "User session not found" } };

    const payload = {
      queue_name: queueData.queue_name,
      category: queueData.category,
      average_service_time: parseInt(queueData.average_service_time) || 10,
      business_id: user.id,
      business_name: user.business_name || user.full_name || "Business",
      is_archived: false,
      is_open: true
    };

    const { data, error } = await supabase
      .from('queues')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Critical Create Error:", error.message);
      return { error };
    }

    setQueues(prev => [...prev, { ...data, items: [] }]);
    return { data, error: null };
  };

  const archiveQueue = async (queueId) => {
    setQueues(prev => prev.filter(q => q.id !== queueId));
    await supabase.from('queues').update({ 
      is_archived: true, 
      is_open: false, 
      archived_at: new Date().toISOString() 
    }).eq('id', queueId);
  };

  const toggleQueueStatus = async (queueId, isOpen) => {
    setQueues(prev => prev.map(q => q.id === queueId ? { ...q, is_open: isOpen } : q));
    await supabase.from('queues').update({ is_open: isOpen }).eq('id', queueId);
  };

  const completeService = async (entryId) => {
    await supabase.from('queue_entries').update({ 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    }).eq('id', entryId);
  };

  const callNext = async (queueId) => {
    const queue = queues.find(q => q.id === queueId);
    const nextItem = queue?.items?.find(i => i.status === 'waiting');
    if (nextItem) {
      await supabase.from('queue_entries').update({ 
        status: 'serving', 
        called_at: new Date().toISOString() 
      }).eq('id', nextItem.id);
    }
  };

  const joinQueue = async (queueId) => {
    const target = queues.find(q => q.id === queueId);
    if (!target || !user) return;
    await supabase.from('queue_entries').insert([{ 
      queue_id: queueId, 
      user_id: user.id, 
      business_id: target.business_id, 
      status: 'waiting' 
    }]);
  };

  const leaveQueue = async (queueId) => {
    if (!user) return;
    await supabase.from('queue_entries').delete()
      .eq('queue_id', queueId)
      .eq('user_id', user.id)
      .neq('status', 'completed');
  };

  const getQueueData = useCallback((queueId) => {
    const queue = queues.find(q => q.id === queueId);
    if (!queue) return null;
    const waitingList = queue.items?.filter(item => item.status === 'waiting') || [];
    const userEntry = queue.items?.find(item => item.user_id === user?.id && item.status !== 'completed');
    return { 
      ...queue, 
      userEntry, 
      position: userEntry ? waitingList.findIndex(i => i.id === userEntry.id) + 1 : 0, 
      waitCount: waitingList.length 
    };
  }, [queues, user?.id]);

  return (
    <QueueContext.Provider value={{ 
      queues, createQueue, archiveQueue, toggleQueueStatus, 
      completeService, callNext, joinQueue, leaveQueue, getQueueData 
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error("useQueue must be used within a QueueProvider");
  return context;
};