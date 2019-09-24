/**
 * AceConfigDialog-3.0
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-dialog-3-0
 */
declare interface AceConfigDialog {
  /**
   * Add an option table into the Blizzard Interface Options panel.
   *
   * You can optionally supply a descriptive name to use and a parent frame to
   * use, as well as a path in the options table. If no name is specified, the
   * appName will be used instead.
   *
   * If you specify a proper `parent` (by name), the interface options will
   * generate a tree layout. Note that only one level of children is supported,
   * so the parent always has to be a head-level note.
   *
   * This function returns a reference to the container frame registered with
   * the Interface Options. You can use this reference to open the options with
   * the API function `InterfaceOptionsFrame_OpenToCategory`.
   *
   * @param appName The application name as given to `:RegisterOptionsTable()`
   * @param name Name to display in the options tree
   * @param parent The parent (display text) to use in the options tree
   * @param path The path in the options table to feed into the interface
   *     options panel.
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-dialog-3-0
   */
  AddToBlizOptions(
      appName: string, name: string, parent: string, path?: string): WowFrame;

  /**
   * Close a specific options window.
   *
   * @param appName The application name as given to `:RegisterOptionsTable()`
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-dialog-3-0
   */
  Close(appName: string): void;

  /**
   * Close all options windows.
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-dialog-3-0
   */
  CloseAll(): void;

  /**
   * Open an option window at the specified path(if any).
   *
   * This function can optionally feed the group into a pre-created container
   * instead of creating a new container frame.
   *
   * @param appName The application name as given to `:RegisterOptionsTable()`
   * @param container An optional container frame to feed the options into
   * @param path The path to open after creating the options window (see
   *     `:SelectGroup` for details)
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-dialog-3-0
   */
  Open(appName: string, container?: string, path?: string): void;

  /**
   * Selects the specified path in the options window.
   *
   * The path specified has to match the keys of the groups in the table.
   *
   * @param appName The application name as given to `:RegisterOptionsTable()`
   * @param container An optional container frame to feed the options into
   * @param path The path to open after creating the options window (see
   *     `:SelectGroup` for details)
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-dialog-3-0
   */
  SelectGroup(appName: string, path?: string): void;

  /**
   * Sets the default size of the options window for a specific application.
   *
   * @param appName The application name as given to `:RegisterOptionsTable()`
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-config-dialog-3-0
   */
  SetDefaultSize(appName: string, width: number, height: number): void;
}
