import { supabase, FocusSession, SessionType, Reflection } from './supabase';

export async function createFocusSession(
  durationMinutes: number,
  sessionType: SessionType = 'focus',
  intent?: string
): Promise<FocusSession | null> {
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert({
      duration_minutes: durationMinutes,
      session_type: sessionType,
      intent: intent || null,
      completed: false,
      started_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating session:', error);
    return null;
  }

  return data;
}

export async function completeFocusSession(
  sessionId: string,
  reflection?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('focus_sessions')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      reflection: reflection || null,
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error completing session:', error);
    return false;
  }

  return true;
}

export async function getUserSessions(userId: string, days: number = 7): Promise<FocusSession[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }

  return data || [];
}

export async function createReflection(content: string, sessionId: string | null = null): Promise<Reflection | null> {
  const { data, error } = await supabase
    .from('reflections')
    .insert({
      content,
      session_id: sessionId,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating reflection:', error);
    return null;
  }

  return data;
}

export async function getUserReflections(userId: string, limit: number = 10): Promise<Reflection[]> {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching reflections:', error);
    return [];
  }

  return data || [];
}

export async function getSessionsByDate(userId: string, date: string): Promise<FocusSession[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions by date:', error);
    return [];
  }

  return data || [];
}

export async function getDailyFocusMinutes(userId: string, days: number = 7): Promise<{ date: string; minutes: number }[]> {
  const sessions = await getUserSessions(userId, days);

  const dateMap = new Map<string, number>();

  sessions.forEach((session) => {
    const date = new Date(session.created_at).toISOString().split('T')[0];
    const current = dateMap.get(date) || 0;
    dateMap.set(date, current + session.duration_minutes);
  });

  const result: { date: string; minutes: number }[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      minutes: dateMap.get(dateStr) || 0,
    });
  }

  return result;
}
