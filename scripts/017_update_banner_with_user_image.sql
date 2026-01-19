-- Update first banner with the user's grocery bag PNG image
UPDATE banners 
SET image_url = '/images/image.png'
WHERE id = (SELECT id FROM banners ORDER BY created_at ASC LIMIT 1);
