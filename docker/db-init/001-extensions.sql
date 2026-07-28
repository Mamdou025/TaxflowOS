-- Runs automatically the first time the Postgres data volume is initialized
-- (Postgres executes every *.sql in /docker-entrypoint-initdb.d on fresh init).
--
-- The app's Drizzle schema uses the `vector` column type for pgvector-backed
-- RAG (searchCompanyDocuments). Enable the extension so `db push` can create
-- those tables. Matches the pgvector setup Replit's database has.
CREATE EXTENSION IF NOT EXISTS vector;
