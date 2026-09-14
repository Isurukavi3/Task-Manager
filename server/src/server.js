import 'dotenv/config';
import app from './app.js';

import { connectDb } from './db/connect.js'

const PORT = process.env.PORT || 5000;

async function start(){

  try {
    await connectDb();
    app.listen(PORT, () => {
       console.log(`Task Board API running on http://localhost:${PORT}`);
    });
  }catch(err){
    console.log('Failed to connect to mongoDB:', err.message);
    process.exit(1);
  }
} 

start();
