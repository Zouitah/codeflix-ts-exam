import readline from 'readline'
import fs from 'fs'

function mycat() {

    if(process.argv.length == 2){

        const rl = readline.createInterface({
            input: process.stdin,
          });
          
        rl.prompt(false);

        rl.on('line', (line) => {
            if(line == 'exit'){
                
                console.log('Happy New Year!')
                rl.close();
            }
            else{

                console.log(line)
            }
        })
    }
    else{
        if(process.argv[2] == '-e'){

            const entree = fs.createReadStream(process.argv[3])

            const rl = readline.createInterface({
                input: entree,
            });

            rl.on('line',function(line){
                console.log(line+'$')
            })

        }
        else{

            const rl = readline.createInterface({
                input: fs.createReadStream(process.argv[2])
            });

            rl.on('line',function(line){
                console.log(line)
            })
        }
    }
}


mycat()
