UPDATE regulars 
SET 
category_id = $3, 
name = $4, 
sum = $5,
currency = $6,
start_date = $7,
end_date = $8,
next_date = $9,
repeat_interval = $10,
repeat_every = $11,
repeat_each_weekday = $12,
repeat_each_day_of_month = $13,
repeat_each_month = $14,
repeat_on_day_num = $15,
repeat_on_weekday  = $16
WHERE user_id = $1 AND id = $2