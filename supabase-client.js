require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
   throw new Error("Supabase URL and Key are required");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
