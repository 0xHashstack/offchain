

const fs = require('fs')
const https = require('https')

const ZIP_FILE_PATH  = './contracts-abi.zip'
const url = 'https://codeload.github.com/0xHashstack/Open-contracts/zip/refs/heads/development'

const AdmZip = require("adm-zip");
const path = require("path");

const fse = require('fs-extra');
const EXTRACTED_REPO_CONTENTS = `./contracts-abi_extracted/Open-contracts-development`
const ABIS_SOURCE_DIRECTORY =  EXTRACTED_REPO_CONTENTS + `/abi/backend`;
const ABIS_DESTINATION_DIRECTORY = `./blockchain1/abis`;
const REACT_APP_DIAMOND_ADDRESS = 'REACT_APP_DIAMOND_ADDRESS';

const simpleGit = require("simple-git");
const git = simpleGit.default();

/**
 * @param {string} url 
 * @param {string} destination 
 * @returns promise for the file to be saved
 */
function _download(url , destination){
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    // TODO: P3 , check dns.lookup , edge err cases
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          return resolve(destination)
        })
      })

      file.on('error', (err) => {
        fs.unlink(destination, () => {
          return reject(err.message || 'Unknown Error' )
        })
      })

    })
  })
}

/**
 * 
 * @param {string} filepath 
 * @returns Prmoside to ectract a specified zip file
 */
function _extractArchive(filepath) {
  return new Promise(async (resolve, reject) => {
    try {
      const zip = new AdmZip(filepath);
      const outputDir = `${path.parse(filepath).name}_extracted`;
      zip.extractAllTo(outputDir);
      resolve(outputDir);
    } catch (e) {
        reject(e)
    }

  })
}


// TODO: P3 Needs cleanup
async function gitupdate() {
  await fse.remove('contracts-abi.zip')
  const status = await git.status();
    try {
    //   if (!status.isClean()) {
    //     console.log("status2",status)
    //     return;
    //    }

    // add the changed abis
     await git.add(status.not_added)
     await git.commit("updating the abis")
     await git.push('git@github.com:0xHashstack/offchain.git')
    //   await git.checkout("HOTFIX");
    //   await git.reset("hard", ["origin/HOTFIX"]);
    //   await git.pull();
   
    //    await git.checkout("staging");
    //    console.log(await git.pull());
    //   await git.reset("hard", ["origin/STAGING"]);
    //   await git.pull();
   
    //   await git.rebase(["HOTFIX"]);
    //   await git.push("origin", "STAGING", ["--force"]);
    } catch (error) {
    //   const status = await git.status();
   
     if (status.conflicted.length > 0) {
       console.log('found conflicting changes');
      }
    //   console.log("status3",status)
    console.error('Error in pushing to git ', error)
    throw new Error('Unable to push to git');

  }
}



async function safelyUpdateEnvFile(key, value) {
  const backupData = fs.readFileSync('./.env', "utf8");
  const fileLines = backupData.split('\n');
  try {
    let dataTobeUpdated = '';
    for (let line of fileLines) {
      const keys = line.split('=');
      if (keys.length) {
        if (keys[0] == key) {
          dataTobeUpdated += `${key}="${value}"\n`
        } else {
          dataTobeUpdated += line + '\n';
        }
      }
    }

    if (dataTobeUpdated) {
      dataTobeUpdated = dataTobeUpdated.slice(0,-1);
    }
    // save the new lines
    fs.writeFileSync('./.env', dataTobeUpdated);

  } catch(e) {
    // save from backup data
    fs.writeFileSync('./.env', backupData);
  }

}


async function consumeContents() {
  return new Promise(async (resolve, reject) => {
    
    const data = fs.readFileSync( EXTRACTED_REPO_CONTENTS +'/addr.js', "utf8");
    const lines = data.split('\n');
    for (let line of lines ) {
      const  [ cleanedLine ] = line.split('\r');
      if (!cleanedLine) { continue; } 
      let [key, value] = cleanedLine.split('=');
      if (!key || !value) { continue }
      key = key.trim();
      value = value.trim();
      if(key.toUpperCase() == REACT_APP_DIAMOND_ADDRESS) {
        await safelyUpdateEnvFile('ADDRESS', value);
        break;
      }
    }

    fse.move(ABIS_SOURCE_DIRECTORY, ABIS_DESTINATION_DIRECTORY, { overwrite: true } , function (err) {
        if (err) { 
           return reject(err)      // add if you want to replace existing folder or file with same name
        } else {
          fse.remove('./contracts-abi_extracted', (err) => {
            if (err) {return reject(err)}
            return resolve(ABIS_DESTINATION_DIRECTORY);
          })
        }
    });
  } )

}

      
// TODO: P2 every function call should catch errro and cleanup the mess
async function main() {

  await _download(url, ZIP_FILE_PATH);
  await _extractArchive(ZIP_FILE_PATH);
  await consumeContents();
  await gitupdate();

  console.log('Abi updation script ran successfully');

}

main()
    