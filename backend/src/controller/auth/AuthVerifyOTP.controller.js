import catchAsync from '../../utils/catchAsync.js';
import signUpOTPVerify from '../../services/auth/authVerifyOTP.service.js';
import AppError from '../../utils/appError.js';
import tokenUtils from '../../utils/token.js';

const signUpOTPVerifyController = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new AppError(`!Expire and not valid otp`, 403);

  const users = await signUpOTPVerify(email, otp, res);
  const payload = {
    id: users.id,
    email: users.email,
  };
  const token = tokenUtils.accessTokenGenerate(payload);

  if (!token) throw new AppError('Token not generate', 402);

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000,
  });
 
  res.status(200).json({ message: 'OTP Verify user successfully register', users });
});

export default signUpOTPVerifyController;
