# telegram-storage

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](./CONTRIBUTING.md)

## About <a name = "about"></a>

This project is a simple telegram storage example. You can upload files up to 20MB and store them in any telegram chat.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up. You can run the project on any machine with nodejs installed.

### Prerequisites

You need to have nodejs installed on your machine. You can download it from [here](https://nodejs.org/en/download/).

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - 
sudo apt-get install -y nodejs
```

### Installing

First, you need to clone the repository.

```bash
git clone https://github.com/Qurbonsaid/telegram-storage.git
```

Then, you need to install the dependencies.

```bash
npm install
```

After that, you need to create a `.env` file in the root directory of the project. You need to add the following variables to the file.

```env
PORT=8080
# Get the token from the [BotFather](https://t.me/botfather)
BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ
# Get the chat id of the chat you want to store files in
CHAT_ID=-100234567890
```

Finally, you can run the project.
For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

## Usage <a name = "usage"></a>

Open your browser and go to `http://localhost:8080/api-docs`. You will see swagger documentation. You can test the endpoints from there.
