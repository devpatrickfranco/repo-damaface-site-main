// types/consultation.ts

export type QueueStatus = 'not_queued' | 'queued' | 'reserved';
export type SessionStatus = 'active' | 'disconnected' | 'ended' | 'cooldown';
export type SessionPhase = 'queue' | 'called' | 'active' | 'ending' | 'ended' | 'cooldown';

export interface QueueResponse {
  id: string;
  user: number;
  agent_type: string;
  status: QueueStatus;
  joined_at: string;
  position: number;
  estimated_wait_time: number;
}

export interface QueueStatusResponse {
  status: QueueStatus;
  position: number;
  estimated_wait_time?: number;
  agent_type?: string;
}

export interface SessionResponse {
  session: {
    id: string;
    user: number;
    agent_type: string;
    status: SessionStatus;
    heygen_session_id: string;
    started_at: string;
    last_heartbeat: string;
  };
  heygen_data: {
    session_id: string;
    session_token: string;
    ice_servers?: RTCIceServer[];
    sdp?: RTCSessionDescriptionInit;
    [key: string]: any;
  };
}

export interface WebRTCConfig {
  sessionId: string;
  sessionToken: string;
  iceServers?: RTCIceServer[];
  onTrack?: (event: RTCTrackEvent) => void;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}
