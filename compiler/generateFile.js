import fs from 'fs'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createFile = (language,code)=>{
  const codepath= path.join(__dirname,`codes/${language}`);
  const jobid= uuid();

  if(!fs.existsSync(codepath)){  //if folder doesn't exist,create one
    fs.mkdirSync(codepath,{recursive: true});
  }

  const filepath= path.join(codepath,`${jobid}.${language}`);
  fs.writeFileSync(filepath,code);
  return filepath;
}

