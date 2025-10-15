import { DataTypes, Sequelize, Model, Optional } from "sequelize";

export interface ISkillAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ISkillCreation = Optional<ISkillAttributes, "id" | "createdAt" | "updatedAt">;

export interface SkillInstance
  extends Model<ISkillAttributes, ISkillCreation>,
    ISkillAttributes {}

export const SkillModel = (sequelize: Sequelize) => {
  const Skill = sequelize.define<SkillInstance>(
    "Skill",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "skills",
      timestamps: true,
      indexes: [{ unique: true, fields: ["name"] }],
    }
  );
  return Skill;
};
