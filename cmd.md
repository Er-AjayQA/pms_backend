<!-- Run Migrations -->

npx sequelize-cli db:migrate

<!-- Undo last Migration (Single) -->

npx sequelize-cli db:migrate:undo

<!-- Undo all Migrations (All) -->

npx sequelize-cli db:migrate:undo:all

<!-- Create new Migration (Single) -->

npx sequelize-cli migration:generate --name create-users

<!-- Run Seeders (All) -->

npx sequelize-cli db:seed:all

<!-- Undo the last seeder (Single) -->

npx sequelize-cli db:seed:undo

<!-- Undo all seeders (All) -->

npx sequelize-cli db:seed:undo:all

<!-- Create a seeder (Single) -->

npx sequelize-cli seed:generate --name demo-user

<!-- Check your Sequelize CLI version -->

npx sequelize-cli --version
