-- Fix auctions RLS: restrict auction creation to dealer/admin only
-- Drop all existing policies first
DROP POLICY IF EXISTS "Public can view active auctions" ON public.auctions;
DROP POLICY IF EXISTS "Seller can manage own auctions" ON public.auctions;
DROP POLICY IF EXISTS "Seller can update own auctions" ON public.auctions;
DROP POLICY IF EXISTS "Seller can delete own auctions" ON public.auctions;
DROP POLICY IF EXISTS "Admin can manage all auctions" ON public.auctions;

-- Public can view active/ended auctions
CREATE POLICY "Public can view active auctions"
  ON public.auctions FOR SELECT
  USING (status IN ('active', 'ended'));

-- Only dealer or admin can INSERT auctions
CREATE POLICY "Dealer or admin can create auctions"
  ON public.auctions FOR INSERT
  WITH CHECK (
    auth.uid() = seller_id
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.dealers d
        WHERE d.owner_id = auth.uid()
        AND d.is_active = true
      )
    )
  );

-- Seller can update own auctions
CREATE POLICY "Seller can update own auctions"
  ON public.auctions FOR UPDATE
  USING (auth.uid() = seller_id);

-- Seller can delete own auctions
CREATE POLICY "Seller can delete own auctions"
  ON public.auctions FOR DELETE
  USING (auth.uid() = seller_id);

-- Admin full access
CREATE POLICY "Admin can manage all auctions"
  ON public.auctions FOR ALL
  USING (public.is_admin());
