import { DataTypes, Sequelize, Model, Optional } from "sequelize";

export interface IQuizAnswerAttributes {
  id: number;
  attemptId: number;
  questionId: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export type IQuizAnswerCreation = Optional<IQuizAnswerAttributes, "id">;

export const QuizAnswerModel = (sequelize: Sequelize) => {
  const QuizAnswer = sequelize.define<Model<IQuizAnswerAttributes, IQuizAnswerCreation>>(
    "QuizAnswer",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      attemptId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      selectedOptionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "quiz_answers",
      timestamps: false,
      indexes: [
        { fields: ["attemptId"] },
        { fields: ["questionId"] },
      ],
    }
  );
  return QuizAnswer;
};
