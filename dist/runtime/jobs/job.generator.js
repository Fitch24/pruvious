import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { relativeImport } from "../utils/fs.js";
import { camelCase } from "../utils/string.js";
export function generateJobs(jobs, ts, tsServer) {
  const jobsArray = Object.values(jobs);
  const dotPruviousPath = resolveAppPath("./.pruvious");
  const definitionPath = resolveModulePath("./runtime/jobs/job.definition");
  ts.newDecl(
    `import type { JobDefinition, JobProcessContext, JobAfterProcessContext, ResolvedJobDefinition } from '${relativeImport(
      dotPruviousPath,
      definitionPath
    )}'`
  ).newLine(
    "export {  type JobDefinition, type JobProcessContext, type JobAfterProcessContext, type ResolvedJobDefinition }"
  );
  ts.newLine(`import { defineJob } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine(
    "export { defineJob }"
  );
  tsServer.newDecl(
    `export { processJob, processJobQueue, queueJob } from '${relativeImport(
      dotPruviousPath,
      resolveModulePath("./runtime/jobs/job.utils")
    )}'`
  );
  for (const [i, { definition, source }] of jobsArray.entries()) {
    const from = relativeImport(dotPruviousPath, source);
    tsServer.newDecl(`import { default as ${camelCase(definition.name)}JobDefinition } from '${from}'`);
    tsServer.newLine(`export { ${camelCase(definition.name)}JobDefinition }`);
  }
  tsServer.newDecl("export const jobs = {");
  for (const { definition } of jobsArray) {
    tsServer.newLine(`'${definition.name}': ${camelCase(definition.name)}JobDefinition,`);
  }
  tsServer.newLine("}");
}
