// Declare the module for birdSlice
declare module './birdSlice' {
    // Define the BirdState interface
    interface BirdState {
      bird: {
        y: number;
        rotation: number;
      };
    }
  
    // Declare action payloads (if needed)
    interface FlyAction {
      type: 'bird/fly';
      payload?: undefined;
    }
  
    interface FallAction {
      type: 'bird/fall';
      payload?: undefined;
    }
  
    interface BirdResetAction {
      type: 'bird/birdReset';
      payload?: undefined;
    }
  
    // Export the actions
    export const fly: FlyAction;
    export const fall: FallAction;
    export const birdReset: BirdResetAction;
  
    // Export the birdSlice reducer
    export default function birdReducer(state: BirdState, action: any): BirdState;
  }
  