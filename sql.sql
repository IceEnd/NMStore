{
    "_id" : ObjectId("56f34e875110c39681681f7b"),
    "user_id" : 1,
    "username" : "lavender_eacho",
    "goods_id" : [ 
        1, 
        2
    ],
    "goods_name" : [ 
        "����", 
        "���"
    ],
    "goods_amount" : [ 
        12, 
        2
    ],
    "goods_date" : [ 
        "2016-03-24 08:00", 
        "2016-03-23 08:11"
    ]
}


{
    "_id" : ObjectId("56f349b65110c39681681f7a"),
    "good_id" : 1,
    "name" : "����",
    "price" : 12.5,
    "stock" : 100,
    "introduce" : "����ر�����",
    "picture" : "https://blog.coolecho.net",
    "source" : "ɽ���̾�",
    "manager" : "Cononico",
    "manager_id" : 1,
    "date" : "2016-03-24 09:57",
    "number" : 20,
    "coat" : 10
}

//mysql
use nmstore;
CREATE table store(
	store_id INT NOT NULL  AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    idcard VARCHAR(18) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    state INT NOT NULL,
    address VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
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

//�̵�-��Ʒ �м��
create table store_goods(
	sg_id BIGINT NOT Null  AUTO_INCREMENT,
    store_id int not null,
    goods_id int not null,
    foreign key(store_id) references store(store_id),
    primary key(sg_id)
)

//������
use nmstore;
create table orders(
	order_id BIGINT not null  AUTO_INCREMENT,
    goods varchar(50) not null,
    amount float not null,
    date date not null,
    manager varchar(50),
    user varchar(50) not null,
    handle_date date,
    cancle_date date,
    complete_date date,
    delivery_id int,
    state int not null,
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
