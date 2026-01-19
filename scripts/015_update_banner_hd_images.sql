-- Update banners with HD PNG images (transparent background product images)
UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=90&fit=crop&auto=format' WHERE id = (SELECT id FROM banners ORDER BY sort_order LIMIT 1 OFFSET 0);

UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1608198093002-ad4e005f24dc?w=800&q=90&fit=crop&auto=format' WHERE id = (SELECT id FROM banners ORDER BY sort_order LIMIT 1 OFFSET 1);

UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=90&fit=crop&auto=format' WHERE id = (SELECT id FROM banners ORDER BY sort_order LIMIT 1 OFFSET 2);

-- Insert new banners if less than 3 exist with better HD images
INSERT INTO banners (title, description, image_url, button_text, button_link, is_active, sort_order)
SELECT 'Fresh Fruits & Vegetables', 'Farm fresh produce delivered to your doorstep daily', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=90&fit=crop&auto=format', 'Shop Now', '/categories', true, 1
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE sort_order = 1);

INSERT INTO banners (title, description, image_url, button_text, button_link, is_active, sort_order)
SELECT 'Daily Grocery Order and Get Express Delivery', 'Get fresh groceries delivered in 30 minutes', 'https://images.unsplash.com/photo-1608198093002-ad4e005f24dc?w=800&q=90&fit=crop&auto=format', 'Explore Shop', '/categories', true, 2
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE sort_order = 2);

INSERT INTO banners (title, description, image_url, button_text, button_link, is_active, sort_order)
SELECT 'Premium Quality Products', 'Handpicked items from trusted suppliers', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=90&fit=crop&auto=format', 'Order Now', '/categories', true, 3
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE sort_order = 3);
