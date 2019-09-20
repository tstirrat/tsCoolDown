declare interface GlobalOptions {
  x?: number;
  y?: number;
}

declare var tsCoolDown_Db: GlobalOptions;



// TODO move these into @types/blah

declare interface AceAddonFactory {
  NewAddon(name: string): AceAddon;
}

declare interface AceAddon {
  OnInitialize(): void;
  OnEnable(): void;
  OnDisable(): void;
}


declare function LibStub(this: void, lib: 'AceAddon-3.0'): AceAddonFactory;
declare function LibStub(this: void, lib: string): {};