SELECT e.id, e.user_id, e.category_id, e.name, ca.name AS category_name, 
ca.color, e.sum, e.currency, cu.symbol, e.date, e.regular_id, e.regular_name 
FROM expenses e 
LEFT JOIN categories ca ON e.category_id = ca.id 
JOIN currencies cu ON e.currency = cu.name 
WHERE e.user_id = $1 
ORDER BY e.date DESC
LIMIT $2 OFFSET $3