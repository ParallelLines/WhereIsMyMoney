WITH RECURSIVE category_tree AS (
  SELECT id, name, color FROM categories WHERE id = $2
  UNION ALL
  SELECT c.id, c.name, c.color
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT DISTINCT 
  e.id, 
  e.user_id, 
  e.category_id, 
  e.name, 
  ct.name AS category_name, 
  ct.color, 
  e.sum, 
  e.currency, 
  cu.symbol, 
  e.date, 
  e.regular_id
FROM expenses e
INNER JOIN category_tree ct ON e.category_id = ct.id
JOIN currencies cu ON e.currency = cu.name 
WHERE 
  e.user_id = $1
  AND ($3::int IS NULL OR EXTRACT(YEAR  FROM e.date) = $3::int)
  AND ($4::int IS NULL OR EXTRACT(MONTH FROM e.date) = $4::int)
  AND ($5::int IS NULL OR EXTRACT(DAY   FROM e.date) = $5::int)
ORDER BY e.date DESC
LIMIT $6 OFFSET $7