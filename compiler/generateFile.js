import fs from 'fs'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createFile = (language,code,input)=>{
  const codepath= path.join(__dirname,`codes/${language}`);
  const inputpath= path.join(__dirname,"input/");
  const jobid= uuid();

  if(!fs.existsSync(codepath)){  //if folder doesn't exist,create one
    fs.mkdirSync(codepath,{recursive: true});
  }

  if(!fs.existsSync(inputpath)){  //create folder for storing inputs
    fs.mkdirSync(inputpath,{recursive:true});
  }

  const inputstringPath= path.join(inputpath,`${jobid}.txt`);
  const filepath= path.join(codepath,`${jobid}.${language}`);

  fs.writeFileSync(inputstringPath,input);
  fs.writeFileSync(filepath,code);
  return {filepath,inputstringPath};
}

