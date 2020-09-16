/**
 * AceConfigCmd-3.0
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-cmd-3-0
 */
declare interface AceConfigCmd {
  /**
   * Utility function to create a slash command handler.Also registers tab
   * completion with AceTab
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-cmd-3-0
   */
  CreateChatCommand(slashCommand: string, appName: string): void;

  /**
   * Utility function that returns the options table that belongs to a
   * slash command. Designed to be used for the AceTab interface.
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-cmd-3-0
   */
  GetChatCommandOptions<T = unknown>(slashCommand: string): T|undefined;

  /**
   * Handle the chat command.
   *
   * This is usually called from a chat command handler to parse the command
   * input as operations on an Ace options table. `AceConfigCmd` uses this
   * function internally when a slash command is registered with
   * `:CreateChatCommand`
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-cmd-3-0
   */
  HandleCommand(slashCommand: string, appName: string, input?: string): void;
}
