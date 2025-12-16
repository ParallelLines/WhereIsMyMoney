SELECT 
    s.name, 
    SUM(s.count) as count
FROM suggestions s
LEFT JOIN categories ca ON s.category_id = ca.id
WHERE ca.user_id = $1 
    AND s.name ILIKE '%' || $2 || '%'
GROUP BY s.name
ORDER BY 
    (s.name ILIKE $2 || '%') DESC, 
    count DESC
LIMIT 10