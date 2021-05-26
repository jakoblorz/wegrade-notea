import Project from "../models/Project";
import { ProjectPresentable } from "../../shared/ProjectAttributes";

export const presentProject = (project: Project): ProjectPresentable => ({
  closed: project.closed,
  description: project.description,
  id: project.id,
  name: project.name,
});

export default presentProject;
