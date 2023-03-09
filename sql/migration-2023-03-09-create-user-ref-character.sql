set SQL_SAFE_UPDATES = 0;

insert into users (email, password, first_name, last_name) values
('test2@gmail.com', '$2b$05$XpAbe6hvlL9ObmADeO1Dd.089uztgQvUEy4kJMqobxJLnp61.9pPK', 'test', 'test');

SET @temp_user_id = LAST_INSERT_ID();

alter table characters
add user_Id int4 unsigned,
add foreign key (user_id) references users(id);

update characters
set user_id = @temp_user_id;

alter table characters
modify user_id int4 unsigned not null;
