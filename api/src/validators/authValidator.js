const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  if (!EMAIL_REGEX.test(String(email).trim())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address format',
    });
  }

  next();
};

export const validateRegister = (req, res, next) => {
  const {
    name,
    companyName,
    collegeName,
    fullName,
    email,
    phone,
    password,
    role = 'student',
    college,
    graduationYear,
    collegeId,
  } = req.body;

  const resolvedName = name || companyName || collegeName || fullName;

  if (!resolvedName) {
    return res.status(400).json({
      success: false,
      message: 'Name or company/institution name is required',
    });
  }

  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required',
    });
  }

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required',
    });
  }

  if (!password || String(password).length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  // Student specific validation
  if (role === 'student') {
    if (!college || !graduationYear || !collegeId) {
      return res.status(400).json({
        success: false,
        message: 'College, graduation year, and college ID are required for student accounts',
      });
    }
  }

  next();
};