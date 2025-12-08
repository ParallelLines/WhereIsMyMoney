SELECT * FROM regulars
WHERE next_date IS NOT NULL 
AND next_date <= NOW() 
ORDER BY next_date ASC