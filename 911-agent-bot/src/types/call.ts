export interface Call {
  callId: string;
  type?: string;
  priority?: string; // stored as string in DynamoDB
  stage?: string;
  startTs?: number;
  routedTs?: number;
  resolvedTs?: number;
  handledBy?: string;
}
