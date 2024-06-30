const { WechatyBuilder, log } = require('wechaty');
const { PuppetPadlocal } = require('wechaty-puppet-padlocal');
const qrcodeTerminal = require('qrcode-terminal');
const schedule = require('node-schedule');

const token = 'puppet_padlocal_52d8a2c44b6a4bbf95614352ccfa4bae';  // 确保此处替换为你的有效 PadLocal Token
const groupName = '传说中的九尾狐';  // 替换为你的群组名称
const message = '大家好！我是聊天机器人，有什么问题可以随时问我。';  // 自定义你的消息内容

function onScan(qrcode, status) {
  qrcodeTerminal.generate(qrcode, { small: true });  // 在终端显示二维码
  console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`);
}

async function onLogin(user) {
  console.log(`User ${user} logged in`);
  await printAllRooms();
  setTimeout(scheduleDailyMessage, 10000);  // 延迟10秒查找群聊
}

function onMessage(message) {
  console.log(`Message: ${message}`);
  if (message.room()) {
    console.log(`Received message in room: ${message.room().topic()}`);
  }
}

const puppet = new PuppetPadlocal({
  token,
});

const bot = WechatyBuilder.build({
  name: 'wechaty-bot',
  puppet,
});

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('message', onMessage);

bot.start()
  .then(() => console.log('Bot started'))
  .catch(e => console.error(e));

async function printAllRooms() {
  try {
    console.log('Attempting to find all rooms...');
    const rooms = await bot.Room.findAll();
    if (rooms.length === 0) {
      console.log('No rooms found');
    } else {
      console.log(`Found ${rooms.length} rooms`);
      for (const room of rooms) {
        const topic = await room.topic();
        console.log(`Room: ${topic}`);
      }
    }
  } catch (error) {
    console.error('Error finding rooms:', error);
  }
}

async function scheduleDailyMessage() {
  try {
    console.log('Attempting to find the specific room...');
    const rooms = await bot.Room.findAll();
    let foundRoom = null;
    for (const room of rooms) {
      const topic = await room.topic();
      if (topic === groupName) {
        foundRoom = room;
        break;
      }
    }

    if (foundRoom) {
      console.log(`Room ${groupName} found`);
      schedule.scheduleJob('* * * * *', async () => {
        try {
          await foundRoom.say(message);
          console.log('Message sent');
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      });
    } else {
      console.log(`Room ${groupName} not found`);
    }
  } catch (error) {
    console.error('Error scheduling daily message:', error);
  }
}
