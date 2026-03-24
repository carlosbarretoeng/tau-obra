import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // These should be in environment variables
    const supabaseUrl = 'https://rslsdauakvnjwhwgsmkp.supabase.co';
    const supabaseKey = 'sb_publishable_VfYlQdutKMTwtqqsguPOTA_oGEcxmMn';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  get auth() {
    return this.supabase.auth;
  }

  get client() {
    return this.supabase;
  }
}