UPDATE regulars 
SET 
next_date = $3
WHERE user_id = $1 AND id = $2