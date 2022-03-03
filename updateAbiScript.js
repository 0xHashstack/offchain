

const fs = require('fs')
const https = require('https')
const unzipper = require ('unzipper')

const dest  = './contracts-abi.zip'
const url = 'https://codeload.github.com/0xHashstack/Open-contracts/zip/refs/heads/development'

const AdmZip = require("adm-zip");
const path = require("path");

const fse = require('fs-extra');
const srcDir = `./contracts-abi_extracted/Open-contracts-development/abi/backend`;
const destDir = `./blockchain1/abis`;

const simpleGit = require("simple-git");
const git = simpleGit.default();

function download(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};



// unzipping the folder



function extractArchive(filepath) {
  try {
    const zip = new AdmZip(filepath);
     console.log(zip,"zip")
    const outputDir = `${path.parse(filepath).name}_extracted`;
    zip.extractAllTo(outputDir);

    console.log(`Extracted to "${outputDir}" successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}


async function gitupdate() {
    try {
      const status = await git.status();
    console.log("status1",status)
    //   if (!status.isClean()) {
    //     console.log("status2",status)
    //     return;
    //    }

    await fse.remove('contracts-abi.zip')

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
      const status = await git.status();
   
     if (status.conflicted.length > 0) {
       return;
      }
      console.log("status3",status)
       console.log(error);
      }
    }


    // Download latest archive from GitHub to temp folder
    download(url, dest, function(){
        console.log('Done')
    })
    // unzipping the folder
    extractArchive(dest);
    //copying abis from contarcts-abi to blockchain abi
    
   
    
    fse.move(srcDir, destDir, { overwrite: true } , function (err) {
        if (err) {                 
          console.error("at err3",err);      // add if you want to replace existing folder or file with same name
        } else {
         //delete the contract-abi.zip and contracts-abi_extracted
         
          console.log("success!");
        }
      });
      
      fse.remove('./contracts-abi_extracted')
      
     
      

    gitupdate()
    