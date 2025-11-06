-- Fix 1: Update handle_new_user() to always default to 'student' role
-- This prevents privilege escalation by removing client control over role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Always default to 'student' role - no client input
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    'student'
  );
  
  -- Always insert as 'student' - instructor status must be granted separately
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student'::app_role);
  
  RETURN new;
END;
$function$;

-- Fix 2: Secure profiles table with proper RLS policies
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Allow anyone to view instructor profiles that have published courses
CREATE POLICY "Public can view instructor profiles with courses"
ON public.profiles FOR SELECT
USING (
  role = 'instructor' AND EXISTS (
    SELECT 1 FROM courses WHERE instructor_id = profiles.id
  )
);