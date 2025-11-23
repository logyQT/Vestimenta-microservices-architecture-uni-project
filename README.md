# Stop and remove containers AND volumes

docker-compose down -v

# Start up again

docker-compose up -d --build

# Re-seed the fresh databases

docker-compose run --rm auth-seed
docker-compose run --rm products-seed
