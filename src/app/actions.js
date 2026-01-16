'use server';

import { createParcel, getParcels, updateParcelStatus, getNotifications } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function checkSupabaseConnection() {
    const { count, error } = await supabase
        .from('parcels')
        .select('id', { count: 'exact', head: true });

    return { count, error };
}

export async function setupDemoData() {
    let customerId, dpId;

    // 1. Check for/create Demo Customer
    let { data: customer, error: customerError } = await supabase
        .from('customer')
        .select('id')
        .eq('name', 'Demo User')
        .single();

    if (customerError && customerError.code !== 'PGRST116') { // PGRST116 = 'exact-single-row-not-found'
        throw new Error(`Error checking for customer: ${customerError.message}`);
    }
    
    if (!customer) {
        const { data: newCustomer, error: newCustomerError } = await supabase
            .from('customer')
            .insert({ name: 'Demo User' })
            .select('id')
            .single();
        if (newCustomerError) throw new Error(`Error creating customer: ${newCustomerError.message}`);
        customerId = newCustomer.id;
    } else {
        customerId = customer.id;
    }

    // 2. Check for/create Demo DP
    let { data: dp, error: dpError } = await supabase
        .from('dp')
        .select('id')
        .eq('name', 'Demo DP')
        .single();

    if (dpError && dpError.code !== 'PGRST116') {
        throw new Error(`Error checking for DP: ${dpError.message}`);
    }

    if (!dp) {
        const { data: newDp, error: newDpError } = await supabase
            .from('dp')
            .insert({ name: 'Demo DP' })
            .select('id')
            .single();
        if (newDpError) throw new Error(`Error creating DP: ${newDpError.message}`);
        dpId = newDp.id;
    } else {
        dpId = dp.id;
    }

    return { customerId, dpId };
}

export async function submitParcelRequest(data) {
    const parcel = await createParcel(data);
    revalidatePath('/customer');
    revalidatePath('/partner');
    return parcel;
}

export async function fetchParcels() {
    return await getParcels();
}

export async function acceptParcelRequest(id, dp_id) {
    const updated = await updateParcelStatus(id, 'accepted', dp_id);
    revalidatePath('/customer');
    revalidatePath('/partner');
    return updated;
}

export async function fetchNotifications() {
    return await getNotifications();
}
