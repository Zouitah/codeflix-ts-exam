import fs from 'fs'
import path from 'path'

function displayList(currentDir:string, option:string|null = null){

    let files = fs.readdirSync(currentDir);
    //alphabetically sort
    files.sort(function(a,b){
        return a.localeCompare(b);
    })

    files.forEach( function ( file ) {

        if(option == null){

        
            if(file[0] !== '.'){
                
                console.log(file)
            }
        }else{
            
            console.log(file)
        }
    });
}

function recursiveList(currentDir:string){

    console.log(currentDir+' :')
    
    let directories = Array()
    let files = fs.readdirSync(currentDir);

    files.sort(function(a,b){
        return a.localeCompare(b);
    })

    files.forEach( function ( file ) {

        if(file[0] !== '.'){
            
                console.log(file)
            
            if(fs.lstatSync(path.join(currentDir,file)).isDirectory()){
                directories.push(file)
            }
        }
    })
    console.log('')
    
    directories.forEach(directory => recursiveList(path.join(currentDir,directory)))


}

function myls() {


    let dir = ''
    if(process.argv.length == 2){
        
        displayList(process.cwd())
    }
    else{
        if(process.argv.length >= 3){

            if(process.argv[2] !== '-a' && process.argv[2] !== '-R'){

                if(process.argv[2].startsWith('/home/')){

                    displayList(process.argv[2])
                }
                else{

                    dir = path.join(process.cwd(),process.argv[2])

                    if(fs.existsSync(dir)){

                        displayList(dir)
                    }
                }
            }
            else{
                let functionCalled
                let option = process.argv[2]
                if(option == '-a' || option == '-R'){

                    if(option == '-a'){ functionCalled = displayList}
                    else{ functionCalled = recursiveList}
                    if(process.argv[3]){

                        if(process.argv[3].startsWith('/home/')){

                            functionCalled(process.argv[3], option)
                        }
                        else{

                            dir = path.join(process.cwd(),process.argv[3])
                            if(fs.existsSync(dir)){

                                functionCalled(dir,option)
                            }
                        }
                        
                    }
                    else{
                        
                        functionCalled(process.cwd(),option)
                    }
                }
            }
            
        }
    }
}


myls()