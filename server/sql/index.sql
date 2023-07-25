DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS user_friend CASCADE;
DROP TABLE IF EXISTS bet_type CASCADE;
DROP TABLE IF EXISTS game CASCADE;
DROP TABLE IF EXISTS game_player CASCADE;
DROP TABLE IF EXISTS "user_session" CASCADE;

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

CREATE TABLE user_friend (
    id SERIAL PRIMARY KEY,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT(false),
    CONSTRAINT fk_user_1
        FOREIGN KEY(user_id_1)
        REFERENCES "user"(id),
    CONSTRAINT fk_user_2
            FOREIGN KEY(user_id_2)
            REFERENCES "user"(id)
);

CREATE TABLE bet_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    rules VARCHAR(1000) NOT NULL
);

CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    course VARCHAR(50) NOT NULL,
    bet_type_id INT NOT NULL,
    bet_amount INT NOT NULL,
    CONSTRAINT fk_bet_type_id
            FOREIGN KEY(bet_type_id)
            REFERENCES bet_type(id)
);

CREATE TABLE game_player (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_game_id
        FOREIGN KEY(game_id)
        REFERENCES game(id),
    CONSTRAINT fk_player_user_id
        FOREIGN KEY(user_id)
        REFERENCES "user"(id)
);

CREATE TABLE user_session (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    hash VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT fk_user_session_id
        FOREIGN KEY(user_id)
        REFERENCES "user"(id)
);
