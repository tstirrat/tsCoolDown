declare type AceCommChunkSentCallback<T> =
    (this: void, userArg: T, bytesSent: number, bytesTotal: number) => void;
declare type ChatThrottleLibPriority = 'NORMAL' | 'BULK' | 'ALERT';

/**
 * AceComm-3.0
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-comm-3-0
 */
declare interface AceComm {
  /**
   * Register for Addon Traffic on a specified prefix
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-comm-3-0
   */
  RegisterComm(prefix: string, method?: string|Function): void;

  /**
   * Send a message over the Addon Channel
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-comm-3-0
   */
  SendCommMessage<T = unknown>(
      prefix: string, text: string, distribution: WowAddonMessageType,
      target?: string, priority?: ChatThrottleLibPriority,
      callbackFn?: AceCommChunkSentCallback<T>, callbackArg?: T): void;
}
