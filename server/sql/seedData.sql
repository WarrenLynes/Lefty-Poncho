INSERT INTO
    bet_type(name, rules)
    VALUES('Lefty-Poncho', 'TBD');

--COPY "user"(email,password,username,first_name,last_name,img_url)
--    FROM '/Users/mr.lynes/dev/Lefty-Poncho/server/sql/users.csv'
--    WITH (
--        FORMAT csv,
--        HEADER true
--    );

COPY course(name, num_holes, img_url)
    FROM '/Users/mr.lynes/dev/Lefty-Poncho/server/sql/course.csv'
    WITH (
        FORMAT csv,
        HEADER true
    );

COPY hole(course_id, hole_num, par, distance)
    FROM '/Users/mr.lynes/dev/Lefty-Poncho/server/sql/course_holes.csv'
    WITH (
        FORMAT csv,
        HEADER true
    );