export class Layer {
  id: string;
  type: string;
  enabled: boolean;
  parameters: any;

  constructor(type: string, enabled: boolean, parameters: any) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.enabled = enabled;
    this.parameters = parameters;
  }
}
