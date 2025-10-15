import { Question, Skill, QuizAnswer, QuizAttempt } from "../models";
import { Op } from "sequelize";

interface CreateQuestionDTO {
  skillIds: number[];
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export const createQuestionService = async (data: CreateQuestionDTO) => {
  try {
    const { skillIds, questionText, options, correctOptionIndex } = data;

    if (!Array.isArray(options) || options.length < 2) {
      return { success: false, error: "At least two options are required" };
    }

    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      return { success: false, error: "Invalid correct option index" };
    }

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return { success: false, error: "At least one skill is required" };
    }

    const skills = await Skill.findAll({ where: { id: skillIds } });
    if (skills.length !== skillIds.length) {
      return { success: false, error: "One or more skills not found" };
    }


    const newQuestion = (await Question.create({
      questionText,
      options,
      correctOptionIndex,
    })) as any;

    await newQuestion.setSkills(skillIds);

    const createdQuestion = await Question.findByPk(newQuestion.id, {
      include: [{ model: Skill, as: "skills", attributes: ["id", "name"], through: { attributes: [] } }],
      attributes: { exclude: ["correctOptionIndex"] },
    });

    return { success: true, question: createdQuestion };
  } catch (error) {
    console.error("Create question error:", error);
    return { success: false, error: "Internal server error" };
  }
};

interface PaginationParams {
  page: number;
  limit: number;
}

export const getAllQuestionsService = async ({ page, limit }: PaginationParams) => {
  try {
    const offset = (page - 1) * limit;
    const totalCount = await Question.count();
    const questions = await Question.findAll({
      include: [
        {
          model: Skill,
          as: "skills",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
      attributes: {
        exclude: ["correctOptionIndex"],
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      questions,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Get questions error:", error);
    return { success: false, error: "Internal server error" };
  }
};


interface CheckAnswerDTO {
  userId: number;
  questionId: number;
  selectedOptionIndex: number;
}


export const checkQuestionAnswerService = async (data: CheckAnswerDTO) => {
  try {
    const { userId, questionId, selectedOptionIndex } = data;

    if (!userId || !questionId || typeof selectedOptionIndex !== "number") {
      return { success: false, error: "Invalid input data" };
    }

    const question = await Question.findByPk(questionId, {
      attributes: ["id", "questionText", "options", "correctOptionIndex"],
    });
    if (!question) return { success: false, error: "Question not found" };
    const isCorrect = question.correctOptionIndex === selectedOptionIndex;
    let attempt = await QuizAttempt.findOne({
      where: {
        userId,
        submittedAt: { [Op.is]: null } as any,
      },
    });
    if (!attempt) {
      attempt = await QuizAttempt.create({
        userId,
        totalQuestions: 0,
        correctAnswers: 0,
        startedAt: new Date(),
      });
    }

    const existingAnswer = await QuizAnswer.findOne({
      where: {
        questionId,
        attemptId: (attempt as any).id,
      },
    });

    if (existingAnswer) {
      return {
        success: false,
        error: "You have already attempted this question in this quiz.",
      };
    }

    await QuizAnswer.create({
      attemptId: (attempt as any).id,
      questionId,
      selectedOptionIndex,
      isCorrect,
    });
    const totalQuestions = ((attempt as any).totalQuestions || 0) + 1;
    const correctAnswers = ((attempt as any).correctAnswers || 0) + (isCorrect ? 1 : 0);

    await (attempt as any).update({ totalQuestions, correctAnswers });

    const correctAnswer = question.options[question.correctOptionIndex];
    const selectedAnswer = question.options[selectedOptionIndex];

    return {
      success: true,
      isCorrect,
      message: isCorrect
        ? "Correct answer!"
        : `Incorrect. Correct answer is "${correctAnswer}".`,
      question: {
        id: question.id,
        questionText: question.questionText,
        selectedAnswer,
        correctAnswer: isCorrect ? undefined : correctAnswer,
      },
      attemptSummary: {
        attemptId: (attempt as any).id,
        totalQuestions,
        correctAnswers,
      },
    };
  } catch (error) {
    console.error("Check answer error:", error);
    return { success: false, error: "Internal server error" };
  }
};