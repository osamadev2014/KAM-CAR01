-- Fix 1: Prevent shill bidding (seller bidding on own auction)
-- Problem: "Authenticated users can manage own bids" (FOR ALL) allows INSERT
-- even though the INSERT policy blocks self-bids, because PostgreSQL ORs policies.
-- Fix: split FOR ALL into UPDATE/DELETE only, keep INSERT policy as sole gate.

DROP POLICY IF EXISTS "Authenticated users can place bids" ON public.auction_bids;
DROP POLICY IF EXISTS "Authenticated users can manage own bids" ON public.auction_bids;

CREATE POLICY "Authenticated users can place bids"
  ON public.auction_bids FOR INSERT
  WITH CHECK (
    auth.uid() = bidder_id
    AND bidder_id != (SELECT seller_id FROM public.auctions WHERE id = auction_id)
  );

CREATE POLICY "Authenticated users can manage own bids"
  ON public.auction_bids FOR UPDATE
  USING (auth.uid() = bidder_id);

CREATE POLICY "Authenticated users can delete own bids"
  ON public.auction_bids FOR DELETE
  USING (auth.uid() = bidder_id);

-- Fix 2: Auto-promote profiles.role to 'dealer' when dealers.is_active = true
CREATE OR REPLACE FUNCTION public.handle_dealer_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_active = true AND NEW.is_approved = true THEN
    UPDATE public.profiles SET role = 'dealer' WHERE id = NEW.owner_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_dealer_approval ON public.dealers;

CREATE TRIGGER on_dealer_approval
  AFTER INSERT OR UPDATE OF is_active, is_approved
  ON public.dealers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_dealer_approval();
