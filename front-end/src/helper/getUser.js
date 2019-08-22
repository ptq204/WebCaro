const jwt = require('jsonwebtoken');

const SECRET = 'pGctNMl4LL4bEQSwCdIzdg';
const getUser = (token) => {

  const verifyOptions = {
    algorithm: ['HS256']
  }

  try{
    const verify = jwt.verify(token, SECRET);

    if(!verify){
      console.log('Authenticated fail');
      return null;
    }
    return JSON.stringify(verify);

  }catch(err){
    console.log(err);
    return null;
  }
}

export default getUser;
