import path from 'path'

function mypwd() {
  // console.log(path.dirname(process.cwd()))
  console.log(process.env.HOME)
}


mypwd()