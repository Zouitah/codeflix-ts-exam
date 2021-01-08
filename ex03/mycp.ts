import fs from 'fs'
import path from 'path'

function copyFile(src:string, dest:string){
            
    if(fs.existsSync(dest)){

        if(fs.lstatSync(dest).isFile()){

            console.log('rm')
            fs.unlinkSync(dest)
        }
        else{

            dest += '/'+path.basename(src)
        }
    }

    fs.copyFileSync(src, dest)
}

function copyDir(src:string, dest:string){

    const nextDest = path.join(dest,path.basename(src))
    if(fs.existsSync(dest)){

        fs.rmdirSync(dest, { recursive: true })
    }

    fs.mkdirSync(dest)

    if ( fs.lstatSync( src ).isDirectory() ) {

        let files = fs.readdirSync(src);
        files.forEach( function ( file ) {

            var curSrc = path.join( src, file );
            if ( fs.lstatSync( curSrc ).isDirectory() ) {

                copyDir(curSrc, nextDest);
            } else {

                copyFile(curSrc, nextDest);
            }
        } );
    }
}

function mycp() {

    //Le cas d'un cp de fichier
    if(process.argv.length == 4){

        const source = path.join(process.cwd(),process.argv[2])
        if(fs.existsSync(source)){
            
            const dest = path.join(process.cwd(),process.argv[3])
            if(fs.lstatSync(source).isFile()){

                copyFile(source, dest)
            }
            else{

                if(fs.lstatSync(source).isDirectory()){

                    console.log('mycp.ts: -r non spécifié')
                }
                else{
                    console.log('Votre fichier n\'existe pas')
                }
            }
                
        }
        else{
            if(process.argv[2] == '-r'){

                console.log('Il manque un paramètre')
            }
            else{

                console.log(source+' n\'existe pas !')
            }
        }
    }
    else{
        
        //Le cas d'un cp de directory
        if(process.argv.length == 5){
            
            const source = path.join(process.cwd(),process.argv[3])
            if(fs.existsSync(source)){
                
                const dest = path.join(process.cwd(),process.argv[4])
                if(fs.lstatSync(source).isDirectory()){

                    if(process.argv[2] == '-r'){

                        copyDir(source, dest)
                    }
                    else{
                        
                        console.log('mycp.ts: -r non spécifié')
                    }
                }
                else{

                    if(fs.lstatSync(source).isFile()){

                        console.log('L\'option \'-r\' est de trop')
                    }
                    else{
                        console.log('Votre directory n\'existe pas')
                    }
                }
                    
            }
            else{
                if(process.argv[2] !== '-r'){

                    console.log('mycp.ts: -r non spécifié')
                }
                else{

                    console.log(source+' n\'existe pas !')
                }
            }
        }
        else{

            console.log('Il manque ou il y a trop de paramètres')
        }
    }
}


mycp()