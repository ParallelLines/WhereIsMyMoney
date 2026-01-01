SELECT
    c.name,
    c.symbol
FROM currencies c
LEFT JOIN (
    SELECT e.currency
    FROM expenses e
    WHERE e.user_id = $1
    ORDER BY e.date DESC
    LIMIT 1
) last_expense_currency
    ON c.name = last_expense_currency.currency
LEFT JOIN (
    SELECT r.currency
    FROM regulars r
    WHERE r.user_id = $1
    ORDER BY r.start_date DESC
    LIMIT 1
) last_regular_expense_currency
    ON c.name = last_regular_expense_currency.currency
ORDER BY
    (last_expense_currency.currency IS NULL),
    (last_regular_expense_currency.currency IS NULL),
    c.name