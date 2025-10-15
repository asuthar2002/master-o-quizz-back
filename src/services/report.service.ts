import { Op, fn, col, literal } from "sequelize";
import { User, QuizAttempt, QuizAnswer, Question, Skill } from "../models";

export const getUserPerformanceReport = async () => {
    const users = await User.findAll({
        attributes: [
            "id",
            "fullName",
            [fn("COUNT", col("attempts.id")), "totalAttempts"],
            [fn("SUM", col("attempts.totalQuestions")), "totalQuestions"],
            [fn("SUM", col("attempts.correctAnswers")), "totalCorrect"],
            [
                literal("(SUM(attempts.correctAnswers) / NULLIF(SUM(attempts.totalQuestions), 0)) * 100"),
                "averageScore",
            ],
            [fn("MAX", col("attempts.submittedAt")), "lastAttempt"],
        ],
        include: [
            {
                model: QuizAttempt,
                as: "attempts",
                attributes: [],
            },
        ],
        group: ["User.id"],
        order: [[literal("averageScore"), "DESC"]],
        raw: true,
    });

    return users;
};
export const getSkillGapReport = async () => {
    const results = await Skill.findAll({
        attributes: [
            "id",
            "name",
            [fn("COUNT", col("questions->answers.id")), "totalAttempts"],
            [
                fn("SUM", literal("CASE WHEN `questions->answers`.`isCorrect` = 1 THEN 1 ELSE 0 END")),
                "correctAnswers",
            ],
            [
                literal(
                    "(SUM(CASE WHEN `questions->answers`.`isCorrect` = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(`questions->answers`.`id`), 0)) * 100"
                ),
                "accuracy",
            ],
        ],
        include: [
            {
                model: Question,
                as: "questions",
                attributes: [],
                through: { attributes: [] },
                include: [
                    {
                        model: QuizAnswer,
                        as: "answers",
                        attributes: [],
                    },
                ],
            },
        ],
        group: ["Skill.id"],
        order: [[literal("accuracy"), "ASC"]],
        raw: true,
    });

    return results;
};


export const getTimeBasedReport = async (filterType: "week" | "month" = "month") => {
    const dateFormat = filterType === "week" ? "%x-%v" : "%Y-%m";

    const results = await QuizAttempt.findAll({
        attributes: [
            "userId",
            [fn("DATE_FORMAT", col("submittedAt"), dateFormat), "period"],
            [fn("COUNT", col("id")), "attempts"],
            [fn("AVG", literal("(correctAnswers / totalQuestions) * 100")), "avgScore"],
        ],
        where: {
            submittedAt: { [Op.not]: null as any },
        },
        group: ["userId", "period"],
        order: [
            ["userId", "ASC"],
            [literal("period"), "ASC"],
        ],
        raw: true,
    });

    return results;
};
