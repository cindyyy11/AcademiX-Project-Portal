// require("dotenv").config();
// import mongoose, { Document, Model, Schema } from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   avatar: {
//     public_id: string;
//     url: string;
//   };
//   role: string;
//   isVerified: boolean;
//   courses: Array<{ courseId: string }>;
//   projects: Array<{ courseId: string }>;
//   comparePassword: (password: string) => Promise<boolean>;
//   SignAccessToken: () => string;
//   SignRefreshToken: () => string;
// }

// const userSchema: Schema<IUser> = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please enter your name"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please enter your email"],
//       validate: {
//         validator: function (value: string) {
//           return emailRegexPattern.test(value);
//         },
//         message: "please enter a valid email",
//       },
//       unique: true,
//     },
//     password: {
//       type: String,
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false,
//     },
//     avatar: {
//       public_id: String,
//       url: String,
//     },
//     role: {
//       type: String,
//       default: "user",
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     courses: [
//       {
//         courseId: String,
//       },
//     ],
//     projects: [
//       {
//         courseId: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Hash Password before saving
// userSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // sign access token
// userSchema.methods.SignAccessToken = function () {
//   return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
//     expiresIn: "5m",
//   });
// };

// // sign refresh token
// userSchema.methods.SignRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
//     expiresIn: "3d",
//   });
// };

// // compare password
// userSchema.methods.comparePassword = async function (
//   enteredPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const userModel: Model<IUser> = mongoose.model("User", userSchema);

// export default userModel;


require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: "student" | "admin" | "supervisor";
  isVerified: boolean;
  university: string;
  city: string;
  dateOfBirth: Date;
  gender: string;
  phoneNumber: string;
  address: string;
  hourlyRate: number;
  newTasks: number;
  followers: number;
  projects: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["student", "admin", "supervisor"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    university: { 
      type: String 
    },
    city: { 
      type: String 
    },
    dateOfBirth: { 
      type: Date 
    },
    gender: { 
      type: String 
    },
    phoneNumber: { 
      type: String 
    },
    address: { 
      type: String 
    },
    hourlyRate: { 
      type: Number, default: 0 
    },
    newTasks: { 
      type: Number, default: 0 
    },
    followers: { 
      type: Number, default: 0 
    },
    projects: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Project",
      },
    ],
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

// Hash Password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
