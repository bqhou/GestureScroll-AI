
export interface GestureResponse {
  handDetected: boolean;
  verticalPosition: number; // 0 (top) to 100 (bottom)
  confidence: number;
}

export interface CameraState {
  isActive: boolean;
  permissionGranted: boolean;
  error: string | null;
}
