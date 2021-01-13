import fs from 'fs'
import path from 'path'
import userid from 'userid'

//Reprise du code de correction fait par Dylan

function righAccessToChar(rightNumber:string){

  if(rightNumber == '1'){ return '--x'}
  if(rightNumber == '2'){ return '-w-'}
  if(rightNumber == '3'){ return '-wx'}
  if(rightNumber == '4'){ return 'r--'}
  if(rightNumber == '5'){ return 'r-x'}
  if(rightNumber == '6'){ return 'rw-'}
  if(rightNumber == '7'){ return 'rwx'}
}

function totalBlockN(files:string[], currentSource:string){

  let totalBlock = 0;

  files.forEach(function( file ){
      if(file[0] !== '.') {totalBlock += Math.ceil(fs.statSync(path.join(currentSource,file)).blocks/2)}
  })
  
  return totalBlock
}

function longFormat(file:string, currentSource:string){

  let everyInfo = ''
      //Type of file part
      if(fs.statSync(currentSource).isDirectory()){

          everyInfo += 'd'
      }
      else{

          everyInfo += '-'
      }

      //Right acces part
      let accesInChar = ''

      const rightAccess = (fs.statSync(currentSource).mode & 0o777).toString(8)
      
      for(let index=0; rightAccess[index] ; index++){

          accesInChar += righAccessToChar(rightAccess[index])
      }

      everyInfo += accesInChar+' '
      
      
      //number of link part
      everyInfo += fs.statSync(currentSource).nlink+' '

      //name of User
      const user = userid.groupname(fs.statSync(currentSource).uid)
      everyInfo += user+' '

      //name of group
      const group = userid.groupname(fs.statSync(currentSource).gid)
      everyInfo += group+' '

      //size in octet
      everyInfo += fs.statSync(currentSource).size+' '
      
      const creationDate = fs.statSync(currentSource).ctime
      
      //date
      const date = new Date(fs.statSync(currentSource).ctime).toDateString()
      everyInfo += date.split(' ')[1].toLowerCase()+'. '+date.split(' ')[2]+' '

      //time
      const hours = new Date(fs.statSync(currentSource).ctime).getHours()
      const minutes = new Date(fs.statSync(currentSource).ctime).getMinutes()
      everyInfo += hours+':'+minutes+' '

      //file name
      everyInfo += path.basename(file)

      return everyInfo
}

function parseArgs(args: string[]): string {
  return args
    .join('')
    .replace(/\-/g, '')
}

function readDirectoryRecursively(source: string, files: string[] = []): string[] {
  const filenames = fs.readdirSync(source)

  filenames.forEach(filename => {
    const currentSource =  path.join(source, filename)

    if (fs.lstatSync(currentSource).isDirectory()) {
      files.push(`${filename}/`)
      readDirectoryRecursively(currentSource, files)
    } else {
      files.push(filename)
    }
  })

  return files
}

function readDirectory(
  source: string,
  options: {
    showHiddenFiles: boolean
    reverse: boolean
    withFileTypes: boolean
    recursive: boolean
    longFormat: boolean
  },
): string[] {
  let files: string[] = []

  // Check -R option is enabled, if true enable recursive
  if (options.recursive) {
    files = readDirectoryRecursively(source)
  } else {
    files = fs.readdirSync(source)
  }

  // Check -a option is not enabled, If true remove File starting with .
  if (!options.showHiddenFiles) {
    files = files.filter(filename => !filename.startsWith('.'))
  }

  // Check -r option is enabled, If true reverse file list
  if (options.reverse) {
    files = files.reverse()
  }

  // Check -p is enabled, Add File Type character
  if (options.withFileTypes) {
    files = files.map(filename => {
      const filePath = path.join(source, filename)

      return (fs.lstatSync(filePath).isDirectory())
        ? `${filename}/`
        : filename
    })
  }

  return files
}

function myls(args: string[]): void {
  const options = parseArgs(args)
  const currentSource = process.cwd()

  const files = readDirectory(currentSource, {
    showHiddenFiles: options.includes('a'),
    reverse: options.includes('r'),
    withFileTypes: options.includes('p'),
    recursive: options.includes('R'),
    longFormat: options.includes('l'),
  })

  if(options.includes('l')){
  
    const totalBlock = totalBlockN(files, currentSource)
    console.log('total '+totalBlock)
    files.forEach(function (file) {

      console.log(longFormat(file,currentSource))
    })
  }
  else{

    console.log(files.join('\n'))
  }
}

const args = process.argv.slice(2)
myls(args)