INSERT INTO suggestions (name, category_id, count, updated_at)
VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
ON CONFLICT (name, category_id) 
DO UPDATE SET count = suggestions.count + 1, updated_at = CURRENT_TIMESTAMP