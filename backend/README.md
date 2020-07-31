# Tunga Backend

## Kurulum - Docker

```bash
docker run -p 8080:8080 tahtaciburak/tunga-backend:v1
```

## Kurulum - Native
### Temel Adımlar

1. Fork/Clone
1. Yeni bir virtualenv oluşturun
1. Gerekli paketleri yükleyin

### Çalışmak İstediğiniz Ortamı Seçin


```sh
$ export APP_SETTINGS="project.server.config.DevelopmentConfig"
```

veya

```sh
$ export APP_SETTINGS="project.server.config.ProductionConfig"
```

Bir SECRET_KEY belirleyin:

```sh
$ export SECRET_KEY="c0k_6i2iLiyM_BuL4m4n_b3ni"
```

### Veritabanını Oluşturun

Veritabanı olarak postgresql kullanılmaktadır. Bu bağlamda sisteminizde çalışan bir postgres olduğundan emin olun.

```sh
$ psql
# create database tunga
# create database flask_jwt_auth_test
# \q
```

Aşağıdaki komutları çalıştırarak veritabanı şemalarını oluşturun:

```sh
$ python manage.py create_db
$ python manage.py db init
$ python manage.py db migrate
```

### Uygulamayı Çalıştırın

> ```sh
> $ python manage.py runserver -h 0.0.0.0 -p 8080
> ```
