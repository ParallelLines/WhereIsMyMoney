CREATE DATABASE budget;

DROP TABLE IF EXISTS users, categories, inusd, currencies, expenses, income, regulars;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    password VARCHAR(255)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    name VARCHAR(100),
    color VARCHAR(6)
);

CREATE TABLE inusd (
    date DATE,
    currency VARCHAR(3),
    inUSD NUMERIC(10, 2),
    PRIMARY KEY (date, currency)
);

CREATE TABLE currencies (
    name VARCHAR(3) PRIMARY KEY,
    symbol VARCHAR(10)
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    category_id BIGINT REFERENCES categories(id),
    name VARCHAR(100),
    sum NUMERIC(10, 2),
    inUSD NUMERIC(10, 2),
    currency VARCHAR(3) REFERENCES currencies(name),
    date TIMESTAMP WITH TIME ZONE,
    regular_id BIGINT,
    regular_name VARCHAR(100)
);

-- CREATE TABLE regulars (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT,
--     category_id BIGINT,
--     name VARCHAR(100),
--     sum NUMERIC(10, 2),
--     currency VARCHAR(3) REFERENCES currencies(name),
--     last_time_completed 
--     pattern 
-- );

