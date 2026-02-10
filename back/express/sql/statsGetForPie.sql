WITH RECURSIVE cat_tree AS (
  SELECT
    c.id,
    c.parent_id,
    c.name,
    c.color,
    1 AS level
  FROM categories c
  WHERE c.user_id = $1
    AND c.parent_id IS NULL

  UNION ALL

  SELECT
    c.id,
    c.parent_id,
    c.name,
    c.color,
    ct.level + 1 AS level
  FROM categories c
  JOIN cat_tree ct ON ct.id = c.parent_id
  WHERE c.user_id = $1
),

months AS (
  -- month_offset: 0 = current month, 11 = 11 months ago (used only for ordering)
  -- month_num:    Jan=0 .. Dec=11 (calendar month index)
  SELECT
    gs AS month_offset,
    date_trunc('month', CURRENT_DATE) - (gs * INTERVAL '1 month') AS month_start,
    (extract(month from (date_trunc('month', CURRENT_DATE) - (gs * INTERVAL '1 month')))::int - 1) AS month_num
  FROM generate_series(0, 11) gs
),

exp_m AS (
  -- Monthly sums for last 12 months (incl current month)
  SELECT
    e.category_id,
    e.currency,
    date_trunc('month', e.date) AS month_start,
    SUM(e.sum)   AS sum,
    SUM(e.inUSD) AS sum_inusd
  FROM expenses e
  WHERE e.user_id = $1
    AND e.date >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
    AND e.date <  date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
  GROUP BY 1, 2, 3
),

year_currencies AS (
  -- Currencies that appear for the category during last 12 months
  SELECT DISTINCT category_id, currency
  FROM exp_m
),

last_year_rows AS (
  SELECT
    ct.id AS category_id,
    yc.currency,
    m.month_offset,
    m.month_num,
    COALESCE(em.sum, 0)       AS sum,
    COALESCE(em.sum_inusd, 0) AS sum_inusd
  FROM cat_tree ct
  JOIN year_currencies yc ON yc.category_id = ct.id
  CROSS JOIN months m
  LEFT JOIN exp_m em
    ON em.category_id = ct.id
   AND em.currency = yc.currency
   AND em.month_start = m.month_start
),

exp_t AS (
  -- All-time totals
  SELECT
    e.category_id,
    e.currency,
    SUM(e.sum)   AS sum,
    SUM(e.inUSD) AS sum_inusd
  FROM expenses e
  WHERE e.user_id = $1
  GROUP BY 1, 2
)

SELECT
  ct.id,
  ct.parent_id,
  ct.name,
  ct.level,
  ct.color,

COALESCE(
  (
    SELECT jsonb_agg(month_obj ORDER BY month_offset)
    FROM (
      SELECT
        MIN(lyr.month_offset) AS month_offset,
        jsonb_build_object(
          'month_num', lyr.month_num,
          'currencies',
            COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'name',      cur.name,
                  'symbol',    cur.symbol,
                  'sum',       lyr.sum,
                  'sum_inUSD', lyr.sum_inusd
                )
                ORDER BY cur.name
              ),
              '[]'::jsonb
            )
        ) AS month_obj
      FROM last_year_rows lyr
      JOIN currencies cur ON cur.name = lyr.currency
      WHERE lyr.category_id = ct.id
      GROUP BY lyr.month_num
    ) s
  ),
  '[]'::jsonb
) AS last_months_sums,

  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name',      cur.name,
          'symbol',    cur.symbol,
          'sum',       et.sum,
          'sum_inUSD', et.sum_inusd
        )
        ORDER BY cur.name
      )
      FROM exp_t et
      JOIN currencies cur ON cur.name = et.currency
      WHERE et.category_id = ct.id
    ),
    '[]'::jsonb
  ) AS all_time_sums

FROM cat_tree ct
ORDER BY ct.level, ct.parent_id NULLS FIRST, ct.name