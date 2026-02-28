-- =====================================================
-- SQL COMMANDS TO FIX ESTIMATED TIME NOT SHOWING
-- =====================================================

-- 1. Add the average_service_time column to queues table (if it doesn't exist)
ALTER TABLE public.queues 
ADD COLUMN IF NOT EXISTS average_service_time INTEGER DEFAULT 10;

-- 2. Update existing queues that have NULL values to have a default of 10 minutes
UPDATE public.queues 
SET average_service_time = 10 
WHERE average_service_time IS NULL;

-- 3. Verify the column was added correctly
SELECT queue_name, average_service_time FROM public.queues LIMIT 10;

-- =====================================================
-- INSTRUCTIONS TO RUN:
-- =====================================================
-- 1. Open your Supabase dashboard
-- 2. Go to the SQL Editor
-- 3. Copy and paste the commands above
-- 4. Click "Run" to execute
--
-- After running, refresh your app and check the browser
-- console (F12) to see the debug logs showing the
-- average_service_time values being loaded from the database.
