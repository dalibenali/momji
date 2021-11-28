# momji
1) Create databases with sql files (schema.sql for production database, test_schema.sql for test database)
2) Create .env file in theroot directory like and add your DB credentials :

    - DB_HOST= db host
    - DB_USER= db user
    - DB_PASS= db password
    - DB_PORT= db port (3306)
    - DB_NAME=momji
    - DB_TEST_NAME=test


Install dependencies : yarn install

Start server : yarn run dev

Run the tests : yarn run test

Build app : yarn run build