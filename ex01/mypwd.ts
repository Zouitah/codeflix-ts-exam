import path from 'path'

function mypwd() {
  console.log(path.dirname(process.cwd()))
}


mypwd()