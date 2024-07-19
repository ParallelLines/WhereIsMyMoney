WITH RECURSIVE category_tree AS ( 
    SELECT id, user_id, parent_id, name, color, 1 AS level     
    FROM categories
    WHERE parent_id IS NULL AND user_id = $1
    UNION ALL
    SELECT c.id, c.user_id, c.parent_id, c.name, c.color, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id WHERE c.user_id = $1
)
SELECT * FROM category_tree
ORDER BY level, parent_id, id