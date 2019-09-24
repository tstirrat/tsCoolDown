declare type AceBucketHandle = unknown;

/**
 * AceBucket-3.0
 *
 * @see https://www.wowace.com/projects/ace3/pages/api/ace-bucket-3-0
 */
declare interface AceBucket {
  /**
   * Register a Bucket for an AceEvent-3.0 addon message (or a set of messages)
   *
   * @see https://www.wowace.com/projects/ace3/pages/api/ace-bucket-3-0
   */
  RegisterBucketMessage(
      message: string, interval: number,
      callback: string|Function): AceBucketHandle;

  /** @see https://www.wowace.com/projects/ace3/pages/api/ace-bucket-3-0 */
  UnregisterAllBuckets(): void;

  /** @see https://www.wowace.com/projects/ace3/pages/api/ace-bucket-3-0 */
  UnregisterBucket(handle: AceBucketHandle): void;
}
