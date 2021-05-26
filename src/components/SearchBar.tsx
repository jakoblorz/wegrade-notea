/** @jsx jsx */
import { jsx, Box, Field, Divider, Input } from "theme-ui";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useTranslation } from "../hooks/Translation";
import { observer } from "mobx-react";
import ProjectRepository from "../repositories/ProjectRepository";
import QuestionnaireRepository from "../repositories/QuestionnaireRepository";
import { useHistory } from "react-router";
import styled from "@emotion/styled";
import ResizeObserver from "resize-observer-polyfill";
import SearchBarController from "../controllers/views/SearchBarController";
import { ProjectPresentable } from "../../shared/ProjectAttributes";
import { QuestionnairePresentable } from "../../shared/QuestionnaireAttributes";

const Container = styled.div`
  width: 80%;
  max-width: 400vh;
  ${(props: { visible: boolean }) => (props.visible ? `box-shadow: ;` : "")}
  ${(props) => (props.visible ? "border-radius: ;" : "")}
`;

export interface SearchBarProps {}

export const SearchBar: React.FC<SearchBarProps> = observer(() => {
  const ref = useRef<HTMLDivElement>();
  const [container, setContainer] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });
  const [containerRo] = useState(
    () =>
      new ResizeObserver(([entry]) =>
        setContainer(entry.target.getBoundingClientRect())
      )
  );
  useEffect(() => {
    if (ref.current) containerRo.observe(ref.current);
    return () => containerRo.disconnect();
  }, [containerRo]);

  const { projectIds, questionnaireIds } = SearchBarController.value;
  const hints: Array<{ name: string; url: string }> = useMemo(
    () => [
      ...(projectIds
        .map((id) => ProjectRepository.value.projects.find((p) => p.id === id))
        .filter((p) => p != null) as Array<ProjectPresentable>).map(
        (p: ProjectPresentable) => ({
          name: p.name,
          url: `/p/${p.id}`,
        })
      ),
      ...(questionnaireIds
        .map((id) =>
          QuestionnaireRepository.value.questionnaires.find((q) => q.id === id)
        )
        .filter((q) => q != null) as Array<QuestionnairePresentable>).map(
        (q: QuestionnairePresentable) => ({
          name: q.name,
          url: `/${q.projectId === "" ? "t" : "q"}/${q.id}`,
        })
      ),
    ],
    [projectIds, questionnaireIds]
  );

  const history = useHistory();
  const navigateTo = useCallback((i: number) => history.push(hints[i].url), [
    hints,
    history,
  ]);

  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>();

  const [selectIndex, setSelectIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const onKeyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      // 80 = p
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        e.stopPropagation();

        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (!visible) {
          setVisible(true);
        }
      } else if (visible && e.key === "Escape") {
        setVisible(false);
      } else if ((e.key === "ArrowUp" || e.key === "Up") && selectIndex > 0) {
        setSelectIndex(selectIndex - 1);
      } else if (e.key === "ArrowDown" || e.key === "Down") {
        setSelectIndex(selectIndex + 1);
      } else if (e.keyCode === 13) {
        // 13 Enter
        navigateTo(selectIndex);
      }
    },
    [navigateTo, selectIndex, visible]
  );
  const onInputFocus = useCallback(() => {
    if (!visible) {
      setVisible(true);
    }
  }, [visible]);
  const onInputUnfocus = useCallback(() => {
    if (visible) {
      setVisible(false);
    }
  }, [visible]);
  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    return () => document.removeEventListener("keydown", onKeyDownHandler);
  }, [onKeyDownHandler]);

  const [query, setBaseQuery] = useState("");
  const setQuery = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!visible) {
        setVisible(true);
      }
      setBaseQuery(e.target.value);
      (async () => {
        try {
          SearchBarController.value.projectIds = (
            await ProjectRepository.value.loadProjects({
              name: {
                "%": e.target.value,
              },
            })
          ).ids;
        } catch (err) {}
        try {
          SearchBarController.value.questionnaireIds = (
            await QuestionnaireRepository.value.loadQuestionnaires({
              name: {
                "%": e.target.value,
              },
            })
          ).ids;
        } catch (err) {}
      })();
    },
    [visible]
  );

  return (
    <Box
      ref={ref as React.RefObject<HTMLDivElement>}
      sx={{
        mt: -1,
        ml: -2,
        mr: -2,
        width: "80%",
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          placeholder={t("components.searchBar.queryBar.label")}
          name="searchBarQuery"
          defaultValue=""
          value={query}
          onChange={setQuery}
          onFocus={onInputFocus}
          onBlur={onInputUnfocus}
        />
      </Box>
      {visible && (
        <Box
          sx={{
            backgroundColor: "background",
            position: "absolute",
            left: container.left,
            top: container.height + container.top,
            width: container.width,
            zIndex: 1000,
            boxShadow:
              "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
            borderRadius: "0px 0px 6px 6px",
          }}
        >
          <Box sx={{ pt: 1 }}>
            <Divider />
          </Box>
          {hints.map((h, i) => (
            <option
              onClick={() => navigateTo(i)}
              sx={{
                paddingLeft: "2",
                paddingRight: "2",
                ":hover": {
                  backgroundColor: "primary",
                  color: "background",
                  cursor: "pointer",
                },
                ...(i === selectIndex % hints.length
                  ? {
                      backgroundColor: "primary",
                      color: "background",
                    }
                  : {}),
                ...(i === hints.length - 1
                  ? {
                      borderRadius: `0px 0px 6px 6px`,
                    }
                  : {}),
              }}
              selected={i === selectIndex}
            >
              {h.name}
            </option>
          ))}
        </Box>
      )}
    </Box>
  );
});

export default SearchBar;
