import { SkillModel } from "../models/skillCategory.model";
import { sequelize } from "../config/database";

const Skill = SkillModel(sequelize);

interface CreateSkillDTO {
  name: string;
}

export const createSkillService = async ({ name }: CreateSkillDTO) => {
  try {
    const existingSkill = await Skill.findOne({ where: { name } });
    if (existingSkill) {
      return { success: false, error: "Skill already exists" };
    }

    const skill = await Skill.create({ name });
    return { success: true, skill };
  } catch (error) {
    console.error("Error in createSkillService:", error);
    return { success: false, error: "Failed to create skill" };
  }
};
export const getAllSkillService = async () => {
  try {
    const skills = await Skill.findAll();
    return { success: true, skills,message:"fetched successfully" };
  } catch (error) {
    console.error("Error in createSkillService:", error);
    return { success: false, error: "Failed to create skill" };
  }
};
