'use server';

import { createParcel, getParcels, updateParcelStatus, getNotifications } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitParcelRequest(data) {
    const parcel = await createParcel(data);
    revalidatePath('/customer');
    revalidatePath('/partner');
    return parcel;
}

export async function fetchParcels() {
    return await getParcels();
}

export async function acceptParcelRequest(id) {
    const updated = await updateParcelStatus(id, 'accepted', 'dp_user_1'); // Mock DP ID
    revalidatePath('/customer');
    revalidatePath('/partner');
    return updated;
}

export async function fetchNotifications() {
    return await getNotifications();
}
