import { supabase, UserProfile } from './supabase';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string | null> {
  const fileName = `${userId}-${Date.now()}`;
  const { error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error('Error uploading photo:', error);
    return null;
  }

  const { data } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
  return data.publicUrl;
}
