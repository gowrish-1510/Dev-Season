import { exec } from 'child_process';
import fs, { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, `output/cpp`);
if (!existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const cppExecute = (filepath, inputstringPath) => {
  const jobid = path.basename(filepath).split(".")[0];
  const outpath = path.join(outputPath, `${jobid}.exe`);

  return new Promise((resolve, reject) => {
    // compiling the C++ code
    exec(`g++ ${filepath} -o ${outpath}`, (compileError, compileStdout, compileStderr) => {
      if (compileError || compileStderr) {
        return reject({ error: compileError, stderr: compileStderr });
      }

      // Execute the compiled program and measure execution time
      const start = performance.now();
      exec(`cd ${outputPath} && ${jobid} < ${inputstringPath}`,{timeout:5000}, (execError, stdout, stderr) => {
        const end = performance.now();
        const execTime = (end - start).toFixed(2);

        if (execError || stderr) {
          if(execError.killed){  //if code ran for a long time(>5000 ms) due to infinite loop or any other reason
            return reject({ error: "Execution timed out (possible infinite loop)", stderr: "" });
          }  
          return reject({ error: execError, stderr });
        }

        resolve({ stdout, estTime: execTime });
      });
    });
  });
};

export default cppExecute;