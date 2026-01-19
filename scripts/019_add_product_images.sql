-- Add images column to products table for multiple product images
-- This stores an array of image URLs as JSONB
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Update existing products to include their current image_url in the images array
UPDATE products 
SET images = jsonb_build_array(image_url) 
WHERE image_url IS NOT NULL AND (images IS NULL OR images = '[]'::jsonb);

COMMIT;
