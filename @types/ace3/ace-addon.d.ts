
declare interface AceAddonFactory {
  NewAddon(name: string, ...embeds: AceMixinName[]): AceAddon;
}

declare type AceMixinName = 'AceBucket-3.0' | 'AceConsole-3.0' | 'AceComm-3.0' |
    'AceConfigCmd-3.0' | 'AceConfigDialog-3.0' | 'AceConfigRegistry-3.0' |
    'AceConsole-3.0' | 'AceDB-3.0' | 'AceDBOptions-3.0' | 'AceEvent-3.0' |
    'AceGUI-3.0' | 'AceHook-3.0' | 'AceLocale-3.0' | 'AceSerializer-3.0' |
    'AceTab-3.0' | 'AceTimer-3.0';

/** AceAddon-3.0 */
declare interface AceAddon extends AceBucket, AceConfigCmd, AceConfigDialog,
                                   AceConsole, AceComm, AceDB {
  OnInitialize(): void;
  OnEnable(): void;
  OnDisable(): void;
}
