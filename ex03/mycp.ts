import fs from 'fs'
import path from 'path'

function copyFile(src:any, dest:any){
            
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

function copyDir(src:any, dest:any){

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

    if(process.argv.length == 4){

        const source = path.join(process.cwd(),process.argv[2])
        if(fs.existsSync(source)){
            
            const dest = path.join(process.cwd(),process.argv[3])
            if(fs.lstatSync(source).isFile()){

                copyFile(source, dest)
            }
            else{

                copyDir(source, dest)
            }
        }
        else{
            console.log(source+' n\'existe pas !')
        }
    }
    else{
        console.log('Il manque ou il y a trop de paramètres')
    }
}


mycp()