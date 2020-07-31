#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER docker;
    CREATE DATABASE tunga;
    GRANT ALL PRIVILEGES ON DATABASE tunga TO docker;
    CREATE DATABASE tunga_test;
    GRANT ALL PRIVILEGES ON DATABASE tunga_test TO docker;
EOSQL