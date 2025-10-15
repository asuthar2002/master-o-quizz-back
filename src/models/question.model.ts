import { DataTypes, Sequelize, Model, Optional } from "sequelize";
import { SkillInstance } from "./skillCategory.model";

export interface IQuestionAttributes {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IQuestionCreation = Optional<IQuestionAttributes, "id" | "createdAt" | "updatedAt">;

export interface QuestionInstance
  extends Model<IQuestionAttributes, IQuestionCreation>,
    IQuestionAttributes {
  setSkills?: (skillIds: number[]) => Promise<void>;
  getSkills?: () => Promise<SkillInstance[]>;
}

export const QuestionModel = (sequelize: Sequelize) => {
  const Question = sequelize.define<QuestionInstance>(
    "Question",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      questionText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      correctOptionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "questions",
      timestamps: true,
    }
  );

  return Question;
};
