# Bitsbon Auto Claim Faucet Script

Script to automatically roll and claim coins every 10 minutes.

## Features

- Non-Expiring Cookies
- Login using `Email` and `Password`
- Real-time balance monitoring
- Express server for status monitoring
- Auto restart if the server died/exited (uses cluster)

## Prerequisites

- Node.js (Target Ver.: v22, Min.: v14)
- npm (Node Package Manager) or yarn (Yarn Package Manager)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/lester51/bitsbon-auto-claim.git
   cd bitsbon-auto-claim
   ```

2. Install dependencies:

   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up the environment variables:
   - Copy the `.env.example` or file to `.env`:
     ```
     cp .env.example .env
     ```
   - Edit the `.env` file and replace test values with your actual credentials or tokens
   - You can get `API_KEY` here in [Scrapingbee](https://app.scrapingbee.com/account/login)
   - Optionally, you can change the `PORT` if you want the server to run on a different port

## Usage

To start the Bitsbon Auto Claim Script:

```
npm start
```

## API Endpoints

- `GET /`: Returns a simple message indicating that the server is running

## Important Notes

- This tool is designed for educational purposes only. Use it responsibly and in accordance with the terms of service of the target website.
- Keep your information secure and do not share it with others.
- The tool uses a custom logging system. Check the console output for real-time updates and any error messages.

## License

This project is licensed under the MIT License.

## Author

[lester51](https://github.com/lester51)

## Disclaimer

This project is not affiliated with or endorsed by Bitsbon.com. Use at your own risk.