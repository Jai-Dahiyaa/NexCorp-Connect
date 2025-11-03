import jwt from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';
import statusService from '../../services/auth/status.service.js';

const statusChangeController = catchAsync(async (req, res) => {
  const { status } = req.body;
  const token = req.cookies?.accessToken;

  if (!status) throw new AppError('PLease Enter status', 404);

  const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
  const email = decode.email;

  if (status === 'true') {
    const statusVerifyEnter = await statusService.userStatusService(email);
    res.status(200).json({ message: 'User Status SuccessFull Change', user: statusVerifyEnter.userStatus });
  }

  if (status === 'false') {
    const statusVerifyEnter = await statusService.userStatusFalse(email);
    res.status(200).json({ message: 'User Status SuccessFull Change', user: statusVerifyEnter.userStatus });
  }
});

export default statusChangeController;
