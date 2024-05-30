CREATE DATABASE budget;

DROP TABLE IF EXISTS users, categories, inusd, currencies, expenses, income, regulars;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(6) DEFAULT 'c7c7c7'
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

CREATE TABLE regulars (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100),
    sum NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL REFERENCES currencies(name) ON DELETE RESTRICT,
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
    currency VARCHAR(3) NOT NULL REFERENCES currencies(name) ON DELETE RESTRICT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    regular_id BIGINT REFERENCES regulars(id) ON DELETE SET NULL,
    regular_name VARCHAR(100)
);