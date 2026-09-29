import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};


export const generateMfaToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "mfa",
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "5m",
    },
  );
};

export const generatePasswordResetToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "password-reset",
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "3m",
    },
  );
};