const httpStatus=require('http-status');
const asyncHandler=require('express-async-handler');
const User = require('../models/userModel');
const userService=require('../services/userService');
const APIError=require('../utils/APIError');


//@desc login into the account
//@route /api/users/login
//@access public
const loginUserWithEmailAndPassword=asyncHandler(async(email,password)=>{
      const user=await userService.getUserByEmail(email);
      if(!user ||(await user.validatePassword(password))){
        throw new APIError(httpStatus.UNAUTHORIZED,'Invalid credentials');
      }
      return {
        success:true,
        user
      }


});

//@desc logout from the account
//@route /api/users/logout
//@access private
const logoutUser=asyncHandler(async(refreshToken)=>{
    const refreshToken=await Token.findOne({token:refreshToken,type: tokenTypes.REFRESH, blacklisted: false });
    if(!refreshToken){
      throw new APIError(httpStatus.INTERNAL_SERVER_ERROR,'Invalid refresh token');
    }
    await refreshToken.remove();
});

//@desc refresh the auth tokens
//@route /api/users/refresh-tokens
//@access private
const refreshAuth=asyncHandler(async(refreshToken)=>{
  try{
    const refreshTokenDoc=await tokenService.verifyToken(refreshToken,tokeTypes.REFRESH);
    const user= await userService.getUserById(refreshTokenDoc.user);
    if(!user){
      throw new Error('User not found');
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);

  }
  catch(error){
    throw new APIError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
});




module.exports={ 
  loginUserWithEmailAndPassword,
  logoutUser,
  refreshAuth
}