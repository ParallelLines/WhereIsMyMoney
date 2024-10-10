CREATE DATABASE budget;

DROP TABLE IF EXISTS users, categories, inusd, currencies, expenses, regulars;

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
    last_time_completed DATE,
    pattern VARCHAR(100) NOT NULL
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