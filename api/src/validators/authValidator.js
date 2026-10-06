export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  next();
};

export const validateRegister = (req, res, next) => {
  const {
    name,
    email,
    phone,
    password,
    college,
    graduationYear,
    collegeId
  } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !password ||
    !college ||
    !graduationYear ||
    !collegeId
  ) {
    return res.status(400).json({
      success: false,
      message: 'All registration fields are required'
    });
  }

  next();
};