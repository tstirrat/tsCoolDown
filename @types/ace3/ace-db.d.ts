declare type AceDBProfileType = 'factionrealm' | 'global' | 'locale' |
    'profile' | 'faction' | 'class' | 'race' | 'realm' | 'char';

declare type AceDBEvent = 'OnProfileChanged' | 'OnProfileDeleted' |
    'OnProfileCopied' | 'OnProfileReset' | 'OnDatabaseReset' |
    'OnProfileShutdown' | 'OnDatabaseShutdown';
declare type AceDBEventCallback = (profile: string) => void;

/**
 * AceDB-3.0 Factory
 *
 * Usage:
 *
 * ```lua
 * local db = LibStub("AceDB-3.0"):New("MyAddonDB", defaults, true)
 * ```
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
 */
declare interface AceDBFactory {
  /**
   * Creates a new database object that can be used to handle database settings
   * and profiles. By default, an empty DB is created, using a character
   * specific profile.
   *
   * You can override the default profile used by passing any profile name as
   * the third argument, or by passing true as the third argument to use a
   * globally shared profile called "Default".
   *
   * Note that there is no token replacement in the default profile name,
   * passing a defaultProfile as "char" will use a profile named "char", and not
   * a character-specific profile.
   *
   * Usage:
   *
   * ```
   * // declare defaults to be used in the DB
   * const defaults = {
   *   profile: {
   *     setting: true,
   *   }
   * };
   *
   * // Assuming the .toc says ## SavedVariables: MyAddonDB
   * const db = LibStub('AceDB-3.0').New('MyAddonDB', defaults, true);
   * ```
   *
   * @param tbl The name of variable, or table to use for the database
   * @param defaults A table of database defaults
   * @param defaultProfile The name of the default profile. If not set, a
   *     character specific profile will be used as the default. You can also
   *     pass true to use a shared global profile called "Default".
   */
  New<T extends Object = {}>(
      tbl: string|Object, defaults?: {}, defaultProfile?: string): AceDB<T>;
}

/**
 * AceDB-3.0
 *
 * Usage:
 *
 * ```lua
 * local db = LibStub("AceDB-3.0"):New("MyAddonDB", defaults, true)
 * ```
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
 */
declare interface AceDB<T extends Object = {}> extends AceDBNamespace<T> {
  /**
   * Copies a named profile into the current profile, overwriting any
   * conflicting settings.
   *
   * @param name The name of the profile to be copied into the current profile
   * @param silent If true, do not raise an error when the profile does not
   *     exist
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  CopyProfile(name: string, silent?: boolean): void;

  /**
   * Deletes a named profile.
   *
   * This profile must not be the active profile.
   *
   * @param name The name of the profile to be deleted
   * @param silent If true, do not raise an error when the profile does not
   *     exist
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  DeleteProfile(name: string, silent?: boolean): void;

  /**
   * Returns the current profile name used by the database
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  GetCurrentProfile(): string;

  /**
   * Returns an already existing namespace from the database object.
   *
   * Usage:
   *
   * ```lua
   * local namespace = db:GetNamespace('namespace')
   * ```
   *
   * @param name The name of the new namespace
   * @param silent if true, the addon is optional, silently return nil if its
   *     not found
   *
   * @returns the namespace object if found
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  GetNamespace<T extends Object = {}>(name: string, silent?: boolean):
      AceDBNamespace<T>;

  /**
   * Returns a table with the names of the existing profiles in the database.
   *
   * @param tbl a table to re-use
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  GetProfiles<T extends Object = {}>(tbl?: Object): T;

  /**
   * Fires when profiles are changed, created, deleted or reset.
   *
   * @see https://www.wowace.com/projects/ace3/pages/ace-db-3-0-tutorial
   */
  RegisterCallback(event: 'OnNewProfile', cb: AceDBEventCallback): void;
  RegisterCallback(event: 'OnProfileChanged', cb: AceDBEventCallback): void;
  RegisterCallback(event: 'OnProfileDeleted', cb: AceDBEventCallback): void;
  RegisterCallback(event: 'OnProfileCopied', cb: AceDBEventCallback): void;
  RegisterCallback(event: 'OnProfileReset', cb: () => void): void;
  RegisterCallback(event: 'OnDatabaseReset', cb: () => void): void;
  RegisterCallback(event: 'OnProfileShutdown', cb: () => void): void;
  RegisterCallback(event: 'OnDatabaseShutdown', cb: () => void): void;
  RegisterCallback(event: AceDBEvent, cb: AceDBEventCallback): void;

  /**
   * Creates a new database namespace, directly tied to the database.
   *
   * This is a full scale database in it's own rights other than the fact that
   * it cannot control its profile individually.
   *
   * @param name The name of the new namespace
   * @param defaults A table of values to use as defaults
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  RegisterNamespace(name: string, defaults: Object): void;

  /**
   * Resets the entire database, using the string defaultProfile as the new
   * default profile.
   *
   * @param defaultProfile The profile name to use as the default
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  ResetDB(defaultProfile: string): void;

  /**
   * Changes the profile of the database and all of it's namespaces to the
   * supplied named profile
   *
   * @param name The name of the profile to set as the current profile
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  SetProfile(name: string): void;
}

/** AceDB-3.0 namespace, like a DB, without profile capability. */
interface AceDBNamespace<T extends Object = {}> {
  /** Character-specific data. Every character has its own database. */
  char: T

  /**
   * Realm-specific data. All of the players characters on the same realm share
   * this database.
   */
  realm: T

  /**
   * Class-specific data. All of the players characters of the same class share
   * this database.
   */
  class: T

  /**
   * Race-specific data. All of the players characters of the same race share
   * this database.
   */
  race: T

  /**
   * Faction-specific data. All of the players characters of the same faction
   * share this database.
   */
  faction: T

  /**
   * Faction and realm specific data. All of the players characters on the same
   * realm and of the same faction share this database.
   */
  factionrealm: T

  /** Locale specific data, based on the locale of the players game client. */
  locale: T

  /** Global Data. All characters on the same account share this database. */
  global: T

  /**
   * Profile-specific data. All characters using the same profile share this
   * database. The user can control which profile should be used.
   */
  profile: T

  /**
   * Sets the defaults table for the given database object by clearing any that
   * are currently set, and then setting the new defaults.
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  RegisterDefaults(defaults: Object): void;

  /**
   * Resets the current profile to the default values (if specified).
   *
   * @param noChildren if set to true, the reset will not be populated to the
   *     child namespaces of this DB object
   * @param noCallbacks if set to true, won't fire the OnProfileReset callback
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-db-3-0
   */
  ResetProfile(noChildren?: boolean, noCallbacks?: boolean): void;
}
