WITH popcat AS (
    SELECT category_id, count(*) 
    FROM expenses 
    WHERE user_id = $1 
    GROUP BY category_id
    ) 
SELECT cat.id, cat.user_id, cat.name, cat.color, popcat.count 
FROM categories cat 
JOIN popcat ON popcat.category_id = cat.id