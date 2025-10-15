import { DataTypes, Sequelize, Model, Optional } from "sequelize";

export interface IQuizAttemptAttributes {
  id: number;
  userId: number;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: Date;
  submittedAt?: Date;
}

export type IQuizAttemptCreation = Optional<IQuizAttemptAttributes, "id" | "submittedAt">;

export const QuizAttemptModel = (sequelize: Sequelize) => {
  const QuizAttempt = sequelize.define<Model<IQuizAttemptAttributes, IQuizAttemptCreation>>(
    "QuizAttempt",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correctAnswers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      startedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "quiz_attempts",
      timestamps: false,
      indexes: [{ fields: ["userId"] }],
    }
  );
  return QuizAttempt;
};
