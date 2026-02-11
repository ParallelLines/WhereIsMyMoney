WITH RECURSIVE category_tree AS (
  SELECT id, name, color FROM categories WHERE id = $2
  UNION ALL
  SELECT c.id, c.name, c.color
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT DISTINCT 
    r.id, 
    r.user_id, 
    r.category_id, 
    r.name, 
    ct.name AS category_name, 
    ct.color, 
    r.sum, 
    r.currency, 
    cu.symbol, 
    r.start_date, 
    r.end_date, 
    r.next_date, 
    r.repeat_interval, 
    r.repeat_every, 
    r.repeat_each_weekday, 
    r.repeat_each_day_of_month, 
    r.repeat_each_month, 
    r.repeat_on_day_num, 
    r.repeat_on_weekday 
FROM regulars r
INNER JOIN category_tree ct ON r.category_id = ct.id
JOIN currencies cu ON r.currency = cu.name 
WHERE r.user_id = $1
ORDER BY r.next_date ASC