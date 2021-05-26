/** @jsx jsx */
import { jsx, Box, Flex, Heading, Spinner, IconButton, Badge } from "theme-ui";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react";
import { ShuttleController } from "../controllers/ShuttleController";
import { useParams } from "react-router";
import QuestionnaireRepository from "../repositories/QuestionnaireRepository";
import {
  FiLock,
  FiUnlock,
  FiPlus,
  FiGitMerge,
  FiSearch,
  FiList,
  FiGrid,
  FiFilter,
  FiArrowUp,
} from "react-icons/fi";
import { ToProjectShuttle } from "../controllers/shuttles/ToProjectShuttle";
import { ProjectController } from "../controllers/views/ProjectController";
import ProjectRepository from "../repositories/ProjectRepository";
import UserRepository from "../repositories/UserRepository";
import Button from "../components/Button";

export interface ProjectPageProps {
  DEV__projectId: string;
  DEV__questionnaireIds: string[];
  DEV__userIds: string[];
}

export const projectPagePathname = "/p/:id";

export const buildProjectPagePathname = (id: string) =>
  projectPagePathname.replace(":id", id);

export const ProjectPageInitializer: React.FC<
  Partial<ProjectPageProps>
> = observer(
  ({
    children,
    DEV__projectId,
    DEV__questionnaireIds,
    DEV__userIds,
    ...props
  }) => {
    const shuttle = useMemo(
      () =>
        ShuttleController.value.popShuttle<ToProjectShuttle>(
          projectPagePathname
        ),
      []
    );
    const { id } = useParams();
    const controller = useMemo(
      () =>
        shuttle
          ? ProjectController.fromToProjectShuttle(shuttle)
          : new ProjectController(
              id || DEV__projectId,
              DEV__questionnaireIds,
              DEV__userIds
            ),
      [DEV__projectId, DEV__questionnaireIds, DEV__userIds, id, shuttle]
    );
    const { id: projectId } = controller;

    useEffect(() => void ProjectRepository.value.selectProject(projectId), [
      projectId,
    ]);

    return (
      <ProjectPage {...props} controller={controller} shuttle={shuttle}>
        {children}
      </ProjectPage>
    );
  }
);

export default ProjectPageInitializer;

const GridContainerStyles = {};
const ListContainerStyles = {};
const GridItemStyles = {};
const ListItemStyles = {};

export const ProjectPage: React.FC<
  Partial<ProjectPageProps> & {
    controller: ProjectController;
    shuttle?: ToProjectShuttle;
  }
> = observer(({ controller, shuttle }) => {
  const {
    project: { id, name, description, closed },
    hasProject,
  } = ProjectRepository.value;

  useEffect(
    () =>
      void (async () => {
        controller.questionnaireIds = (
          await QuestionnaireRepository.value.loadQuestionnaires({
            projectId: id,
          })
        ).ids;
      }),
    [controller.questionnaireIds, id]
  );

  useEffect(
    () =>
      void (async () => {
        controller.userIds = (
          await UserRepository.value.loadUsers({
            projectId: id,
          } as any)
        ).ids;
      }),
    [controller.userIds, id]
  );

  const [questionnairesAsGrid, setQuestionnairesAsGrid] = useState(true);
  const toggleQuestionnaireGrid = useCallback(
    () => setQuestionnairesAsGrid(!questionnairesAsGrid),
    [questionnairesAsGrid]
  );

  const [usersAsGrid, setUsersAsGrid] = useState(true);
  const toggleUsersGrid = useCallback(() => setUsersAsGrid(!usersAsGrid), [
    usersAsGrid,
  ]);

  if (!hasProject) {
    return <Spinner />;
  }

  return (
    <Flex sx={{ flexDirection: "column", mt: 32 }}>
      <Flex sx={{ flexWrap: "nowrap" }}>
        <Box>
          <Heading>{name}</Heading>
          <Box>{description}</Box>
        </Box>
        <Box sx={{ ml: "auto" }} style={{ color: "gold" }}>
          <IconButton aria-label={closed ? "Unlock" : "Lock"}>
            {closed && <FiUnlock />}
            {!closed && <FiLock />}
          </IconButton>
        </Box>
      </Flex>
      <Flex sx={{ flexWrap: "nowrap", mt: 4, alignItems: "center" }}>
        <Heading as="h3">Questionnaires</Heading>
        <Box sx={{ ml: "auto" }}>
          <IconButton aria-label="Import">
            <FiGitMerge />
          </IconButton>
          <IconButton aria-label="Add">
            <FiPlus />
          </IconButton>
        </Box>
      </Flex>
      <Box>
        {controller.questionnaireIds.length === 0 && (
          <React.Fragment>
            <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
              There are no questionnaires it this project yet. Start by creating
              one or importing a template.
              <Box sx={{ mt: 2 }}>
                <Button sx={{ bg: "primary", color: "background", mr: 1 }}>
                  Create
                </Button>
                <Button>Import</Button>
              </Box>
            </Box>
          </React.Fragment>
        )}
        {controller.questionnaireIds.length > 0 && (
          <React.Fragment>
            <Flex
              sx={{
                flexDirection: "row",
                flexWrap: "nowrap",
                mb: 2,
                color: "primary",
              }}
            >
              <Box>
                <IconButton sx={{ cursor: "pointer", verticalAlign: "bottom" }}>
                  <FiFilter />
                </IconButton>
                <Badge style={{ verticalAlign: "super", cursor: "pointer" }}>
                  Name
                  <FiArrowUp style={{ verticalAlign: "text-top" }} />
                </Badge>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <IconButton
                  onClick={toggleQuestionnaireGrid}
                  sx={{ cursor: "pointer" }}
                >
                  {questionnairesAsGrid ? <FiList /> : <FiGrid />}
                </IconButton>
              </Box>
            </Flex>
            <Flex
              style={{
                flexWrap: questionnairesAsGrid ? "wrap" : "nowrap",
                flexDirection: questionnairesAsGrid ? "row" : "column",
              }}
            >
              {controller.questionnaireIds.map((q) => (
                <Flex
                  sx={{
                    bg: "background",
                    mr: 2,
                    mb: 2,
                    ...(questionnairesAsGrid
                      ? {}
                      : {
                          p: 2,
                        }),
                    transition: "box-shadow 0.5s",
                    willChange: "transform",
                    boxShadow:
                      "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
                    ":hover": {
                      boxShadow: "0px 2.5px 15px -2.5px rgba(0, 0, 0, 0.3)",
                    },
                    borderRadius: "4px",
                  }}
                  style={{
                    minWidth: questionnairesAsGrid ? "100px" : "unset",
                    maxWidth: questionnairesAsGrid ? "200px" : "unset",
                    minHeight: questionnairesAsGrid ? "100px" : "unset",
                    maxHeight: questionnairesAsGrid ? "200px" : "unset",
                  }}
                >
                  {q}
                </Flex>
              ))}
            </Flex>
          </React.Fragment>
        )}
      </Box>
      <Flex sx={{ flexWrap: "nowrap", mt: 4, alignItems: "center" }}>
        <Heading as="h3">Users</Heading>
      </Flex>
      <Flex sx={{ flexWrap: "nowrap", mt: 1, alignItems: "center" }}>
        <Heading as="h5">Groups</Heading>
        <Box sx={{ ml: "auto" }}>
          <IconButton aria-label="Add">
            <FiPlus />
          </IconButton>
        </Box>
      </Flex>
      <Box>
        {controller.userIds.length === 0 && (
          <React.Fragment>
            <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
              There are no users / groups in this project yet. Start by creating
              one.
              <Box sx={{ mt: 2 }}>
                <Button sx={{ bg: "primary", color: "background", mr: 1 }}>
                  Create
                </Button>
              </Box>
            </Box>
          </React.Fragment>
        )}
        {controller.userIds.length > 0 && (
          <React.Fragment>
            <Flex
              sx={{
                flexDirection: "row",
                flexWrap: "nowrap",
                mb: 2,
                color: "primary",
              }}
            >
              <span></span>
              <Box sx={{ ml: "auto" }}>
                <IconButton aria-label="Search User">
                  <FiSearch />
                </IconButton>
                <IconButton
                  onClick={toggleUsersGrid}
                  sx={{ cursor: "pointer" }}
                >
                  {usersAsGrid ? <FiList /> : <FiGrid />}
                </IconButton>
              </Box>
            </Flex>
            <Flex
              style={{
                flexWrap: usersAsGrid ? "wrap" : "nowrap",
                flexDirection: usersAsGrid ? "row" : "column",
              }}
            >
              {controller.userIds.map((q) => (
                <Flex
                  sx={{
                    bg: "background",
                    mr: 2,
                    mb: 2,
                    ...(usersAsGrid
                      ? {}
                      : {
                          p: 2,
                        }),
                    transition: "box-shadow 0.5s",
                    willChange: "transform",
                    boxShadow:
                      "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
                    ":hover": {
                      boxShadow: "0px 2.5px 15px -2.5px rgba(0, 0, 0, 0.3)",
                    },
                    borderRadius: "4px",
                  }}
                  style={{
                    minWidth: usersAsGrid ? "100px" : "unset",
                    minHeight: usersAsGrid ? "100px" : "unset",
                  }}
                >
                  {q}
                </Flex>
              ))}
            </Flex>
          </React.Fragment>
        )}
      </Box>
      <Flex sx={{ flexWrap: "nowrap", mt: 1, alignItems: "center" }}>
        <Heading as="h5">Maintainers</Heading>
        <Box sx={{ ml: "auto" }}>
          <IconButton aria-label="Add">
            <FiPlus />
          </IconButton>
        </Box>
      </Flex>
      <Box>
        {controller.userIds.length === 0 && (
          <React.Fragment>
            <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
              There are no maintainers in this project yet. Start by creating
              one.
              <Box sx={{ mt: 2 }}>
                <Button sx={{ bg: "primary", color: "background", mr: 1 }}>
                  Create
                </Button>
              </Box>
            </Box>
          </React.Fragment>
        )}
        {controller.userIds.length > 0 && (
          <React.Fragment>
            <Flex
              sx={{
                flexDirection: "row",
                flexWrap: "nowrap",
                mb: 2,
                color: "primary",
              }}
            >
              <span></span>
              <Box sx={{ ml: "auto" }}>
                <IconButton aria-label="Search User">
                  <FiSearch />
                </IconButton>
                <IconButton
                  onClick={toggleUsersGrid}
                  sx={{ cursor: "pointer" }}
                >
                  {usersAsGrid ? <FiList /> : <FiGrid />}
                </IconButton>
              </Box>
            </Flex>
            <Flex
              style={{
                flexWrap: usersAsGrid ? "wrap" : "nowrap",
                flexDirection: usersAsGrid ? "row" : "column",
              }}
            >
              {controller.userIds.map((q) => (
                <Flex
                  sx={{
                    bg: "background",
                    mr: 2,
                    mb: 2,
                    ...(usersAsGrid
                      ? {}
                      : {
                          p: 2,
                        }),
                    transition: "box-shadow 0.5s",
                    willChange: "transform",
                    boxShadow:
                      "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
                    ":hover": {
                      boxShadow: "0px 2.5px 15px -2.5px rgba(0, 0, 0, 0.3)",
                    },
                    borderRadius: "4px",
                  }}
                  style={{
                    minWidth: usersAsGrid ? "100px" : "unset",
                    minHeight: usersAsGrid ? "100px" : "unset",
                  }}
                >
                  {q}
                </Flex>
              ))}
            </Flex>
          </React.Fragment>
        )}
      </Box>
    </Flex>
  );
});
