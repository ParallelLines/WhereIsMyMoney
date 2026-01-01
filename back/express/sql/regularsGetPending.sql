SELECT * FROM regulars
WHERE next_date IS NOT NULL 
AND DATE(next_date) <= DATE(NOW()) 
ORDER BY next_date ASC