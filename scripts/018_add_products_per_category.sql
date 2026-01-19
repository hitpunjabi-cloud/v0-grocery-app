-- Add 8 products to each category
-- First, let's get category IDs and add products

-- Fruits & Vegetables products
INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, unit, weight, stock_quantity, is_active, is_featured)
SELECT 
  name, name_ar, description, price, sale_price, image_url,
  (SELECT id FROM categories WHERE slug = 'fruits-vegetables' LIMIT 1),
  unit, weight, stock_quantity, true, is_featured
FROM (VALUES
  ('Fresh Bananas', 'موز طازج', 'Sweet ripe bananas, perfect for smoothies', 4.99, 3.99, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 'kg', '1kg', 100, true),
  ('Red Apples', 'تفاح أحمر', 'Crispy and sweet red apples', 8.99, NULL, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 'kg', '1kg', 80, false),
  ('Fresh Oranges', 'برتقال طازج', 'Juicy Valencia oranges', 6.99, 5.49, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', 'kg', '1kg', 90, true),
  ('Organic Tomatoes', 'طماطم عضوية', 'Vine-ripened organic tomatoes', 5.99, NULL, 'https://images.unsplash.com/photo-1546470427-227c7369a9b9?w=400', 'kg', '500g', 120, false),
  ('Fresh Cucumbers', 'خيار طازج', 'Crispy green cucumbers', 3.99, NULL, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', 'kg', '500g', 100, false),
  ('Green Bell Peppers', 'فلفل أخضر', 'Fresh green bell peppers', 7.99, 6.49, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', 'kg', '500g', 75, false),
  ('Fresh Carrots', 'جزر طازج', 'Sweet organic carrots', 4.49, NULL, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 'kg', '1kg', 85, false),
  ('Broccoli', 'بروكلي', 'Fresh green broccoli heads', 9.99, 7.99, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400', 'piece', '1pc', 60, true)
) AS v(name, name_ar, description, price, sale_price, image_url, unit, weight, stock_quantity, is_featured)
ON CONFLICT DO NOTHING;

-- Dairy & Eggs products
INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, unit, weight, stock_quantity, is_active, is_featured)
SELECT 
  name, name_ar, description, price, sale_price, image_url,
  (SELECT id FROM categories WHERE slug = 'dairy-eggs' LIMIT 1),
  unit, weight, stock_quantity, true, is_featured
FROM (VALUES
  ('Fresh Milk 1L', 'حليب طازج 1 لتر', 'Full cream fresh milk', 7.99, 6.49, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 'liter', '1L', 200, true),
  ('Farm Fresh Eggs (30)', 'بيض مزرعة (30)', 'Free range farm eggs', 19.99, 16.99, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', 'tray', '30pcs', 150, true),
  ('Greek Yogurt', 'زبادي يوناني', 'Creamy Greek style yogurt', 12.99, NULL, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 'pack', '500g', 80, false),
  ('Cheddar Cheese Block', 'جبنة شيدر', 'Aged cheddar cheese', 24.99, 21.99, 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', 'pack', '400g', 60, false),
  ('Butter Unsalted', 'زبدة غير مملحة', 'Pure unsalted butter', 14.99, NULL, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', 'pack', '250g', 100, false),
  ('Cream Cheese', 'جبنة كريمية', 'Smooth spreadable cream cheese', 11.99, 9.99, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', 'pack', '200g', 70, false),
  ('Low Fat Milk', 'حليب قليل الدسم', 'Skimmed low fat milk', 6.99, NULL, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'liter', '1L', 120, false),
  ('Mozzarella Cheese', 'جبنة موزاريلا', 'Fresh mozzarella for pizza', 18.99, 15.99, 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=400', 'pack', '250g', 90, true)
) AS v(name, name_ar, description, price, sale_price, image_url, unit, weight, stock_quantity, is_featured)
ON CONFLICT DO NOTHING;

-- Meat & Poultry products
INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, unit, weight, stock_quantity, is_active, is_featured)
SELECT 
  name, name_ar, description, price, sale_price, image_url,
  (SELECT id FROM categories WHERE slug = 'meat-poultry' LIMIT 1),
  unit, weight, stock_quantity, true, is_featured
FROM (VALUES
  ('Chicken Breast', 'صدر دجاج', 'Fresh boneless chicken breast', 29.99, 24.99, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', 'kg', '1kg', 80, true),
  ('Lamb Chops', 'ريش غنم', 'Premium lamb chops', 89.99, NULL, 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400', 'kg', '1kg', 40, true),
  ('Beef Mince', 'لحم بقري مفروم', 'Lean ground beef', 44.99, 39.99, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', 'kg', '500g', 100, false),
  ('Whole Chicken', 'دجاج كامل', 'Fresh whole chicken', 24.99, NULL, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', 'piece', '1.2kg', 60, false),
  ('Beef Steak', 'ستيك بقري', 'Premium ribeye steak', 79.99, 69.99, 'https://images.unsplash.com/photo-1588347818036-558601350947?w=400', 'kg', '500g', 45, true),
  ('Chicken Wings', 'أجنحة دجاج', 'Fresh chicken wings', 19.99, NULL, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', 'kg', '1kg', 90, false),
  ('Turkey Breast', 'صدر ديك رومي', 'Sliced turkey breast', 34.99, 29.99, 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400', 'pack', '400g', 50, false),
  ('Lamb Leg', 'فخذ غنم', 'Bone-in lamb leg', 99.99, NULL, 'https://images.unsplash.com/photo-1608039783021-6a856e3e9d68?w=400', 'kg', '2kg', 30, false)
) AS v(name, name_ar, description, price, sale_price, image_url, unit, weight, stock_quantity, is_featured)
ON CONFLICT DO NOTHING;

-- Bakery products
INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, unit, weight, stock_quantity, is_active, is_featured)
SELECT 
  name, name_ar, description, price, sale_price, image_url,
  (SELECT id FROM categories WHERE slug = 'bakery' LIMIT 1),
  unit, weight, stock_quantity, true, is_featured
FROM (VALUES
  ('Whole Wheat Bread', 'خبز قمح كامل', 'Fresh baked whole wheat loaf', 8.99, 6.99, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 'loaf', '500g', 100, true),
  ('Croissants (4pc)', 'كرواسون (4 قطع)', 'Buttery French croissants', 14.99, NULL, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 'pack', '4pcs', 80, true),
  ('Baguette', 'باغيت', 'Crispy French baguette', 6.99, 5.49, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', 'piece', '1pc', 90, false),
  ('Chocolate Muffins', 'مافن شوكولاتة', 'Double chocolate chip muffins', 12.99, NULL, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', 'pack', '4pcs', 60, false),
  ('Cinnamon Rolls', 'لفائف القرفة', 'Glazed cinnamon rolls', 16.99, 13.99, 'https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?w=400', 'pack', '6pcs', 50, true),
  ('Sourdough Bread', 'خبز العجين المخمر', 'Artisan sourdough loaf', 11.99, NULL, 'https://images.unsplash.com/photo-1585478259715-876acc5be8fc?w=400', 'loaf', '600g', 70, false),
  ('Pita Bread', 'خبز بيتا', 'Soft Arabic pita bread', 4.99, NULL, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400', 'pack', '6pcs', 120, false),
  ('Danish Pastry', 'دانش', 'Fruit topped Danish pastries', 9.99, 7.99, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400', 'pack', '4pcs', 55, false)
) AS v(name, name_ar, description, price, sale_price, image_url, unit, weight, stock_quantity, is_featured)
ON CONFLICT DO NOTHING;

-- Beverages products
INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, unit, weight, stock_quantity, is_active, is_featured)
SELECT 
  name, name_ar, description, price, sale_price, image_url,
  (SELECT id FROM categories WHERE slug = 'beverages' LIMIT 1),
  unit, weight, stock_quantity, true, is_featured
FROM (VALUES
  ('Orange Juice 1L', 'عصير برتقال 1 لتر', 'Fresh squeezed orange juice', 12.99, 9.99, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', 'bottle', '1L', 100, true),
  ('Mineral Water 6pk', 'مياه معدنية 6 عبوات', 'Natural mineral water pack', 9.99, NULL, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', 'pack', '6x500ml', 200, false),
  ('Green Tea Box', 'شاي أخضر', 'Organic green tea bags', 15.99, 12.99, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'box', '25bags', 80, false),
  ('Coffee Beans', 'حبوب قهوة', 'Premium Arabica coffee beans', 49.99, 42.99, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 'pack', '500g', 60, true),
  ('Apple Juice', 'عصير تفاح', '100% pure apple juice', 11.99, NULL, 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=400', 'bottle', '1L', 90, false),
  ('Coconut Water', 'ماء جوز الهند', 'Natural coconut water', 8.99, 6.99, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', 'bottle', '500ml', 70, false),
  ('Energy Drink 4pk', 'مشروب طاقة', 'Sugar-free energy drinks', 24.99, NULL, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400', 'pack', '4x250ml', 110, false),
  ('Sparkling Water', 'مياه فوارة', 'Sparkling mineral water', 6.99, 5.49, 'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=400', 'bottle', '750ml', 85, true)
) AS v(name, name_ar, description, price, sale_price, image_url, unit, weight, stock_quantity, is_featured)
ON CONFLICT DO NOTHING;

-- Pantry products
INSERT INTO products (name, name_ar, description, price, sale_price, image_url, category_id, unit, weight, stock_quantity, is_active, is_featured)
SELECT 
  name, name_ar, description, price, sale_price, image_url,
  (SELECT id FROM categories WHERE slug = 'pantry' LIMIT 1),
  unit, weight, stock_quantity, true, is_featured
FROM (VALUES
  ('Basmati Rice', 'أرز بسمتي', 'Premium long grain basmati', 29.99, 24.99, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'bag', '5kg', 100, true),
  ('Extra Virgin Olive Oil', 'زيت زيتون بكر', 'Cold pressed olive oil', 39.99, NULL, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 'bottle', '1L', 80, true),
  ('Organic Honey', 'عسل عضوي', 'Pure organic honey', 34.99, 29.99, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', 'jar', '500g', 60, false),
  ('Pasta Spaghetti', 'معكرونة اسباغيتي', 'Italian durum wheat pasta', 8.99, NULL, 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400', 'pack', '500g', 150, false),
  ('Tomato Sauce', 'صلصة طماطم', 'Italian tomato passata', 7.99, 5.99, 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400', 'jar', '400g', 120, false),
  ('Peanut Butter', 'زبدة الفول السوداني', 'Creamy peanut butter', 19.99, NULL, 'https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=400', 'jar', '340g', 70, false),
  ('Canned Tuna', 'تونة معلبة', 'Chunk light tuna in water', 9.99, 7.99, 'https://images.unsplash.com/photo-1558985212-d167b4cf4c86?w=400', 'can', '185g', 200, false),
  ('Breakfast Cereal', 'حبوب الإفطار', 'Whole grain breakfast cereal', 17.99, 14.99, 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=400', 'box', '375g', 90, true)
) AS v(name, name_ar, description, price, sale_price, image_url, unit, weight, stock_quantity, is_featured)
ON CONFLICT DO NOTHING;
