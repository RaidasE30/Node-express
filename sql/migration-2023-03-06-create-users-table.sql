create table users (
  id int4 unsigned primary key auto_increment,
  email varchar(256) not null,
  first_name varchar(256) not null,
  last_name varchar(256) not null,
  `password` varchar(256) not null,
  `role` varchar(256) not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp
);
