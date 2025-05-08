const userValidation = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 3) {
    errors.push("Nama harus berupa string dan minimal 3 karakter.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    errors.push("Email harus valid.");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password harus minimal 6 karakter.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validasi gagal",
      details: errors,
    });
  }

  next();
};

module.exports = userValidation;
