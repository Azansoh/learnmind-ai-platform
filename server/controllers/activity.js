import Activity from "../models/activity.js";

export const getMyActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
