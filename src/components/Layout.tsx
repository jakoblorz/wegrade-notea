/** @jsx jsx */
import { jsx, Styled, useColorMode } from "theme-ui";
import React, { useState, useRef, useEffect } from "react";
import { Flex, Box, Text } from "@theme-ui/components";
import { Link, useLocation, useHistory } from "react-router-dom";
import { observer } from "mobx-react";

import Head from "./Head";
import MenuButton from "./MenuButton";
import NavLink from "./NavLink";
import Tree from "./Tree";

import AccountRepository from "../repositories/AccountRepository";
import { useTranslation } from "../hooks/Translation";
import SearchBar from "./SearchBar";
import ProjectRepository from "../repositories/ProjectRepository";
import TemplateRepository from "../repositories/TemplateRepository";

import {
  FiGithub,
  FiFolder,
  FiFolderMinus,
  FiFolderPlus,
  FiFileText,
  FiActivity,
  FiDatabase,
  FiTrash2,
} from "react-icons/fi";
import QuestionnaireRepository from "../repositories/QuestionnaireRepository";
import { buildQuestionnairePagePathname } from "../pages/Questionnaire";

const TreeView = () => {
  const { push } = useHistory();
  useEffect(() => {
    ProjectRepository.value.loadProjects({});
    TemplateRepository.value.loadTemplates({});
  }, []);
  const {
    questionnaires,
    questionnaire,
    hasQuestionnaire,
  } = QuestionnaireRepository.value;
  const { projects, project, hasProject } = ProjectRepository.value;
  const { templates, template, hasTemplate } = TemplateRepository.value;
  return (
    <React.Fragment>
      <Tree name="Open Projects" defaultOpen view={() => FiActivity}>
        {projects
          .filter((p) => !p.closed)
          .map((p) => (
            <Tree
              name={p.name}
              onLoad={() => ProjectRepository.value.touchChildrenOf(p.id)}
              onClick={() => push(`/p/${p.id}`)}
              defaultOpen={hasQuestionnaire && questionnaire.projectId === p.id}
              selected={hasProject && project.id === p.id}
              view={(state) => {
                switch (state) {
                  case "close":
                    return FiFolderMinus;
                  case "open":
                    return FiFolderPlus;
                  case "disabled":
                    return FiFolder;
                }
              }}
            >
              {questionnaires
                .filter((q) => q.projectId === p.id)
                .map((q) => (
                  <Tree
                    name={q.name}
                    onClick={() => push(buildQuestionnairePagePathname(q.id))}
                    selected={hasQuestionnaire && questionnaire.id === q.id}
                    view={(state) => FiFileText}
                  ></Tree>
                ))}
            </Tree>
          ))}
      </Tree>
      <br />
      <Tree
        name="Templates"
        onLoad={() => TemplateRepository.value.loadTemplates({})}
        view={(state) => FiDatabase}
      >
        {templates.map((t) => (
          <Tree
            name={t.name}
            onClick={() => push(`/t/${t.id}`)}
            selected={hasQuestionnaire && questionnaire.id === t.id}
            view={(state) => FiFileText}
          ></Tree>
        ))}
      </Tree>
      <br />
      <Tree
        name="Closed Projects"
        onLoad={() => ProjectRepository.value.loadProjects({ closed: true })}
        view={(state) => FiTrash2}
      >
        {projects
          .filter((p) => p.closed)
          .map((p) => (
            <Tree
              name={p.name}
              onLoad={() => ProjectRepository.value.touchChildrenOf(p.id)}
              onClick={() => push(`/p/${p.id}`)}
              defaultOpen={hasQuestionnaire && questionnaire.projectId === p.id}
              selected={hasProject && project.id === p.id}
              view={(state) => {
                switch (state) {
                  case "close":
                    return FiFolderMinus;
                  case "open":
                    return FiFolderPlus;
                  case "disabled":
                    return FiFolder;
                }
              }}
            >
              {questionnaires
                .filter((q) => q.projectId === p.id)
                .map((q) => (
                  <Tree
                    name={q.name}
                    onClick={() => push(`/q/${q.id}`)}
                    selected={hasQuestionnaire && questionnaire.id === q.id}
                    view={(state) => FiFileText}
                  ></Tree>
                ))}
            </Tree>
          ))}
      </Tree>
    </React.Fragment>
  );
};

const modes = ["default", "dark", "deep", "swiss"] as const;
const getModeName = (mode: typeof modes[number]) => {
  switch (mode) {
    case "dark":
      return "Dark";
    case "deep":
      return "Deep";
    case "swiss":
      return "Swiss";
    case "default":
      return "Light";
    default:
      return mode;
  }
};

export type LayoutProps = {
  title: string;
};

export const Layout: React.FC<LayoutProps> = observer((props) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const nav = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useColorMode<typeof modes[number]>();
  const location = useLocation();
  const fullwidth = location.pathname === "/";

  const cycleMode = () => {
    const i = modes.indexOf(mode);
    const next = modes[(i + 1) % modes.length];
    setMode(next);
  };

  const { t } = useTranslation();
  const { hasUser, user } = AccountRepository.value;

  return (
    <Styled.root>
      <Head {...props} />
      <Flex
        sx={{
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Flex
          as="header"
          sx={{
            zIndex: 2,
            height: 64,
            px: 3,
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow:
              "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
            bg: "background",
            position: "fixed",
            width: "100%",
          }}
        >
          <Flex sx={{ alignItems: "center" }}>
            <MenuButton
              menuClosed={!menuOpen}
              onClick={() => {
                setMenuOpen(!menuOpen);
                if (!nav.current) return;
                // const navLink = nav.current.querySelector("a");
                // if (navLink) navLink.focus();
                nav.current.focus();
              }}
            />
            <Link to="/" sx={{ variant: "links.nav" }}>
              {t("page.name")}
            </Link>
          </Flex>
          <Flex
            sx={{
              justifyContent: "space-around",
              width: "80%",
              display: ["none", "flex"],
            }}
          >
            {hasUser && <SearchBar />}
          </Flex>
          <Flex>
            {hasUser ? (
              <NavLink href="/user">
                {user ? user.username : t("layout.nav.no-name-placeholder")}
              </NavLink>
            ) : (
              <React.Fragment>
                <NavLink
                  href="/oauth2/github"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <FiGithub sx={{ mr: 1 }} />
                  {t("layout.nav.login-with-github-cta")}
                </NavLink>
              </React.Fragment>
            )}
          </Flex>
        </Flex>

        <Box
          sx={{
            flex: "1 1 auto",
            alignItems: "flex-start",
            display: ["block", "flex"],
            height: "100%",
            backgroundColor: "#fafbfd",
          }}
        >
          <div
            ref={nav}
            role="navigation"
            sx={{
              display: [null, fullwidth ? "none" : "block"],
              width: ["100%", 256],
              flex: "none",
              maxHeight: ["100%", "calc(100vh - 64px)"],
              overflowY: "auto",
              px: 3,
              py: 3,
              mt: [menuOpen ? 64 : 0, 96],
            }}
            onFocus={() => {
              setMenuOpen(true);
            }}
            // onBlur={() => {
            //   setMenuOpen(false);
            // }}
            // onClick={() => {
            //   setMenuOpen(false);
            // }}
            // onKeyPress={() => {
            //   setMenuOpen(false);
            // }}
          >
            {hasUser && menuOpen && (
              // <div
              //   onFocus={(e) => e.preventDefault()}
              //   onBlur={(e) => e.preventDefault()}
              //   onClick={(e) => e.preventDefault()}
              //   onKeyPress={(e) => e.preventDefault()}
              // >
              //   <Text variant={"caps"} sx={{ color: "darken" }}>
              //     All
              //   </Text>
              <TreeView />
              // </div>
            )}
          </div>
          <hr
            sx={{
              opacity: [1, 0],
            }}
          />
          <div
            sx={{
              display: ["none", null],
              width: "2px",
              height: "100%",
              margin: "1rem",
              border: "2px solid #808080",
            }}
          />
          <main
            id="content"
            sx={{
              width: "100%",
              minWidth: 0,
              maxWidth: fullwidth ? "none" : 1024,
              mt: [0, 64],
              mx: "auto",
              px: fullwidth ? 0 : 3,
            }}
          >
            {props.children}
            {/* {!fullwidth && <Pagination />} */}
          </main>
        </Box>
      </Flex>
    </Styled.root>
  );
});

export default Layout;
