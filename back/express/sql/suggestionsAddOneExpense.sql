INSERT INTO suggestions (name, category_id, count)
VALUES ($1, $2, 1)
ON CONFLICT (name, category_id) 
DO UPDATE SET count = suggestions.count + 1