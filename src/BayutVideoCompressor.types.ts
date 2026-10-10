/**
 * Bayut Video Compressor Types
 * Hardware-accelerated video compression for React Native
 */

/**
 * Codec to use for compression.
 * - 'h264': Widest compatibility, fast hardware encoding
 * - 'hevc': 50% smaller output, modern HW encoders (iOS 11+, Android 5+)
 */
export type CompressionCodec = 'h264' | 'hevc';

/**
 * Speed preset for compression.
 * - 'ultrafast': Prioritize speed over compression ratio
 * - 'fast': Good balance of speed and quality
 * - 'balanced': Best compression ratio, slower
 */
export type CompressionSpeed = 'ultrafast' | 'fast' | 'balanced';

/**
 * Rate control mode.
 * - 'vbr': Variable bitrate. `bitrate` is a target average; the encoder floats with content complexity.
 * - 'cbr': Constant bitrate. Android requests BITRATE_MODE_CBR (falls back to VBR if the encoder
 *   lacks support). iOS has no guaranteed CBR through AVAssetWriter, so it uses the average bitrate
 *   plus a tight 1-second data-rate cap as the closest approximation.
 */
export type BitrateMode = 'vbr' | 'cbr';

/**
 * Options for video compression.
 */
export type CompressOptions = CompressOptionsBase &
  (
    | {
        /**
         * Rate control mode.
         * Default: 'vbr'
         */
        bitrateMode?: 'vbr';

        /**
         * Peak bitrate cap in bits per second. VBR only.
         * - iOS: applied via `kVTCompressionPropertyKey_DataRateLimits` (1-second window); enforced.
         * - Android: passed as the `max-bitrate` MediaFormat key; only honored by some encoders.
         * Default: no cap.
         * Example: 2_500_000 for 2.5 Mbps
         */
        bitrateMax?: number;
      }
    | {
        bitrateMode: 'cbr';
        bitrateMax?: never;
      }
  );

export interface CompressOptionsBase {
  /**
   * Target bitrate in bits per second.
   * Default: auto-calculated based on resolution.
   * Example: 2_500_000 for 2.5 Mbps
   */
  bitrate?: number;

  /**
   * Maximum keyframe (I-frame) interval in seconds.
   * Shorter = faster seeking and error recovery, larger files; longer = better compression.
   * Default: 1 on Android, encoder default on iOS.
   */
  keyframeInterval?: number;

  /**
   * Maximum output dimension (width or height).
   * The video will be scaled proportionally.
   * Default: 1080
   */
  maxSize?: number;

  /**
   * Video codec to use.
   * Default: 'h264'
   */
  codec?: CompressionCodec;

  /**
   * Compression speed preset.
   * Default: 'ultrafast'
   */
  speed?: CompressionSpeed;

  /**
   * Minimum file size in MB before compression applies.
   * Videos smaller than this will be returned as-is.
   * Default: 0 (always compress)
   */
  minimumFileSizeForCompress?: number;

  /**
   * Callback to receive the cancellation ID.
   * Use this ID with `cancel()` to stop compression.
   */
  getCancellationId?: (id: string) => void;

  /**
   * Divider for progress events.
   * 0 = every frame, 5 = every 5%.
   * Default: 0
   */
  progressDivider?: number;

  /**
   * Internal session ID for tracking and cancellation.
   * If not provided, one will be generated.
   */
  uuid?: string;
}

/**
 * Payload for compression progress events.
 */
export type CompressionProgressPayload = {
  /** Progress value from 0.0 to 1.0 */
  progress: number;
  /** Unique compression session ID */
  uuid: string;
};

/**
 * Video metadata information.
 */
export interface VideoMetadata {
  /** Video width in pixels */
  width: number;
  /** Video height in pixels */
  height: number;
  /** Duration in seconds */
  duration: number;
  /** File size in bytes */
  size: number;
  /** Video bitrate in bps */
  bitrate?: number;
  /** File extension */
  extension: string;
}

/**
 * Module event types.
 */
export type BayutVideoCompressorModuleEvents = {
  onCompressProgress: (params: CompressionProgressPayload) => void;
  onBackgroundTaskExpired: () => void;
};

/**
 * Output image format.
 */
export type ImageOutputType = 'jpg' | 'png';

/**
 * Options for image compression.
 */
export interface ImageCompressOptions {
  /**
   * Maximum width boundary for the output image.
   * Default: 1280
   */
  maxWidth?: number;

  /**
   * Maximum height boundary for the output image.
   * Default: 1280
   */
  maxHeight?: number;

  /**
   * JPEG compression quality (0.0 - 1.0).
   * Ignored when output is 'png'.
   * Default: 0.8
   */
  quality?: number;

  /**
   * Output image format.
   * Default: 'jpg'
   */
  output?: ImageOutputType;

  /**
   * Input type.
   * Default: 'uri'
   */
  input?: 'uri' | 'base64';
}
