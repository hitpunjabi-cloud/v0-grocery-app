-- Update banner images with HD PNG-style images
-- Using title to identify banners since sort_order doesn't exist

UPDATE banners 
SET image_url = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=90'
WHERE title LIKE '%Fresh%' OR title LIKE '%Fruit%' OR id = (SELECT id FROM banners ORDER BY created_at LIMIT 1);

UPDATE banners 
SET image_url = 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800&q=90'
WHERE title LIKE '%Vegetable%' OR title LIKE '%Organic%' OR id = (SELECT id FROM banners ORDER BY created_at LIMIT 1 OFFSET 1);

UPDATE banners 
SET image_url = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=90'
WHERE title LIKE '%Grocery%' OR title LIKE '%Daily%' OR title LIKE '%Delivery%' OR id = (SELECT id FROM banners ORDER BY created_at LIMIT 1 OFFSET 2);

-- Also update all banners with high quality images as fallback
UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=90' WHERE image_url IS NULL OR image_url = '';
