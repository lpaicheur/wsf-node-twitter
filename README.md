You can see the project at: [https://wsf-node.herokuapp.com/](https://wsf-node.herokuapp.com/)

# To run the project
## For development
```
npm install
cp .env.example .env
docker-compose up -d
```
Edit .env and change DATABASE_URL

## For production
You need to create a environment variable with the database url such as DATABASE_URL=db_url and set NODE_ENV to production
```
npm install
docker-compose -f production.yml up
```
Or if you have node 8
```
npm install
node app/index.js
```
