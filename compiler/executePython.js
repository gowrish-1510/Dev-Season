import { exec } from 'child_process';
import fs, { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonExecute = (filepath, inputstringPath) => {

  return new Promise((resolve, reject) => {
    const start = performance.now();

    // Execute python file with redirected input
    exec(`python3 ${filepath} < ${inputstringPath}`, { timeout: 5000 }, (execError, stdout, stderr) => {
      const end = performance.now();
      const execTime = (end - start).toFixed(2);

      if (execError || stderr) {
        if (execError && execError.killed) {
          // Code took too long to execute 
          return reject({ error: "Execution timed out (possible infinite loop)", stderr: "" });
        }
        return reject({ error: execError, stderr });
      }

      resolve({ stdout, estTime: execTime });
    });
  });
};

export default pythonExecute;
