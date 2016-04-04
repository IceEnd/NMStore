//mysql
use nmstore;
CREATE table store(
	store_id INT NOT NULL  AUTO_INCREMENT,
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
);

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
)

//�̵�-����Ա �м��
use nmstore;
create table store_users(
	su_id int not null  AUTO_INCREMENT,
    store_id int not null,
    user_id int not null,
    foreign key(store_id) references store(store_id),
    foreign key(user_id) references users(user_id),
    primary key(su_id)
)

//��Ʒ��
use nmstore;
create table goods(
	goods_id BIGINT not null AUTO_INCREMENT,
	store_id INTEGER NOT NULL,
	goods_name varchar(20) NOT NULL,
	price float not null,
	stock float not null,
	introduce blog not null,
	source varchar(100) not null,
	manager varchar(50) not null,
	manager_id INTEGER NOT null,
	goods_date date not null,
	sales_num float not null,
	cost float not null,
	goods_state integer not null,
	primary key (goods_id),
	foreign key(store_id) references store(store_id)
);

create table goods_images(
	images_id BIGINT not null AUTO_INCREMENT,
	goods_id BIGINT not null,
	src varchar(200),
	primary key (images_id),
	foreign key(goods_id) references goods(goods_id)
);

//������
use nmstore;
create table orders(
	order_id BIGINT not null  AUTO_INCREMENT,
    goods varchar(50) not null,
    amount float not null,
    orders_date date not null,
    manager varchar(50),
    username varchar(50) not null,
    handle_date date,
    cancle_date date,
    complete_date date,
    delivery_id int,
    orders_state int not null,
    primary key(order_id)
)

//��ݱ�
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
)

//�м��
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
)

//cars(���ﳵ)
create table cars(
	car_id integer not null,
	user_id integer not null,
	username  varchar(20) not null
	primary key(car_id),
	foreign key(user_id) references users(user_id)
)

//users_cars_goods
create table users_cars_goods(
	usg_id bigint not null AUTO_INCREMENT,
	car_id integer not null,
	goods_id bigint not null,
	usg_date date not null,
	primary key (usg_id),
	foreign key(car_id) references cars(car_id),
	foreign key(goods_id)references goods(goods_id)
)