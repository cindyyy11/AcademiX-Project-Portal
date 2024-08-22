// require("dotenv").config();
// import { Request, Response, NextFunction } from "express";
// import userModel, { IUser } from "../models/user.model";
// import ErrorHandler from "../utils/ErrorHandler";
// import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import jwt, { JwtPayload, Secret } from "jsonwebtoken";
// import ejs from "ejs";
// import path from "path";
// import sendMail from "../utils/sendMail";
// import {
//   accessTokenOptions,
//   refreshTokenOptions,
//   sendToken,
// } from "../utils/jwt";
// import { redis } from "../utils/redis";
// import {
//   getAllUsersService,
//   getUserById,
//   updateUserRoleService,
// } from "../services/user.service";
// import cloudinary from "cloudinary";

// // register user
// interface IRegistrationBody {
//   name: string;
//   email: string;
//   password: string;
//   avatar?: string;
// }

// export const registrationUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email, password } = req.body;

//       const isEmailExist = await userModel.findOne({ email });
//       if (isEmailExist) {
//         return next(new ErrorHandler("Email already exist", 400));
//       }

//       const user: IRegistrationBody = {
//         name,
//         email,
//         password,
//       };

//       const activationToken = createActivationToken(user);

//       const activationCode = activationToken.activationCode;

//       const data = { user: { name: user.name }, activationCode };
//       const html = await ejs.renderFile(
//         path.join(__dirname, "../mails/activation-mail.ejs"),
//         data
//       );

//       try {
//         await sendMail({
//           email: user.email,
//           subject: "Activate your account",
//           template: "activation-mail.ejs",
//           data,
//         });

//         res.status(201).json({
//           success: true,
//           message: `Please check your email: ${user.email} to activate your account!`,
//           activationToken: activationToken.token,
//         });
//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// interface IActivationToken {
//   token: string;
//   activationCode: string;
// }

// export const createActivationToken = (user: any): IActivationToken => {
//   const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

//   const token = jwt.sign(
//     {
//       user,
//       activationCode,
//     },
//     process.env.ACTIVATION_SECRET as Secret,
//     {
//       expiresIn: "5m",
//     }
//   );

//   return { token, activationCode };
// };

// // activate user
// interface IActivationRequest {
//   activation_token: string;
//   activation_code: string;
// }

// export const activateUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { activation_token, activation_code } =
//         req.body as IActivationRequest;

//       const newUser: { user: IUser; activationCode: string } = jwt.verify(
//         activation_token,
//         process.env.ACTIVATION_SECRET as string
//       ) as { user: IUser; activationCode: string };

//       if (newUser.activationCode !== activation_code) {
//         return next(new ErrorHandler("Invalid activation code", 400));
//       }

//       const { name, email, password } = newUser.user;

//       const existUser = await userModel.findOne({ email });

//       if (existUser) {
//         return next(new ErrorHandler("Email already exist", 400));
//       }
//       const user = await userModel.create({
//         name,
//         email,
//         password,
//       });

//       res.status(201).json({
//         success: true,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // Login user
// interface ILoginRequest {
//   email: string;
//   password: string;
// }

// export const loginUser = CatchAsyncError(
  
//   async (req: Request, res: Response, next: NextFunction) => {
//     console.log('loginuser')
//     try {
      
//       const { email, password } = req.body as ILoginRequest;

//       if (!email || !password) {
//         return next(new ErrorHandler("Please enter email and password", 400));
//       }

//       const user = await userModel.findOne({ email }).select("+password");

//       if (!user) {
//         return next(new ErrorHandler("Invalid email or password", 400));
//       }

//       const isPasswordMatch = await user.comparePassword(password);
//       if (!isPasswordMatch) {
//         return next(new ErrorHandler("Invalid email or password", 400));
//       }
//    console.log('dhhdh',user)
//       sendToken(user, 200, res);
//     } catch (error: any) {

//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // logout user
// export const logoutUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       res.cookie("access_token", "", { maxAge: 1 });
//       res.cookie("refresh_token", "", { maxAge: 1 });
//       const userId = req.user?._id || "";
//       redis.del(userId as string);
//       res.status(200).json({
//         success: true,
//         message: "Logged out successfully",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // update access token
// export const updateAccessToken = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const refresh_token = req.cookies.refresh_token as string;
//       const decoded = jwt.verify(
//         refresh_token,
//         process.env.REFRESH_TOKEN as string
//       ) as JwtPayload;

//       const message = "Could not refresh token";
//       if (!decoded) {
//         return next(new ErrorHandler(message, 400));
//       }
//       const session = await redis.get(decoded.id as string);
         
//       if (!session) {
//         return next(
//           new ErrorHandler("Please login for access this resources!", 400)
//         );
//       }
      
//       const user = JSON.parse(session);

//       const accessToken = jwt.sign(
//         { id: user._id },
//         process.env.ACCESS_TOKEN as string,
//         {
//           expiresIn: "5m",
//         }
//       );

//       const refreshToken = jwt.sign(
//         { id: user._id },
//         process.env.REFRESH_TOKEN as string,
//         {
//           expiresIn: "3d",
//         }
//       );

//       req.user = user;

//       res.cookie("access_token", accessToken, accessTokenOptions);
//       res.cookie("refresh_token", refreshToken, refreshTokenOptions);

//       await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days

//       return next();
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // get user info
// export const getUserInfo = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.user?._id;
//       getUserById(userId as string, res);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// interface ISocialAuthBody {
//   email: string;
//   name: string;
//   avatar: string;
// }

// // social auth
// export const socialAuth = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, name, avatar } = req.body as ISocialAuthBody;
//       const user = await userModel.findOne({ email });
//       if (!user) {
//         const newUser = await userModel.create({ email, name, avatar });
//         sendToken(newUser, 200, res);
//       } else {
//         sendToken(user, 200, res);
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // update user info
// interface IUpdateUserInfo {
//   name?: string;
//   email?: string;
// }

// export const updateUserInfo = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name } = req.body as IUpdateUserInfo;

//       const userId = req.user?._id;
//       const user = await userModel.findById(userId);

//       if (name && user) {
//         user.name = name;
//       }

//       await user?.save();

//       await redis.set(userId as string, JSON.stringify(user));

//       res.status(201).json({
//         success: true,
//         user,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // update user password
// interface IUpdatePassword {
//   oldPassword: string;
//   newPassword: string;
// }

// export const updatePassword = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { oldPassword, newPassword } = req.body as IUpdatePassword;

//       if (!oldPassword || !newPassword) {
//         return next(new ErrorHandler("Please enter old and new password", 400));
//       }

//       const user = await userModel.findById(req.user?._id).select("+password");

//       if (user?.password === undefined) {
//         return next(new ErrorHandler("Invalid user", 400));
//       }

//       const isPasswordMatch = await user?.comparePassword(oldPassword);

//       if (!isPasswordMatch) {
//         return next(new ErrorHandler("Invalid old password", 400));
//       }

//       user.password = newPassword;

//       await user.save();

//       await redis.set(req.user?._id as string, JSON.stringify(user));

//       res.status(201).json({
//         success: true,
//         user,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// interface IUpdateProfilePicture {
//   avatar: string;
// }

// // update profile picture
// export const updateProfilePicture = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { avatar } = req.body as IUpdateProfilePicture;

//       const userId = req.user?._id;

//       const user = await userModel.findById(userId).select("+password");

//       if (avatar && user) {
//         // if user have one avatar then call this if
//         if (user?.avatar?.public_id) {
//           // first delete the old image
//           await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

//           const myCloud = await cloudinary.v2.uploader.upload(avatar, {
//             folder: "avatars",
//             width: 150,
//           });
//           user.avatar = {
//             public_id: myCloud.public_id,
//             url: myCloud.secure_url,
//           };
//         } else {
//           const myCloud = await cloudinary.v2.uploader.upload(avatar, {
//             folder: "avatars",
//             width: 150,
//           });
//           user.avatar = {
//             public_id: myCloud.public_id,
//             url: myCloud.secure_url,
//           };
//         }
//       }

//       await user?.save();

//       await redis.set(userId as string, JSON.stringify(user));

//       res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // get all users --- only for admin
// export const getAllUsers = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       getAllUsersService(res);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // update user role --- only for admin
// export const updateUserRole = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, role } = req.body;
//       const isUserExist = await userModel.findOne({ email });
//       if (isUserExist) {
//         const id = isUserExist._id;
//         updateUserRoleService(res, id as string, role);
//       } else {
//         res.status(400).json({
//           success: false,
//           message: "User not found",
//         });
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// // Delete user --- only for admin
// export const deleteUser = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;

//       const user = await userModel.findById(id);

//       if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//       }

//       await user.deleteOne({ id });

//       await redis.del(id);

//       res.status(200).json({
//         success: true,
//         message: "User deleted successfully",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById, updateUserRoleService, getSupervisorsService } from "../services/user.service";
import cloudinary from "cloudinary";

// Register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// Activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await UserModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user = await UserModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      redis.del(userId as string);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      await getUserById(userId as string, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getSupervisorInfo = CatchAsyncError(
  async (req: Request, res: Response) => {
    try {
      await getSupervisorsService(res);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Social authentication
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await UserModel.findOne({ email });
      if (!user) {
        const newUser = await UserModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
  university?: string;
  city?: string;
  dateOfBirth?: Date;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  hourlyRate?: number;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        email,
        university,
        city,
        dateOfBirth,
        gender,
        phoneNumber,
        address,
        hourlyRate,
      } = req.body as IUpdateUserInfo;

      const userId = req.user?._id;
      const user = await UserModel.findById(userId);

      if (name) user!.name = name;
      if (email) user!.email = email;
      if (university) user!.university = university;
      if (city) user!.city = city;
      if (dateOfBirth) user!.dateOfBirth = dateOfBirth;
      if (gender) user!.gender = gender;
      if (phoneNumber) user!.phoneNumber = phoneNumber;
      if (address) user!.address = address;
      if (hourlyRate !== undefined) user!.hourlyRate = hourlyRate;

      await user?.save();

      await redis.set(userId as string, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await UserModel.findById(req.user?._id).select("+password");

      if (!user || !user.password) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id as string, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateProfilePicture {
  avatar: string;
}

// Update profile picture
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await UserModel.findById(userId).select("+password");

      if (avatar && user) {
        // If user has an existing avatar, delete the old image
        if (user.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });

        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await user?.save();

      await redis.set(userId as string, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all users - only for admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Update user role - only for admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const isUserExist = await UserModel.findOne({ email });
      if (isUserExist) {
        const id = isUserExist._id;
        await updateUserRoleService(res, id as string, role);
      } else {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete user - only for admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await user.deleteOne();

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
