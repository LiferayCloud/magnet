create database node_api;
create table node_api.categories (id INT(11) unsigned not null auto_increment, name VARCHAR(255), primary key(id));

create database node_api_test;
create table node_api_test.categories (id INT(11) unsigned not null auto_increment, name VARCHAR(255), primary key(id));
