//mysql
create database NMSTORE;
use nmstore;
CREATE table store(
	store_id INTEGER NOT NULL  AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    idcard VARCHAR(18) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    store_state INT NOT NULL,
    address VARCHAR(50) NOT NULL,
	store_img varchar(100),
    store_date DATE NOT NULL,
    primary key (store_id)
)engine=innodb default CHARSET=utf8;

//�û���
create table users(
	user_id int not null  AUTO_INCREMENT,
    username varchar(20) not null,
    headimg varchar(50),
    phone varchar(20) not null,
    pwd varchar(100) not null,
    address varchar(50) not null,
    user_type int not null,
    primary key (user_id)
)engine=innodb default CHARSET=utf8;

//�̵�-����Ա �м���
use nmstore;
create table store_users(
	su_id int not null  AUTO_INCREMENT,
    store_id int not null,
    user_id int not null,
    primary key(su_id)
)engine=innodb default CHARSET=utf8;

//��Ʒ��
use nmstore;
create table goods(
	goods_id BIGINT not null AUTO_INCREMENT,
	store_id INTEGER NOT NULL,
	goods_name varchar(20) NOT NULL,
	price float not null,
	stock float not null,
	introduce text not null,
	goods_source varchar(100) not null,
	manager varchar(50) not null,
	goods_date date not null,
	sales_num float,
	cost float not null,
	goods_state integer not null,
	primary key (goods_id),
	foreign key(store_id) references store(store_id) on   delete   cascade   on   update   cascade
) engine=innodb default CHARSET=utf8;

create table goods_images(
	images_id BIGINT not null AUTO_INCREMENT,
	goods_id BIGINT not null,
	src varchar(200),
	primary key (images_id),
	foreign key(goods_id) references goods(goods_id) on   delete   cascade   on   update   cascade
) engine=innodb default CHARSET=utf8;

//������
use nmstore;
create table orders(
	order_id BIGINT not null  AUTO_INCREMENT,
    user_id integer not null,
    store_id integer not null,
    goods_id bigint not null,
    amount float not null,
    orders_date date not null,
    username varchar(50) not null,
    address varchar(50) not null,
    manager varchar(50),
    handle_date date,
    cancel_date date,
    complete_date date,
    orders_state int not null,
    primary key(order_id),
    foreign key(user_id) references users(user_id) on   delete   cascade   on   update   cascade,
    foreign key(store_id) references store(store_id) on   delete   cascade   on   update   cascade,
    foreign key(goods_id) references goods(goods_id) on   delete   cascade   on   update   cascade
) engine=innodb default CHARSET=utf8;

//���ݱ�
use nmstore;
create table delivery(
	delivery_id int not null  AUTO_INCREMENT,
    name varchar(20),
    start_date date not null,
    end_date date,
    change_date date,
    wordker varchar(20),
    palce varchar(20),
    primary key(delivery_id)
) engine=innodb default CHARSET=utf8;

//�м���
use nmstore;
create table store_users_orders_deli(
	suod_id int not null  AUTO_INCREMENT,
    store_id int not null,
    user_id int not null,
    manager_id int not null,
    goods_id int not null,
    delivery_id int not null,
    primary key(suod_id),
    foreign key(store_id) references store(store_id),
    foreign key(user_id) references users(user_id),
    foreign key(manager_id) references users(user_id),
    foreign key(delivery_id) references delivery(delivery_id)
) engine=innodb default CHARSET=utf8;

//cars(���ﳵ)
create table cars(
	car_id BIGINT not null AUTO_INCREMENT,
	user_id integer not null,
    goods_id BIGINT not null,
    goods_num INTEGER not null,
    car_date DATE not null,
	primary key(car_id),
	foreign key(user_id) references users(user_id),
    foreign key(goods_id) references goods(goods_id)
)engine=innodb default CHARSET=utf8;


//chat
create table chat(
    chat_id BIGINT not null AUTO_INCREMENT,
    user_id integer not null,
    store_id integer not null,
    room_id varchar(100) not null,
    username VARCHAR(20) NOT NULL,
    status integer not null,
    content text,
    latest_time date not null,
    primary key(chat_id),
    foreign key(user_id) references users(user_id),
    foreign key(store_id) references store(store_id)
)engine=innodb default CHARSET=utf8;