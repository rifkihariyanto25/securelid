-- Add gambar_artikel column to artikel table
ALTER TABLE public.artikel
ADD COLUMN gambar_artikel text;

-- Add comment to gambar_artikel column
COMMENT ON COLUMN public.artikel.gambar_artikel IS 'URL gambar artikel yang disimpan di storage';