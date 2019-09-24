declare type ChatCommandHandler = (this: void, args: string) => void;

/**
 * AceConsole-3.0
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-console-3-0
 */
declare interface AceConsole {
  /**
   * Retrieve one or more space-separated arguments from a string.
   *
   * Treats quoted strings and item links as non-spaced.
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-console-3-0
   *
   * @tupleReturn
   * @returns arg1, arg2, ..., <next-position>
   */
  GetArgs(str: string, numArgs: number, startPos: number): (string|number)[];

  /**
   * Get an iterator over all Chat Commands registered with AceConsole
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-console-3-0
   */
  IterateChatCommands(): Iterator<string>;

  /**
   * Print to `DEFAULT_CHAT_FRAME` or given ChatFrame (anything with an
   * .AddMessage function)
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-console-3-0
   */
  Print(chatFrame: WowChatFrame, ...args: unknown[]): void;

  /**
   * Formatted (using format()) print to `DEFAULT_CHAT_FRAME` or given ChatFrame
   * (anything with an .AddMessage function)
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-console-3-0
   */
  Printf(chatFrame: WowChatFrame, format: string, ...args: unknown[]): void;

  /**
   * Register a simple chat command
   *
   * @param command Chat command to be unregistered **WITHOUT** leading `/`
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-console-3-0
   */
  RegisterChatCommand(
      command: string, handler: ChatCommandHandler, persist?: boolean): void;

  /**
   * Unregister a chat command
   *
   * @param command Chat command to be unregistered **WITHOUT** leading `/`
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-console-3-0
   */
  UnregisterChatCommand(command: string): void;
}
