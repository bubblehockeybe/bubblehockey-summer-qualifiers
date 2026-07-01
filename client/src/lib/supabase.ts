import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mqxidisqsiebqgmypbsj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_osKfEwnkuFhP7TIhj_UXgA_5x0m8RD4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const ADMIN_EMAIL = "romain.ma@gmail.com";
