import exercisesData from "../data/exercises.json" assert { type: "json" };

// GET exercises by level
export const getExercisesByLevel = (req, res) => {
  try {
    const { level } = req.params;

    // validate level
    if (!["1", "2", "3", "4", "5"].includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Invalid level. Must be between 1-5",
      });
    }

    const exercises = exercisesData.imitation[level];

    return res.status(200).json({
      success: true,
      level,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};