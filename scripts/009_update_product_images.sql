-- Update product images with realistic grocery images
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Fresh Bananas';
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Red Apples';
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Fresh Milk 1L';
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name LIKE '%Eggs%';
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Chicken Breast';
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Arabic Bread';
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Orange Juice 1L';
UPDATE products SET image_url = '/placeholder.svg?height=400&width=400' WHERE name LIKE '%Water%';

-- Update category images
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'fruits-vegetables';
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'dairy-eggs';
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'meat-poultry';
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'bakery';
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'beverages';
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'snacks';
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'frozen-foods';
UPDATE categories SET image_url = '/placeholder.svg?height=200&width=200' WHERE slug = 'household';
