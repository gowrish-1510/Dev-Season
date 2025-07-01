import {exec} from 'child_process';
import fs, { existsSync } from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import { stderr, stdin, stdout } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath= path.join(__dirname,`output/cpp`);
if(!existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true});
}


const cppExecute= (filepath,inputstringPath)=>{
    const jobid= path.basename(filepath).split(".")[0];
    const outpath= path.join(outputPath,`${jobid}.exe`);

    return new Promise((resolve,reject)=>{
        exec(
            `g++ ${filepath} -o ${outpath} && cd ${outputPath} && ${jobid} < ${inputstringPath}`,(error,stdout,stderr)=>{
                if(error){
                    reject({error,stderr});
                }
                
                if(stderr){
                    reject(stderr);
                }

                resolve(stdout);
            }
        )
    });
}

export default cppExecute;