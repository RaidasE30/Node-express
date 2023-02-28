create table builds (
  id int4 unsigned primary key auto_increment,
  beginner varchar(256) not null,
  end_game varchar(256) not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp
);

create table characters (
  id int4 unsigned primary key auto_increment,
  lvl float4 not null,
  sex varchar(256) not null,
  build_id int4 unsigned not null unique,
  price float8 not null,
  faction varchar(256) not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (build_id) REFERENCES builds(id)
);

create table inventory (
  id int4 unsigned primary key auto_increment,
  src varchar(512) not null,
  character_id int4 unsigned not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (character_id) REFERENCES characters(id)
);
