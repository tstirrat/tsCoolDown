/** Valid embeddable Ace mixins */
declare type AceEmbedName = 'AceBucket-3.0' | 'AceConsole-3.0' | 'AceComm-3.0' |
    'AceConfigCmd-3.0' | 'AceConfigDialog-3.0' | 'AceConfigRegistry-3.0' |
    'AceConsole-3.0' | 'AceEvent-3.0' | 'AceHook-3.0' | 'AceSerializer-3.0' |
    'AceTimer-3.0';

declare interface AceAddonFactory {
  NewAddon(name: string, ...embeds: AceEmbedName[]): AceAddon;
}

/** AceAddon-3.0 */
declare interface AceAddon extends AceBucket, AceConfigCmd, AceConfigDialog,
                                   AceConsole, AceComm, AceDB {
  /* Called only once, when the addon is first loaded by the game client. */
  OnInitialize(): void;

  /**
   * Called when the addon is enabled, may be called more than once per session
   */
  OnEnable(): void;

  /** Called when the addon is disabled */
  OnDisable(): void;
}
