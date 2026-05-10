import mongoose from "mongoose";

export const validateObectId = (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Id"
    });
  }

  next();
};
