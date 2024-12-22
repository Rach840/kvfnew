#!/bin/bash

# Переменные окружения


DOMAIN_NAME="kvf-tests" # необходимо заменить
# Переменные для скриптов
REPO_URL="https://github.com/harryheman/self-host-nextjs.git" # необходимо заменить
APP_DIR=~/kvfnew
SWAP_SIZE="1G"  # область подкачки в 1 Гб

# Обновляем список пакетов и существующие пакеты
sudo apt update && sudo apt upgrade -y

# Добавляем область подкачки
# https://wiki.astralinux.ru/pages/viewpage.action?pageId=48759505
echo "Добавление области подкачки..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Делаем область подкачки постоянной
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Устанавливаем Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
sudo apt update
sudo apt install docker-ce -y

# # Устанавливаем Docker Compose
# sudo rm -f /usr/local/bin/docker-compose
# sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# # Ждем полной загрузки файла
# if [ ! -f /usr/local/bin/docker-compose ]; then
#   echo "Провал загрузки Docker Compose. Завершение работы."
#   exit 1
# fi

# sudo chmod +x /usr/local/bin/docker-compose

# # Проверяем, что Docker Compose является исполняемым и существует в path
# sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# # Проверяем установку Docker Compose
# docker-compose --version
# if [ $? -ne 0 ]; then
#   echo "Провал установки Docker Compose. Завершение работы."
#   exit 1
# fi

# Запускаем Docker при старте системы и запускаем сервис Docker
sudo systemctl enable docker
sudo systemctl start docker

# Клонируем репозиторий Git
if [ -d "$APP_DIR" ]; then
  echo "Директория $APP_DIR уже существует. Извлечение последних изменений..."
  cd $APP_DIR && git pull
else
  echo "Клонирование репозитория из $REPO_URL..."
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# Создаем файл .env в директории приложения (~/myapp/.env)
echo "DATABASE_URL=mysql://rizo9235_rach3000:qwerty228337!@37.27.63.3:3306/rizo9235_kvf_tasks" > "$APP_DIR/.env"
echo "NODE_ENV=development" >> "$APP_DIR/.env"
echo "NEXTAUTH_SECRET=Ov23lilHvIs9YfXbr8Am" >> "$APP_DIR/.env"
echo "AWS_ACCESS_KEY_ID=YCAJEyh-o4mLyiDs4JwVFsphF" >> "$APP_DIR/.env"
echo "AWS_SECRET_ACCESS_KEY=YCPKZiDTXj6VJ6NSkoQ8fKRN4gAlDj5FVbhUx7k1" >> "$APP_DIR/.env"


# Устанавливаем Nginx
sudo apt install nginx -y

# Удаляем старые настройки Nginx (при наличии)
sudo rm -f /etc/nginx/sites-available/myapp
sudo rm -f /etc/nginx/sites-enabled/myapp

# Временно останавливаем Nginx для запуска Certbot в автономном режиме
sudo systemctl stop nginx

# Получаем сертификат SSL с помощью Certbot
sudo apt install certbot -y
sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL

# Проверяем наличие файлов SSL или генерируем их
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Создаем настройки Nginx с обратным прокси, поддержкой SSL,
# ограничением количества запросов и поддержкой потоковой передачи данных
sudo cat > /etc/nginx/sites-available/myapp <<EOL
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Перенаправляем все запросы HTTP на HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Включаем ограничение количества запросов
    limit_req zone=mylimit burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Отключаем буферизацию для поддержки потоков
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
}
EOL

# Создаем символическую ссылку при отсутствии
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

# Перезапускаем Nginx для применения новых настроек
sudo systemctl restart nginx

# Собираем и запускаем контейнеры Docker из директории приложения (~/myapp)
cd $APP_DIR
sudo docker-compose up -d

# Проверяем запуск Docker Compose
if ! sudo docker-compose ps | grep "Up"; then
  echo "Провал запуска контейнеров Docker. Проверьте логи с помощью 'docker-compose logs'"
  exit 1
fi

# Выводим финальное сообщение
echo "Деплой завершен. Приложение Next.js и база данных PostgreSQL запущены.
Приложение доступно по адресу: https://$DOMAIN_NAME, база данных - из веб-сервиса.

Файл .env был создан и содержит следующие значения:
- POSTGRES_USER
- POSTGRES_PASSWORD (произвольно сгенерированный)
- POSTGRES_DB
- DATABASE_URL
- SECRET_KEY
- NEXT_PUBLIC_SAFE_KEY"