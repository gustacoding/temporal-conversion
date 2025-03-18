CREATE SCHEMA IF NOT EXISTS inside;

CREATE TABLE IF NOT EXISTS inside.users_surveys_responses_aux (
  id SERIAL PRIMARY KEY,
  origin VARCHAR(255) NOT NULL,
  data_envio TIMESTAMP NOT NULL,
  response_status_id INT NOT NULL
);
