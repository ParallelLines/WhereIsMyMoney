INSERT INTO regulars (
    user_id, category_id, name, sum, currency, 
    start_date, end_date, next_date, repeat_interval, repeat_every, 
    repeat_each_weekday, repeat_each_day_of_month, repeat_each_month, 
    repeat_on_day_num, repeat_on_weekday) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
RETURNING id