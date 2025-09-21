export type ConnectAgent = {
  setState: (state: any) => void;
};

export type ConnectContact = {
  accept: () => void;
  onConnecting: (handler: () => void) => void;
};

export type ConnectCore = {
  initCCP: (
    container: HTMLElement,
    opts: {
      ccpUrl: string;
      loginPopup?: boolean;
      softphone?: { allowFramedSoftphone?: boolean };
    }
  ) => void;
};

export type ConnectInterface = {
  core: ConnectCore;
  AgentStateType: { ROUTABLE: any };
  agent: (cb: (agent: ConnectAgent) => void) => void;
  contact: (cb: (contact: ConnectContact) => void) => void;
};
