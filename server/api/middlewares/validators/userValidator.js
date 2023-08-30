const joi=require('joi');

const validateUser=async(req,res,next)=>{
    const userSchema=joi.object({
      name:joi.string().
      min(3).
      max(30).
      required(),
      email:joi.string().
      email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password:joi.string().
      pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    try{
       await userSchema.validateAsync(req.body);
       next();
    }
    catch(error){
        res.status(400).json({message:error.details[0].message})
    }

}

module.exports=validateUser;