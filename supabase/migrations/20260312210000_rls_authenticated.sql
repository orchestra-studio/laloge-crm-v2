-- RLS policies: allow authenticated users to read all business tables
-- La Loge CRM — 2026-03-12

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'salons', 'brands', 'contacts', 'agent_actions', 'activity_log',
    'outreach', 'outreach_sequences', 'notifications', 'brand_salon_scores',
    'scoring_rules', 'pipeline_history', 'approvals', 'client_dossiers',
    'campaigns', 'work_items', 'agent_wakeup_requests'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_select_%s" ON %I', tbl, tbl);
    EXECUTE format('CREATE POLICY "authenticated_select_%s" ON %I FOR SELECT TO authenticated USING (true)', tbl, tbl);
  END LOOP;

  -- Write policies for key tables
  FOREACH tbl IN ARRAY ARRAY['salons', 'contacts', 'agent_actions', 'approvals'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_insert_%s" ON %I', tbl, tbl);
    EXECUTE format('CREATE POLICY "authenticated_insert_%s" ON %I FOR INSERT TO authenticated WITH CHECK (true)', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_update_%s" ON %I', tbl, tbl);
    EXECUTE format('CREATE POLICY "authenticated_update_%s" ON %I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;
