INSERT INTO expenses (user_id, category_id, name, sum, inUSD, currency, regular_id, date) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
RETURNING id