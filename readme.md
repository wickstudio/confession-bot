# Confession Game Discord Bot

This is a Discord bot that allows users to submit anonymous or non-anonymous confessions in a specified channel. The bot ensures that confessions are logged for moderation purposes and includes a cooldown feature to prevent spamming.

## Features

- **Anonymous or Non-Anonymous Confessions**: Users can choose whether their confession is anonymous or not.
- **Cooldown System**: Users can only submit a confession every 60 minutes.
- **Confession Logging**: Confessions are logged in a specified channel for moderation.
- **Ephemeral Replies**: Users receive private confirmation messages when their confession is successfully submitted.

## Prerequisites

- Node.js v16.6.0 or higher
- Discord.js v14

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/wickstudio/confession-bot.git
    cd confession-bot
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `config.js` file in the root directory and add your bot's configuration:

    ```javascript
    module.exports = {
        token: 'YOUR_BOT_TOKEN',
        clientId: 'YOUR_CLIENT_ID',
        guildId: 'YOUR_GUILD_ID',
        logChannelId: 'LOG_CHANNEL_ID',
        allowedChannelId: 'ALLOWED_CHANNEL_ID'
    };
    ```

4. Start the bot:

    ```bash
    node index.js
    ```

## Commands

- `/start` - Begins the confession process, prompting the user to choose between an anonymous or non-anonymous confession.

## Configuration

- **token**: Your Discord bot token.
- **clientId**: The client ID of your bot.
- **guildId**: The ID of your Discord server (guild).
- **logChannelId**: The ID of the channel where confessions will be logged.
- **allowedChannelId**: The ID of the channel where users are allowed to use the `/start` command.

## Bot Usage

1. A user types `/start` in the allowed channel.
2. The bot prompts the user to choose whether their confession should be anonymous.
3. The user writes their confession and submits it.
4. The bot sends the confession to the channel and logs it in the log channel.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.