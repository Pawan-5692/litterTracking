const {validateToken} = require('../services/authentication.js')
function checkForAuthentication(cookieName){
    return(req, res, next)=>{
        const tokencookie = req.cookies[cookieName]
        if(!tokencookie) 
            return next();

        try {
            const userpayload = validateToken(tokencookie)
            req.user = userpayload 
        }catch(error){}

        return next();
    }
}

module.exports = checkForAuthentication