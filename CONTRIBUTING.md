# Contributing to the project

## Setup
1. Clone the repository
2. Run `bun install --frozen-lockfile` to install the dependencies
3.  Create a `.env` file in the root directory with the following contents:
    ```env
    TOKEN=YOUR_BOT_TOKEN
    ```
    > Get your bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

4. Create a `config.json` file in the root directory with the following contents:
    ```json
    {
        "devIDs": [
            "YOUR_DISCORD_USER_ID"
        ],
        "testGuildID": "YOUR_TEST_GUILD_ID",
    }
    ```
5. Run `bun dev` to start the bot

## Making changes
* Create a new branch for your changes (`git checkout -b my-new-feature`)
* Make your changes 
* Use `bun format` to format your code using [Prettier](https://prettier.io/)
* Commit your changes (`git commit -am 'Add some feature'`)
* Push your changes to your fork (`git push origin my-new-feature`)
* Create a pull request against the `main` branch