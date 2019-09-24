/**
 * AceConfig-3.0
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-3-0
 */
declare interface AceConfig {
  /**
   * Register a option table with the AceConfig registry.
   *
   * You can supply a slash command (or a table of slash commands) to register
   * with AceConfigCmd directly.
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-3-0
   */
  RegisterOptionsTable(
      appName: string, options: unknown, slashCommand?: string|string[]): void;
}
