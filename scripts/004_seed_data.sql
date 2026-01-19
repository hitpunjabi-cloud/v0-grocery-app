-- Seed categories
INSERT INTO categories (name, name_ar, slug, image_url, display_order) VALUES
  ('Fruits & Vegetables', 'فواكه وخضروات', 'fruits-vegetables', '/placeholder.svg?height=200&width=200', 1),
  ('Dairy & Eggs', 'ألبان وبيض', 'dairy-eggs', '/placeholder.svg?height=200&width=200', 2),
  ('Meat & Poultry', 'لحوم ودواجن', 'meat-poultry', '/placeholder.svg?height=200&width=200', 3),
  ('Bakery', 'مخبوزات', 'bakery', '/placeholder.svg?height=200&width=200', 4),
  ('Beverages', 'مشروبات', 'beverages', '/placeholder.svg?height=200&width=200', 5),
  ('Snacks', 'وجبات خفيفة', 'snacks', '/placeholder.svg?height=200&width=200', 6),
  ('Frozen Foods', 'مجمدات', 'frozen-foods', '/placeholder.svg?height=200&width=200', 7),
  ('Household', 'منزلية', 'household', '/placeholder.svg?height=200&width=200', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed products (using category IDs from the categories just inserted)
INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Fresh Bananas', 'موز طازج', 'Sweet and ripe bananas from Ecuador', 8.50, 6.99, '/placeholder.svg?height=300&width=300', id, 100, 'kg', '1kg', true
FROM categories WHERE slug = 'fruits-vegetables'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Red Apples', 'تفاح أحمر', 'Crispy red apples, perfect for snacking', 12.00, NULL, '/placeholder.svg?height=300&width=300', id, 80, 'kg', '1kg', true
FROM categories WHERE slug = 'fruits-vegetables'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Fresh Milk 1L', 'حليب طازج ١ لتر', 'Full cream fresh milk', 7.50, NULL, '/placeholder.svg?height=300&width=300', id, 200, 'piece', '1L', true
FROM categories WHERE slug = 'dairy-eggs'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Farm Fresh Eggs (30)', 'بيض مزرعة (٣٠)', 'Large farm fresh eggs', 22.00, 19.99, '/placeholder.svg?height=300&width=300', id, 50, 'pack', '30 eggs', true
FROM categories WHERE slug = 'dairy-eggs'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Chicken Breast', 'صدر دجاج', 'Fresh boneless chicken breast', 35.00, NULL, '/placeholder.svg?height=300&width=300', id, 60, 'kg', '1kg', false
FROM categories WHERE slug = 'meat-poultry'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Arabic Bread', 'خبز عربي', 'Soft traditional Arabic bread', 3.50, NULL, '/placeholder.svg?height=300&width=300', id, 150, 'pack', '6 pieces', false
FROM categories WHERE slug = 'bakery'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Orange Juice 1L', 'عصير برتقال ١ لتر', '100% pure orange juice', 14.00, 11.99, '/placeholder.svg?height=300&width=300', id, 80, 'piece', '1L', true
FROM categories WHERE slug = 'beverages'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, stock_quantity, unit, weight, is_featured) 
SELECT 
  'Water 1.5L (6 Pack)', 'مياه ١.٥ لتر (٦ عبوات)', 'Pure drinking water', 8.00, NULL, '/placeholder.svg?height=300&width=300', id, 200, 'pack', '6x1.5L', false
FROM categories WHERE slug = 'beverages'
ON CONFLICT DO NOTHING;
