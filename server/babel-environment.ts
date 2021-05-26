import "core-js/stable";
import "regenerator-runtime/runtime";

import { config as loadEnv } from "dotenv";
loadEnv({ path: "./.env", debug: true });
loadEnv({ path: "./.env.secret", debug: true });
