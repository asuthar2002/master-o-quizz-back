import { sequelize } from "../config/database";
import { User } from "./user.Model";
import { QuestionModel } from "./question.model";
import { SkillModel } from "./skillCategory.model";
import { QuizAttemptModel } from "./quizAttempt.model";
import { QuizAnswerModel } from "./quizAnswer.model";

const Skill = SkillModel(sequelize);
const Question = QuestionModel(sequelize);
const QuizAttempt = QuizAttemptModel(sequelize);
const QuizAnswer = QuizAnswerModel(sequelize);

Skill.belongsToMany(Question, {
    through: "QuestionSkills", 
    foreignKey: "skillId",
    otherKey: "questionId",
    as: "questions",
});

Question.belongsToMany(Skill, {
    through: "QuestionSkills",
    foreignKey: "questionId",
    otherKey: "skillId",
    as: "skills",
});

User.hasMany(QuizAttempt, { foreignKey: "userId", as: "attempts" });
QuizAttempt.belongsTo(User, { foreignKey: "userId", as: "user" });

QuizAttempt.hasMany(QuizAnswer, { foreignKey: "attemptId", as: "answers" });
QuizAnswer.belongsTo(QuizAttempt, { foreignKey: "attemptId", as: "attempt" });

Question.hasMany(QuizAnswer, { foreignKey: "questionId", as: "answers" });
QuizAnswer.belongsTo(Question, { foreignKey: "questionId", as: "question" });

export {
    sequelize,
    User,
    Skill,
    Question,
    QuizAttempt,
    QuizAnswer,
};
