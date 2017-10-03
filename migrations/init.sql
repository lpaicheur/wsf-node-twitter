--
-- Add the UUID extension.
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


--
-- Create the user table.
--

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);


--
-- Create the API key / token table.
--

DROP TABLE IF EXISTS tokens CASCADE;

CREATE TABLE tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  api_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);


--
-- Create the tweet table.
--

DROP TABLE IF EXISTS tweets CASCADE;

CREATE TABLE tweets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message VARCHAR(140),
  retweeted_from UUID REFERENCES tweets(id),
  user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);


--
-- Create the like table.
--

DROP TABLE IF EXISTS likes CASCADE;

CREATE TABLE likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  tweet_id UUID REFERENCES tweets(id) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);


--
-- Create the comment table.
--

DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message VARCHAR(140),
  user_id UUID REFERENCES users(id) NOT NULL,
  tweet_id UUID REFERENCES tweets(id) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);


--
-- Create the follow table.
--

DROP TABLE IF EXISTS follows CASCADE;

CREATE TABLE follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  is_following UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);
