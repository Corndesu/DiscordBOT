import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

let lastSeenBlock = 17118687

// Create a client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Allows server-related interactions
    GatewayIntentBits.GuildMessages, // Allows message related intents
    GatewayIntentBits.MessageContent, // Access to message content
  ],
});

// Log in with the token
client.login(process.env.TOKEN);

// Listen for the test event
client.on("newTransaction", async (message) => {
  try {
    // Fetch the channel
    const channel = await client.channels.fetch("1079959840681627676");

    // Send the message
    channel.send(message);
  } catch (error) {
    console.error(error);
  }
});

// Run this code every 5 seconds
setInterval(async function () {
  const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=0x213f6b2680dce3e4d0924acff3e4e34520ef9ba1&startblock=${lastSeenBlock}&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.ETHERSCANAPIKEY}`);
  const data = await response.json();

  if(data.result[0].blockNumber === lastSeenBlock) {
    console.log('No new transactions')
  } else {
    data.result.forEach( element => {
      let IO = ''

      if(element.to === '0x213f6b2680dce3e4d0924acff3e4e34520ef9ba1') {
        IO = "✅ IN Transaction 🍆"
      } else {
        IO = "🚫 OUT Transaction 🍩"
      }
      const message = `${IO}\nhttps://etherscan.io/tx/${element.hash}`
      client.emit("newTransaction", message);
    })
  }

  lastSeenBlock = data.result[0].blockNumber

}, 5000);
