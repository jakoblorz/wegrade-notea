/** @jsx jsx */
import {
  jsx,
  Box,
  Flex,
  Heading,
  Spinner,
  IconButton,
  SxProps,
  Theme,
  Badge,
} from "theme-ui";
import React, {
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { observer } from "mobx-react";
import { ShuttleController } from "../controllers/ShuttleController";
import { ToQuestionnaireShuttle } from "../controllers/shuttles/ToQuestionnaireShuttle";
import { QuestionnaireController } from "../controllers/views/QuestionnaireController";
import { useParams, useHistory } from "react-router";
import QuestionnaireRepository from "../repositories/QuestionnaireRepository";
import QuestionRepository from "../repositories/QuestionRepository";
import GroupRepository from "../repositories/GroupRepository";
import {
  FiLock,
  FiUnlock,
  FiAlignJustify,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
} from "react-icons/fi";
import { QuestionPresentable } from "../../shared/QuestionAttributes";
import { GroupPresentable } from "../../shared/GroupAttributes";
import { useSpring, animated } from "react-spring";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProjectRepository from "../repositories/ProjectRepository";
import { buildProjectPagePathname, projectPagePathname } from "./Project";
import { ToProjectShuttle } from "../controllers/shuttles/ToProjectShuttle";
import styled from "@emotion/styled";

type PaperlikeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  sx?: SxProps;
  as?: keyof JSX.IntrinsicElements;
  selected: boolean;
  zIndex: number;
};

const trans = (s: number) => `scale(${s})`;
const baseScale = 0.98;
const increasedScale = 1;

const Paperlike: React.FC<PaperlikeProps> = ({
  as = "div",
  sx = {},
  children,
  selected,
  zIndex,
  ...rest
}) => {
  const [props, set] = useSpring(() => ({
    s: baseScale,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  useEffect(() => {
    if (!selected) {
      set({ s: baseScale });
    } else {
      set({ s: increasedScale });
    }
  }, [selected, set]);

  const Component = useMemo(() => animated[as], [as]);

  return (
    <Component
      {...(rest as any)}
      onMouseEnter={() => set({ s: increasedScale })}
      onMouseLeave={() => (!selected ? set({ s: baseScale }) : null)}
      style={{
        ...rest.style,
        // transform: props.s.interpolate(trans as any),
        // zIndex: zIndex * (selected ? 10 : 1),
      }}
      sx={{
        ...sx,
        bg: "background",
        cursor: rest.onClick != null ? "pointer" : "unset",
        px: 2,
        py: 2,
        transition: "box-shadow 0.5s",
        willChange: "transform",
        boxShadow:
          "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
        ":hover": {
          boxShadow: "0px 5px 30px -5px rgba(0, 0, 0, 0.3)",
        },
        ...(as !== "tr"
          ? {
              ":first-child": {
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                borderTop: "0px",
                mt: 0,
              },
              ":last-child": {
                borderBottomLeftRadius: "4px",
                borderBottomRightRadius: "4px",
                borderBottom: "0px",
                mb: 0,
              },
            }
          : {
              ":hover": {
                boxShadow:
                  "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
              },
              td: {
                borderTop: (t: Theme) => `1px solid ${t.colors?.text}`,
                borderBottom: (t: Theme) => `1px solid ${t.colors?.text}`,
                "-moz-appearance": "none",
                "-webkit-appearance": "none",
                "-webkit-box-shadow": "inset 0 4px 1px rgba(0,0,0,.06)",
                "box-shadow": "inset 0 4px 1px rgba(0,0,0,.06)",
              },
              ":first-child": {
                mt: 0,
              },
              "td:first-child": {
                borderLeft: (t: Theme) => `8px solid ${t.colors?.text}`,
              },
              "td:last-child": {
                borderRight: (t: Theme) => `1px solid ${t.colors?.text}`,
              },
              ":first-child td:first-child": {
                borderTopLeftRadius: "4px",
              },
              ":first-child td:last-child": {
                borderTopRightRadius: "4px",
              },
              ":last-child": {
                mb: 0,
              },
              ":last-child td:first-child": {
                borderBottomLeftRadius: "4px",
              },
              ":last-child td:last-child": {
                borderBottomRightRadius: "4px",
              },
            }),
      }}
    >
      {children}
    </Component>
  );
};

const DnDItemTypes = {
  QuestionnaireObject: "qa",
};

const QuestionnaireItemHeader: React.FC<{
  name: string;
  description: string;
}> = ({ name, description, children }) => (
  <Flex sx={{ flexWrap: "nowrap" }}>
    <Box>
      <Heading as="h3" style={{ lineHeight: "inherit" }}>
        <FiAlignJustify />
        {name}
      </Heading>
      <Box>{description}</Box>
    </Box>
    <Box sx={{ ml: "auto" }}>{children}</Box>
  </Flex>
);

const Group: React.FC<
  Partial<GroupPresentable> & {
    isFirst: boolean;
    isLast: boolean;
  }
> = ({ name, description, isFirst, isLast, ...props }) => {
  const [{ opacity }, drag, preview] = useDrag({
    item: { type: DnDItemTypes.QuestionnaireObject },
  });
  return (
    <React.Fragment>
      <div ref={preview} style={{ opacity }}></div>
      <div ref={drag}>
        <Paperlike selected={false} zIndex={1} onClick={() => {}}>
          <Flex sx={{ flexDirection: "column" }}>
            <QuestionnaireItemHeader
              name={name || ""}
              description={description || ""}
            >
              {!isFirst && <FiArrowUp />}
              {!isLast && <FiArrowDown />}
            </QuestionnaireItemHeader>
            {JSON.stringify(props)}
          </Flex>
        </Paperlike>
      </div>
    </React.Fragment>
  );
};

const Question: React.FC<
  Partial<GroupPresentable> & {
    isFirst: boolean;
    isLast: boolean;
  }
> = ({ name, description, isFirst, isLast, ...props }) => {
  const [{ opacity }, drag, preview] = useDrag({
    item: { type: DnDItemTypes.QuestionnaireObject },
  });
  return (
    <React.Fragment>
      <div ref={preview} style={{ opacity }}></div>
      <div ref={drag}>
        <Paperlike selected={false} zIndex={1} onClick={() => {}} ref={drag}>
          <Flex sx={{ flexDirection: "column" }}>
            <QuestionnaireItemHeader
              name={name || ""}
              description={description || ""}
            >
              {!isFirst && <FiArrowUp />}
              {!isLast && <FiArrowDown />}
            </QuestionnaireItemHeader>
            {JSON.stringify(props)}
          </Flex>
        </Paperlike>
      </div>
    </React.Fragment>
  );
};

const DropAreaStyled = styled(Flex)`
  :after {
    content: ;
  }
`;

const DropArea: React.FC<{ position: number }> = ({ position }) => {
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: DnDItemTypes.QuestionnaireObject,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });
  return <Flex sx={{ my: 2 }} ref={drop}></Flex>;
};

export interface QuestionnairePageProps {
  DEV__questionnaireId: string;
  DEV__questionIds: string[];
  DEV__groupIds: string[];
}

export const questionnairePagePathname = "/q/:id";

export const buildQuestionnairePagePathname = (id: string) =>
  questionnairePagePathname.replace(":id", id);

export const QuestionnairePageInitializer: React.FC<
  Partial<QuestionnairePageProps>
> = observer(
  ({
    children,
    DEV__questionnaireId,
    DEV__groupIds,
    DEV__questionIds,
    ...props
  }) => {
    const shuttle = useMemo(
      () =>
        ShuttleController.value.popShuttle<ToQuestionnaireShuttle>(
          questionnairePagePathname
        ),
      []
    );
    const { id } = useParams();
    const controller = useMemo(
      () =>
        shuttle
          ? QuestionnaireController.fromToQuestionnaireShuttle(shuttle)
          : new QuestionnaireController(
              id || DEV__questionnaireId,
              DEV__questionIds,
              DEV__groupIds
            ),
      [DEV__groupIds, DEV__questionnaireId, DEV__questionIds, id, shuttle]
    );
    const { id: questionnaireId } = controller;

    useEffect(
      () =>
        void QuestionnaireRepository.value.selectQuestionnaire(questionnaireId),
      [questionnaireId]
    );

    return (
      <QuestionnairePage {...props} controller={controller} shuttle={shuttle}>
        {children}
      </QuestionnairePage>
    );
  }
);

export default QuestionnairePageInitializer;

export const QuestionnairePage: React.FC<
  Partial<QuestionnairePageProps> & {
    controller: QuestionnaireController;
    shuttle?: ToQuestionnaireShuttle;
  }
> = observer(({ controller, shuttle, ...props }) => {
  const {
    questionnaire: { id, name, description, closed, projectId },
    hasQuestionnaire,
  } = QuestionnaireRepository.value;

  useEffect(
    () => void (projectId && ProjectRepository.value.loadProject(projectId)),
    [projectId]
  );

  const { projects } = ProjectRepository.value;
  const project = useMemo(
    () => (projectId ? projects.find((p) => p.id === projectId) : undefined),
    [projectId, projects]
  );

  useEffect(
    () =>
      void (async () => {
        controller.questionIds = (
          await QuestionRepository.value.loadQuestions({
            questionnaireId: id,
          })
        ).ids;
      })(),
    [controller.questionIds, id]
  );

  useEffect(
    () =>
      void (async () => {
        controller.groupIds = (
          await GroupRepository.value.loadGroups({
            questionnaireId: id,
          })
        ).ids;
      })(),
    [controller.groupIds, id]
  );

  const items = [
    ...(controller.questionIds
      .map((id) => QuestionRepository.value.questions.find((q) => q.id === id))
      .filter((q) => q != null) as Array<QuestionPresentable>).map((q) => ({
      kind: "question",
      ...q,
    })),
    ...(controller.groupIds
      .map((id) => GroupRepository.value.groups.find((g) => g.id === id))
      .filter((g) => g != null) as Array<GroupPresentable>).map((g) => ({
      kind: "group",
      ...g,
    })),
  ];

  // const items = useMemo(
  //   () => [
  //     ...(controller.questionIds
  //       .map((id) =>
  //         QuestionRepository.value.questions.find((q) => q.id === id)
  //       )
  //       .filter((q) => q != null) as Array<QuestionPresentable>).map((q) => ({
  //       kind: "question",
  //       ...q,
  //     })),
  //     ...(controller.groupIds
  //       .map((id) => GroupRepository.value.groups.find((g) => g.id === id))
  //       .filter((g) => g != null) as Array<GroupPresentable>).map((g) => ({
  //       kind: "group",
  //       ...g,
  //     })),
  //   ],
  //   [controller.groupIds, controller.questionIds]
  // );

  const { push } = useHistory();
  const navigateToProject = useCallback(() => {
    ShuttleController.value.pushShuttle<ToProjectShuttle>(
      projectPagePathname,
      new ToProjectShuttle(projectId, [id!])
    );
    push(buildProjectPagePathname(projectId!));
  }, [id, projectId, push]);

  if (!hasQuestionnaire) {
    return <Spinner />;
  }

  return (
    <Flex sx={{ flexDirection: "column", mt: 32 }}>
      {project && (
        <Box>
          <Badge
            style={{ verticalAlign: "super", cursor: "pointer" }}
            onClick={navigateToProject}
          >
            <FiArrowLeft style={{ verticalAlign: "text-top" }} /> {project.name}
          </Badge>
          <Badge variant="highlight" style={{ verticalAlign: "super" }}>
            {name}
          </Badge>
        </Box>
      )}
      <Flex sx={{ flexWrap: "nowrap" }}>
        <Box>
          <Heading>{name}</Heading>
          <Box>{description}</Box>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <IconButton aria-label={closed ? "Unlock" : "Lock"}>
            {closed && <FiUnlock />}
            {!closed && <FiLock />}
          </IconButton>
        </Box>
      </Flex>
      <DndProvider backend={HTML5Backend}>
        <div>
          {items.map((item, i) => (
            <React.Fragment>
              <DropArea position={i} />
              {item.kind === "group" ? (
                <Group
                  {...item}
                  isFirst={i === 0}
                  isLast={i + 1 === items.length}
                />
              ) : (
                <Question
                  {...item}
                  isFirst={i === 0}
                  isLast={i + 1 === items.length}
                />
              )}
            </React.Fragment>
          ))}
          <DropArea position={items.length} />
        </div>
      </DndProvider>
    </Flex>
  );
});
