SELECT e.id, e.user_id, e.category_id, e.name, ca.name AS category_name, 
ca.color, e.sum, e.currency, cu.symbol, e.date, e.regular_id 
FROM expenses e 
LEFT JOIN categories ca ON e.category_id = ca.id 
JOIN currencies cu ON e.currency = cu.name 
WHERE 
    e.user_id = $1
    AND ($2::int IS NULL OR e.regular_id = $2::int)
    AND ($3::int IS NULL OR EXTRACT(YEAR  FROM e.date) = $3::int)
    AND ($4::int IS NULL OR EXTRACT(MONTH FROM e.date) = $4::int)
    AND ($5::int IS NULL OR EXTRACT(DAY   FROM e.date) = $5::int)
ORDER BY e.date DESC
LIMIT $6 OFFSET $7