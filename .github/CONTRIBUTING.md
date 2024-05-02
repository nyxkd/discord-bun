# Contributing to the project

## Setup
1. Fork & clone the repository
2. Run `bun install --frozen-lockfile` to install the dependencies
3. Run `bun db:up` to run the Docker container needed for the local hosted database
4.  Create a `.env` file in the root directory with the following contents:
    ```env
    TOKEN=YOUR_BOT_TOKEN
    DB_NAME=YOUR_POSTGRES_DB_NAME
    DB_USER=YOUR_POSTGRES_DB_USER
    DB_PASS=YOUR_POSTGRES_DB_PASS
    DB_HOST=YOUR_POSTGRES_DB_HOST
    DB_PORT=YOUR_POSTGRES_DB_PORT

    ```
    > Get your bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
5. Create a `config.json` file in the root directory with the following contents:
    ```json
    {
        "devIDs": [
            "YOUR_DISCORD_USER_ID"
        ],
        "testGuildID": "YOUR_TEST_GUILD_ID",
        "premiumRoleID": "YOUR_PREMIUM_ROLE_ID",
    }
    ```
6. Run `bun dev` to start the bot

## Making changes
* Create a new branch for your changes (`git checkout -b my-new-feature`)
* Make your changes 
* Use `bun format` to format your code using [Prettier](https://prettier.io/)
* Commit your changes (`git commit -am 'Add some feature'`)
* Push your changes to your fork (`git push origin my-new-feature`)
* Create a pull request against the `main` branch