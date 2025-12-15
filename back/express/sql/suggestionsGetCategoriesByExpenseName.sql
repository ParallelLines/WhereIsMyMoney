SELECT
    s.category_id,
    SUM(s.count) AS count,
    ca.name,
    ca.color
FROM suggestions s
LEFT JOIN categories ca ON s.category_id = ca.id
WHERE ca.user_id = $1
  AND s.name ILIKE '%' || $2 || '%'
GROUP BY
    s.category_id,
    ca.name,
    ca.color
ORDER BY
    count DESC
LIMIT 5