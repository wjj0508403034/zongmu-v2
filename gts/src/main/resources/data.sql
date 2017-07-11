INSERT INTO USER (user_name, email, password, create_time, update_time, business_role,active, reset_active, sex, black, locked, login_failed_count, version)
SELECT "admin", "admin@zongmu.com","123456", NOW(), NOW(), 0, 1, 0, 1, 0, 0, 0, 1 FROM DUAL
WHERE NOT EXISTS (
	SELECT * FROM USER WHERE email = 'admin@zongmu.com'
)
LIMIT 1;