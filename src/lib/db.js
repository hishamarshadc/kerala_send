import { supabase } from './supabase';

export async function getParcels() {
  const { data, error } = await supabase.from('parcels').select('*');
  if (error) throw error;
  return data;
}

export async function createParcel(parcel) {
  const newParcel = {
    ...parcel, // Expects customer_id to be in here
    status: 'pending'
  };
  const { data, error } = await supabase.from('parcels').insert([newParcel]).select();
  if (error) throw error;
  return data[0];
}

export async function updateParcelStatus(id, status, dp_id = null) {
  const { data: existingParcel, error: fetchError } = await supabase
    .from('parcels')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;
  if (!existingParcel) return null;

  const updateData = { status: status };
  if (dp_id) updateData.dp_id = dp_id;

  const { data, error } = await supabase.from('parcels').update(updateData).eq('id', id).select();
  if (error) throw error;

  // Create Notification if status is 'accepted'
  if (status === 'accepted') {
    const { drop_off } = existingParcel;
    const notificationMessage = `Your parcel to ${drop_off.name} has been accepted by a traveler!`;
    const { error: notificationError } = await supabase.from('notifications').insert([
      {
        parcelId: id,
        message: notificationMessage,
        read: false
      }
    ]);
    if (notificationError) throw notificationError;
  }

  return data[0];
}

export async function getNotifications() {
  const { data, error } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
}

