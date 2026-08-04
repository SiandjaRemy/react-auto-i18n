import { program } from "commander";
import { logger } from "./utils/logger";

program
  .name("rai")
  .description(
    "Automatic i18n scanner and code transformer for React Native apps",
  )
  .version("0.1.0")
  /**
   * enablePositionalOptions prevents Commander from confusing
   * root-level flags (like --debug) with subcommand flags.
   */
  .enablePositionalOptions()
  .option("--debug", "Show verbose debug output")
  .hook("preAction", () => {
    if (program.opts().debug) {
      const { setDebugMode } = require("./utils/logger");
      setDebugMode(true);
    }
  });

// ─── init ─────────────────────────────────────────────────────────────────────
program
  .command("init")
  .description("Generate rai.config.ts with default settings")
  .option("-p, --path <path>", "Root path of the project", ".")
  .action(async (options) => {
    const { init } = await import("./commands/init");
    await init(options);
  });

// ─── scan ─────────────────────────────────────────────────────────────────────
program
  .command("scan")
  .description("Scan the app and generate locale files")
  .option("-p, --path <path>", "Root path of the project", ".")
  .option("--dry-run", "Preview without writing files")
  .action(async (options) => {
    const { scan } = await import("./commands/scan");
    await scan(options);
  });

// ─── replace ──────────────────────────────────────────────────────────────────
program
  .command("replace")
  .description("Replace raw strings in source files with t() calls")
  .option("-p, --path <path>", "Root path of the project", ".")
  .option("--dry-run", "Preview without writing files")
  .action(async (options) => {
    const { replace } = await import("./commands/replace");
    await replace(options);
  });

program.parse(process.argv);
