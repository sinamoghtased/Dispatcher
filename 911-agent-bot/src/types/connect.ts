export type AgentStateType = {
  ROUTABLE: string;
  // add more if you actually call them
};

export interface ConnectAgent {
  setState: (state: string) => void;
}

export interface ConnectContact {
  onConnecting: (callback: () => void) => void;
  accept: () => void;
}

export interface ConnectInterface {
  core: {
    initCCP: (
      container: HTMLElement,
      options: {
        ccpUrl: string;
        loginPopup: boolean;
        softphone: { allowFramedSoftphone: boolean; disableRingtone?: boolean };
      }
    ) => void;
  };
  agent: (callback: (agent: ConnectAgent) => void) => void;
  contact: (callback: (contact: ConnectContact) => void) => void;
  AgentStateType: AgentStateType;
}
