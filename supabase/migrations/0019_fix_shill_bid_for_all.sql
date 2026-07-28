-- Fix 1b: Prevent shill bidding — the FOR ALL policy in 0011 still allows INSERTs
-- because PostgreSQL ORs all matching policies. Split FOR ALL into UPDATE/DELETE only.

DROP POLICY IF EXISTS "Authenticated users can manage own bids" ON public.auction_bids;

CREATE POLICY "Authenticated users can update own bids"
  ON public.auction_bids FOR UPDATE
  USING (auth.uid() = bidder_id);

CREATE POLICY "Authenticated users can delete own bids"
  ON public.auction_bids FOR DELETE
  USING (auth.uid() = bidder_id);
