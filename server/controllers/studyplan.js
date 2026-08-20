import StudyPlan from "../models/studyplan.js";

export const getMyPlan = async (req, res, next) => {
  try {
    let plan = await StudyPlan.findOne({ user: req.user._id }).populate("tasks.course");
    if (!plan) {
      plan = await StudyPlan.create({
        user: req.user._id,
        goal: "Complete my enrolled courses",
        tasks: [],
      });
    }
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const { goal, dailyMinutes } = req.body;
    const plan = await StudyPlan.findOneAndUpdate(
      { user: req.user._id },
      { goal, dailyMinutes },
      { new: true, upsert: true }
    );
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const addTask = async (req, res, next) => {
  try {
    const { title, course, date, duration } = req.body;
    let plan = await StudyPlan.findOne({ user: req.user._id });
    if (!plan) {
      plan = await StudyPlan.create({
        user: req.user._id,
        goal: "Complete my enrolled courses",
      });
    }
    plan.tasks.push({ title, course, date, duration });
    await plan.save();
    await plan.populate("tasks.course");
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const toggleTask = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user._id });
    if (!plan) return res.status(404).json({ message: "No study plan found" });
    const task = plan.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.completed = !task.completed;
    await plan.save();
    await plan.populate("tasks.course");
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user._id });
    if (!plan) return res.status(404).json({ message: "No study plan found" });
    plan.tasks.pull(req.params.taskId);
    await plan.save();
    await plan.populate("tasks.course");
    res.json(plan);
  } catch (error) {
    next(error);
  }
};
