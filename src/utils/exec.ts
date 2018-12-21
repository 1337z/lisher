import { execSync } from "child_process"

export const execRaw = execSync

/**
 * Execute a command syncronously with feedback
 * @param command Command to execute
 */
export const exec = (command: string) => {
  execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] })
}
