import React, { useEffect } from "react";
import { ProjectPresentable } from "../../shared/ProjectAttributes";
import ProjectRepository from "../repositories/ProjectRepository";

export const InjectTemporaryProject: React.FC<{
  project: Partial<ProjectPresentable>;
}> = ({ children, project }) => {
  useEffect(() => {
    const before = ProjectRepository.value.project;
    ProjectRepository.value.project = project;
    return () => {
      ProjectRepository.value.project = before;
    };
  }, [project]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const InjectTemporaryProjects: React.FC<{
  projects: Array<ProjectPresentable>;
}> = ({ children, projects }) => {
  useEffect(() => {
    const before = ProjectRepository.value.projects;
    ProjectRepository.value.projects = projects;
    return () => {
      ProjectRepository.value.projects = before;
    };
  }, [projects]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const EmptyProject: ProjectPresentable = {
  closed: false,
  description: "An empty project's description featuring **markdown**",
  id: "empty-project",
  name: "Empty Project",
};

export const ClosedProject: ProjectPresentable = {
  closed: true,
  description: "An closed project's description featuring **markdown**",
  id: "closed-project",
  name: "Closed Project",
};

export const Projects: Array<ProjectPresentable> = [
  EmptyProject,
  ClosedProject,
  {
    closed: false,
    description: "A number one project's description",
    id: "number-one-project",
    name: "Number One Project",
  },
  {
    closed: false,
    description: "A number two project's description",
    id: "number-two-project",
    name: "Number Two Project",
  },
];
