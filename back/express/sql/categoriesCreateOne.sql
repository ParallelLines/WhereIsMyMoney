INSERT INTO categories (user_id, name, parent_id, color) 
VALUES ($1, $2, $3, $4) 
RETURNING id