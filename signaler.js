const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const moment = require('moment');
const wav = require('wav');
const path = require('path');

const server = new https.createServer({
  cert: fs.readFileSync('/var/cpanel/ssl/apache_tls/example.com/combined'),
  key: fs.readFileSync('/var/cpanel/ssl/apache_tls/example.com/combined')
});
const wss = new WebSocket.Server({ server });
const port = '8089';
const audioNumPath = path.relative(__dirname, 'audionum.txt');
var fileWriter = null;
var fileWriterOn = 0;
var audioNum = 1; 

if (fs.existsSync(audioNumPath))
{	
	audioNum = fs.readFileSync(audioNumPath,'utf-8');
}

wss.on('connection', function connection(ws) 
{
	ws.on('message', function incoming(message) 
	{
		if (Buffer.isBuffer(message))
		{
			var msg = new Uint8Array(message);
			wss.clients.forEach(function (client) 
			{
				if (client !==ws && client.readyState == WebSocket.OPEN) 
				{
					client.send( msg );
				}
			});
			fileWriter.write(Buffer.from(msg.subarray(44)));
		}
		else
		{
			if (message.length > 0)
			{
				var position = message.indexOf("|");
				if (position == -1)
				{
					msg = message;
				}
				else
				{
					var name = message.substr(0, position);
					var text = message.substr(position + 1);
					var date = new Date();
					var wrapped = moment(date);
					var datetime = wrapped.format('M/D/YYYY, h:mm:ss a');
					var audioMsg;
					if (text == '<++>')
					{
						if (fileWriterOn == 1)
						{
							msg = "<p>" + name + " is responding...</p>";
						}
						else
						{
							msg = "<p>" + name + " is talking...</p>";
							fileWriter = new wav.FileWriter(audioNum + '.wav' , 
							{
								channels: 1,
								sampleRate: 44100,
								bitDepth: 16						
							});
							fileWriterOn = 1;
							fs.writeFile(audioNumPath, audioNum, 'utf-8', function(err) 
							{
								if(err) 
								{
									return console.log(err);
								}
							});
						}
					}
					else 
					{
						if (text == '<-->')
						{
							fileWriter.end();
							msg = "<p><audio controls preload='none'><source src='" + audioNum + ".wav'  type= 'audio/wav'></audio></p>\n";
							fileWriterOn = 0;
							audioNum++;
							fs.writeFile(audioNumPath, audioNum, 'utf-8', function(err) 
							{
								if(err) 
								{
									return console.log(err);
								}
							});
						}
						else
						{
							text = text.replace(/&quot;/g, "\"");
							msg = "<p>" + name + ", " + datetime + "<blockquote>" + text + "</blockquote>";
						}
					}
				}
				wss.clients.forEach(function (client) 
				{
					if (client.readyState == WebSocket.OPEN) 
					{
						client.send( msg );
					}
				});
			}
		}
	});
});

console.log ( 'audioNum: |%s|', audioNum );

server.listen( port );