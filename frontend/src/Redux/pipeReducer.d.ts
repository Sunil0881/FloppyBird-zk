// Declare the module for pipeSlice
declare module './pipeSlice' {
    // Define the PipeState interface
    interface PipeState {
      startPosition: {
        x: number;
      };
      pipes: Array<{
        height: number;
      }>;
    }
  
    // Declare action payloads (if needed)
    interface PipeRunAction {
      type: 'pipe/pipeRun';
      payload?: undefined;
    }
  
    interface GeneratePipeAction {
      type: 'pipe/generatePipe';
      payload?: undefined;
    }
  
    interface PipeResetAction {
      type: 'pipe/pipeReset';
      payload?: undefined;
    }
  
    // Export the actions
    export const pipeRun: PipeRunAction;
    export const generatePipe: GeneratePipeAction;
    export const pipeReset: PipeResetAction;
  
    // Export the pipeSlice reducer
    export default function pipeReducer(state: PipeState, action: any): PipeState;
  }
  