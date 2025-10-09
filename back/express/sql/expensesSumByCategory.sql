SELECT e.category_id, SUM(e.sum) AS sum, ca.name AS category_name, cu.name AS currency_name, cu.symbol AS currency_symbol
FROM expenses e
LEFT JOIN categories ca ON e.category_id = ca.id
JOIN currencies cu ON e.currency = cu.name
WHERE e.user_id = 1
GROUP BY e.category_id, ca.name, cu.name, cu.symbol
ORDER BY sum DES
