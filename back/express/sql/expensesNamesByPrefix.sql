SELECT name, count(*) FROM expenses
WHERE user_id = $1 AND name ILIKE $2
GROUP BY name
ORDER BY count(*) DESC