SELECT date FROM expenses
WHERE regular_id = $1
ORDER BY date DESC