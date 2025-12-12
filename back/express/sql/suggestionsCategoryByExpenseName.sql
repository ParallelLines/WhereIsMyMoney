SELECT 
  e.name, 
  e.category_id,
  COUNT(*) as count
FROM expenses e
GROUP BY e.name, e.category_id
ORDER BY count DESC