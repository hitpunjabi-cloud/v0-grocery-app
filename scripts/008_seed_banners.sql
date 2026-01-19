-- Seed initial banners
INSERT INTO banners (title, subtitle, description, image_url, button_text, button_link, display_order) VALUES
  (
    'Fresh Groceries Delivered',
    'Same Day Delivery Across Dubai',
    'Shop premium fruits, vegetables, dairy and more with free delivery on orders over AED 100',
    '/placeholder.svg?height=600&width=1400',
    'Start Shopping',
    '/#products',
    1
  ),
  (
    'Summer Sale',
    'Up to 40% Off Fresh Produce',
    'Stock up on seasonal fruits and vegetables at amazing prices. Limited time offer!',
    '/placeholder.svg?height=600&width=1400',
    'View Offers',
    '/#products',
    2
  ),
  (
    'Organic & Natural',
    'Farm Fresh to Your Door',
    'Discover our range of organic and locally sourced products for a healthier lifestyle',
    '/placeholder.svg?height=600&width=1400',
    'Explore Organic',
    '/#products',
    3
  ),
  (
    'Dairy & Breakfast',
    'Start Your Day Right',
    'Fresh milk, eggs, cheese, and bakery items delivered every morning',
    '/placeholder.svg?height=600&width=1400',
    'Shop Dairy',
    '/#products',
    4
  )
ON CONFLICT DO NOTHING;
