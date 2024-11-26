import bcrypt from 'bcrypt';

export  function GenrateSalt (){
   return  bcrypt.genSalt(10)
}

export  function encypteSalt (password , salt){
   return  bcrypt.hash(password, salt)
}  

export function comparePassword (password, hash){
   return  bcrypt.compare(password, hash)
}  