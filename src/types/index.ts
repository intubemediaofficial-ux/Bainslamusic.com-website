export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "YOUTUBE_MANAGER"
  | "COPYRIGHT_MANAGER"
  | "DESIGNER"
  | "STUDIO_STAFF"
  | "VIDEO_TEAM"
  | "ACCOUNTANT"
  | "ARTIST_CLIENT";

export type ClientType =
  | "ARTIST"
  | "SINGER"
  | "LABEL"
  | "STUDIO"
  | "COMPOSER"
  | "LYRICIST"
  | "VIDEO_CLIENT";

export type SongCategory =
  | "BHAJAN"
  | "RASIYA"
  | "DJ"
  | "FOLK"
  | "DEVOTIONAL"
  | "REMIX"
  | "FILM"
  | "OTHER";

export type SongStage =
  | "IDEA"
  | "LYRICS"
  | "SINGER_CONFIRMED"
  | "AGREEMENT_PENDING"
  | "AGREEMENT_SIGNED"
  | "RECORDING_BOOKED"
  | "RECORDING_DONE"
  | "MIXING"
  | "MASTERING"
  | "AUDIO_FINAL"
  | "ARTWORK_PENDING"
  | "ARTWORK_APPROVED"
  | "VIDEO_SHOOT_PENDING"
  | "VIDEO_SHOOT_DONE"
  | "EDITING"
  | "FINAL_VIDEO_READY"
  | "DISTRIBUTION_SUBMITTED"
  | "DISTRIBUTION_LIVE"
  | "YOUTUBE_SEO_READY"
  | "YOUTUBE_UPLOADED"
  | "RELEASED"
  | "COPYRIGHT_PROTECTED"
  | "REVENUE_STARTED";

export interface DashboardStats {
  totalSongs: number;
  songsPending: number;
  songsReleased: number;
  songsInRecording: number;
  songsInEditing: number;
  songsInDistribution: number;
  activeClients: number;
  paymentPending: number;
  copyrightCases: number;
  dmcaNotices: number;
  youtubeChannels: number;
  totalRevenue: number;
  monthRevenue: number;
  todaysTasks: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
