INSERT INTO suggestions (name, category_id, count)
SELECT 
  name, 
  category_id, 
  COUNT(*) as count
FROM expenses
GROUP BY name, category_id
ON CONFLICT (name, category_id) 
DO UPDATE SET count = EXCLUDED.count