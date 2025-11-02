export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.json({ success: false, message: "Not Authenicated" });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
