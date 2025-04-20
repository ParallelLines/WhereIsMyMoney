CREATE DATABASE budget;

DROP TABLE IF EXISTS users, categories, inusd, currencies, expenses, regulars;
DROP TYPE IF EXISTS recurrence, weekday, month, day_num, weekday_extended;

CREATE TYPE recurrence AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
CREATE TYPE weekday AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
CREATE TYPE month AS ENUM ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec');
CREATE TYPE day_num AS ENUM ('first', 'second', 'third', 'forth', 'fifth', 'last');
CREATE TYPE weekday_extended AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'day', 'weekday', 'weekend day');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(6) DEFAULT 'c7c7c7'
);

CREATE TABLE rates (
    date DATE DEFAULT CURRENT_DATE,
    from_currency VARCHAR(8),
    to_currency VARCHAR(8),
    rate NUMERIC(18, 8),
    PRIMARY KEY (date, from_currency)
);

CREATE TABLE currencies (
    name VARCHAR(8) PRIMARY KEY,
    symbol VARCHAR(10)
);

CREATE TABLE regulars (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100),
    sum NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(8) NOT NULL REFERENCES currencies(name) ON DELETE RESTRICT,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    next_date TIMESTAMP WITH TIME ZONE,
    repeat_interval recurrence,
    repeat_every SMALLINT,
    repeat_each_weekday weekday[],
    repeat_each_day_of_month SMALLINT[],
    repeat_each_month month[],
    repeat_on_day_num day_num,
    repeat_on_weekday weekday_extended
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100),
    sum NUMERIC(10, 2) NOT NULL,
    inUSD NUMERIC(10, 2),
    currency VARCHAR(8) NOT NULL REFERENCES currencies(name) ON DELETE RESTRICT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    regular_id BIGINT REFERENCES regulars(id) ON DELETE SET NULL,
    regular_name VARCHAR(100)
);

CREATE INDEX expenses_name_index ON expenses(name varchar_pattern_ops);