"use strict";

const fs = require("node:fs");
const path = require("node:path");

const POST_FILE_NAME = "POST.json";
const DEFAULT_BOT_DIRECTORY = "/bot";
const DEFAULT_OUTPUT_DIRECTORY = "/output";

function directoryFromEnvironment(variableName, fallback) {
  const value = process.env[variableName];
  return value === undefined || value.trim() === "" ? fallback : value;
}

function describeFailure(error) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  if (error.cause instanceof Error && error.cause.message) {
    return `${error.message}: ${error.cause.message}`;
  }

  return error.message;
}

function copyPostFile() {
  const botDirectory = path.resolve(
    directoryFromEnvironment("MAKEFUN_BOT_DIR", DEFAULT_BOT_DIRECTORY)
  );
  const outputDirectory = path.resolve(
    directoryFromEnvironment("MAKEFUN_OUTPUT_DIR", DEFAULT_OUTPUT_DIRECTORY)
  );
  const sourceFile = path.join(botDirectory, POST_FILE_NAME);
  const destinationFile = path.join(outputDirectory, POST_FILE_NAME);

  try {
    fs.mkdirSync(outputDirectory, { recursive: true });
  } catch (cause) {
    throw new Error(`Could not create output directory "${outputDirectory}"`, { cause });
  }

  try {
    fs.copyFileSync(sourceFile, destinationFile);
  } catch (cause) {
    throw new Error(
      `Could not copy "${sourceFile}" to "${destinationFile}"`,
      { cause }
    );
  }
}

try {
  copyPostFile();
} catch (error) {
  console.error(`main.ts failed: ${describeFailure(error)}`);
  process.exitCode = 1;
}
