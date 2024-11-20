SELECT r.id, r.user_id, r.category_id, r.name, ca.name AS category_name, 
ca.color, r.sum, r.currency, cu.symbol, r.start_date, r.end_date, r.next_date, 
r.repeat_interval, r.repeat_every, r.repeat_each_weekday, r.repeat_each_day_of_month, 
r.repeat_each_month, r.repeat_on_day_num, r.repeat_on_weekday 
FROM regulars r
LEFT JOIN categories ca ON r.category_id = ca.id 
JOIN currencies cu ON r.currency = cu.name 
WHERE r.user_id = $1 
ORDER BY r.start_date DESC