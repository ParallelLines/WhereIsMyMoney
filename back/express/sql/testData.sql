insert into users(name, password) values
    ('tania', 'secretpass'),
    ('roma', 'secretpass');

insert into categories(user_id, name, color) values
    (1, 'groceries', 'e32067'),
    (1, 'restourants', 'db769f'),
    (1, 'books', '6c87e0'),
    (2, 'books', '4568de'),
    (2, 'doctors', '02ba33'),
    (2, 'apotheke', 'dbbf04');

insert into currencies(name, symbol) values
    ('RUB', '₽'),
    ('BYN', 'Br'),
    ('PLN', 'zł'),
    ('TRY', '₺'),
    ('JPY', '¥'),
    ('KRW', '₩'),
    ('USD', '$'),
    ('EUR', '€');

insert into expenses(user_id, category_id, name, sum, currency, date) 
    values(1, 1, 'edeka', 15.58, 'EUR', CURRENT_TIMESTAMP),
    values(2, 4, 'dussman', 54.99, 'EUR', CURRENT_TIMESTAMP),
    values(1, 1, 'edeka', 15.58, 'EUR', CURRENT_TIMESTAMP),
    values(1, 1, 'edeka', 15.58, 'EUR', CURRENT_TIMESTAMP),
    values(1, 1, 'edeka', 15.58, 'EUR', CURRENT_TIMESTAMP),
    values(1, 1, 'edeka', 15.58, 'EUR', CURRENT_TIMESTAMP),
    values(1, 1, 'edeka', 15.58, 'EUR', CURRENT_TIMESTAMP);