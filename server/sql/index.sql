DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS user_friend CASCADE;
DROP TABLE IF EXISTS user_session CASCADE;
DROP TABLE IF EXISTS bet_type CASCADE;
DROP TABLE IF EXISTS game CASCADE;
DROP TABLE IF EXISTS game_player CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS hole CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS score CASCADE;

DROP TYPE IF EXISTS game_status;
DROP TYPE IF EXISTS team_name;

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    img_url VARCHAR
);

CREATE TABLE user_session (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    hash VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT fk_user_session_id
        FOREIGN KEY(user_id)
        REFERENCES "user"(id)
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

CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    num_holes INT NOT NULL,
    img_url VARCHAR
);

CREATE TABLE hole (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    hole_num INT NOT NULL,
    par INT NOT NULL,
    distance INT,
    CONSTRAINT fk_hole_course_id
        FOREIGN KEY(course_id)
        REFERENCES course(id)
);

CREATE TYPE game_status as ENUM('setup', 'inprogress', 'complete');
CREATE TYPE bet_rate as ENUM('per_stroke', 'per_hole');

CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    course_id INT,
    bet_type_id INT NOT NULL,
    bet_amount INT NOT NULL,
    bet_rate bet_rate default('per_stroke'),
    current_hole_id INT DEFAULT(1),
    status game_status DEFAULT('inprogress'),
    game_master_id INT NOT NULL,
    CONSTRAINT fk_master_id
        FOREIGN KEY(game_master_id)
        REFERENCES "user"(id),
    CONSTRAINT fk_course_id
        FOREIGN KEY(course_id)
        REFERENCES course(id),
    constraint fk_game_current_hole_id
        FOREIGN KEY(current_hole_id)
        REFERENCES hole(id),
    CONSTRAINT fk_bet_type_id
        FOREIGN KEY(bet_type_id)
        REFERENCES bet_type(id)
);

CREATE TABLE game_player (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    balance INT NOT NULL DEFAULT(0), -- update to type currency
    CONSTRAINT fk_game_id
        FOREIGN KEY(game_id)
        REFERENCES game(id),
    CONSTRAINT fk_player_user_id
        FOREIGN KEY(user_id)
        REFERENCES "user"(id)
);


CREATE TYPE team_name as ENUM('left', 'right');
CREATE TABLE team (
    id SERIAL PRIMARY KEY,
    team team_name NOT NULL,
    game_id INT NOT NULL,
    hole_id INT NOT NULL,
    user_1_id INT NOT NULL,
    user_2_id INT NOT NULL,
    score INT,
    victory BOOLEAN,
    draw BOOLEAN,
    CONSTRAINT fk_team_game_id
        FOREIGN KEY(game_id)
        REFERENCES game(id),
    CONSTRAINT fk_team_hole_id
        FOREIGN KEY(hole_id)
        REFERENCES hole(id),
    CONSTRAINT fk_team_user_1_id
        FOREIGN KEY(user_1_id)
        REFERENCES "user"(id),
    CONSTRAINT fk_team_user_2_id
        FOREIGN KEY(user_2_id)
        REFERENCES "user"(id)
);


CREATE TABLE score (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    hole_id INT NOT NULL,
    user_id INT NOT NULL,
    score INT NOT NULL,
    CONSTRAINT fk_score_game_id
        FOREIGN KEY(game_id)
        REFERENCES game(id),
    CONSTRAINT fk_score_hole_id
        FOREIGN KEY(hole_id)
        REFERENCES hole(id),
    CONSTRAINT fk_score_user_id
        FOREIGN KEY(user_id)
        REFERENCES "user"(id)
);
