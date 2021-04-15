import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import dotenv from 'dotenv';
import { resolve as resolvePath } from 'path';
import App from './app';

import express from 'express';
import path from 'path';
const app = express();
const port = 3000;
app.use(express.urlencoded());
app.use(express.json());

app.get('/change', (req: any, res: any) => {
  res.sendFile(path.join(__dirname + '/index2.html'));
});

app.post('/post',(req: any,res: any)=>{
    //console.log("I got",req.body)
    res.send('saved');
});

app.listen(port, () => {
  //console.log(`Example app listening at http://localhost:${port}`)
});

// add some generic error handlers here, to log any exceptions we're not expecting
//process.on('uncaughtException', err => console.log('uncaughtException', err));
//process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));

// Read .env if file exists
dotenv.config();

// This function starts the MRE server. It will be called immediately unless
// we detect that the code is running in a debuggable environment. If so, a
// small delay is introduced allowing time for the debugger to attach before
// the server starts accepting connections.
function runApp() {
	// Start listening for connections, and serve static files.
	const server = new MRE.WebHost({
		baseDir: resolvePath(__dirname, '../public')
	});

	// Handle new application sessions
	server.adapter.onConnection(context => new App(context));
}

// Check whether code is running in a debuggable watched filesystem
// environment and if so, delay starting the app by one second to give
// the debugger time to detect that the server has restarted and reconnect.
// The delay value below is in milliseconds so 1000 is a one second delay.
// You may need to increase the delay or be able to decrease it depending
// on the speed of your machine.
const delay = 1000;
const argv = process.execArgv.join();
const isDebug = argv.includes('inspect') || argv.includes('debug');

if (isDebug) {
	setTimeout(runApp, delay);
} else {
	runApp();
}
