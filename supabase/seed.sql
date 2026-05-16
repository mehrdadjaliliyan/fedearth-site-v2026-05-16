-- Federation of Earth - Seed Data
-- Demo data for testing and development

-- NOTE: You must first create users via Supabase Auth UI or API
-- Then manually update the user IDs in this file before running

-- Sample community data
INSERT INTO communities (id, name, description, tier, member_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Zug Local', 'Local governance for Zug, Switzerland - birthplace of the Federation of Earth', 'local', 5),
  ('550e8400-e29b-41d4-a716-446655440002', 'Swiss Cantons', 'Regional governance for all Swiss cantons', 'regional', 12),
  ('550e8400-e29b-41d4-a716-446655440003', 'Global Federation', 'Planet-wide governance decisions', 'global', 50),
  ('550e8400-e29b-41d4-a716-446655440004', 'Geneva Local', 'Local governance for Geneva, Switzerland', 'local', 8),
  ('550e8400-e29b-41d4-a716-446655440005', 'European Region', 'Regional governance for European communities', 'regional', 25);

-- Sample proposals (Update author_id with real user IDs from your Supabase auth.users table)
-- To get user IDs: SELECT id, email FROM auth.users;

-- Example: Replace 'USER_ID_1' with actual UUID from auth.users
/*
INSERT INTO proposals (id, title, description, community_id, author_id, proposal_type, status, vote_type, signature_threshold) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'Implement Carbon Neutrality by 2030',
    'Proposal to make all Zug operations carbon neutral by 2030 through renewable energy adoption and carbon offset programs.',
    '550e8400-e29b-41d4-a716-446655440001',
    'USER_ID_1', -- Replace with actual user ID
    'popular_initiative',
    'collecting_signatures',
    'yes_no',
    3
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'Expand Public Transportation Network',
    'Expand public transportation with new routes and electric buses.',
    '550e8400-e29b-41d4-a716-446655440001',
    'USER_ID_2', -- Replace with actual user ID
    'standard',
    'voting',
    'yes_no',
    0
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'Choose New Community Logo Design',
    'Vote on the new official logo for our community.',
    '550e8400-e29b-41d4-a716-446655440004',
    'USER_ID_1', -- Replace with actual user ID
    'standard',
    'active',
    'multiple_choice',
    0
  );

-- Vote options for the proposals above
INSERT INTO vote_options (proposal_id, option_text, display_order) VALUES
  -- Carbon Neutrality (Yes/No)
  ('660e8400-e29b-41d4-a716-446655440001', 'Yes', 0),
  ('660e8400-e29b-41d4-a716-446655440001', 'No', 1),
  -- Public Transportation (Yes/No)
  ('660e8400-e29b-41d4-a716-446655440002', 'Yes', 0),
  ('660e8400-e29b-41d4-a716-446655440002', 'No', 1),
  -- Logo Design (Multiple Choice)
  ('660e8400-e29b-41d4-a716-446655440003', 'Modern Minimalist Design', 0),
  ('660e8400-e29b-41d4-a716-446655440003', 'Traditional Heraldic Design', 1),
  ('660e8400-e29b-41d4-a716-446655440003', 'Nature-Inspired Design', 2);
*/

-- Instructions for seeding:
-- 1. Create at least 2-3 test users via Supabase Auth Dashboard or signup page
-- 2. Copy their user IDs from the users table
-- 3. Uncomment and update the INSERT statements above with real user IDs
-- 4. Run this SQL in Supabase SQL Editor

-- You can also add community_members, votes, and comments after creating users
