export interface ZigbeeExposeFeature {
  type: string;
  name: string;
  property?: string;
  value_min?: number;
  value_max?: number;
  value_on?: string | boolean | number;
  value_off?: string | boolean | number;
  description?: string;
  access?: number;
  unit?: string;
  features?: ZigbeeExposeFeature[];
}

export interface ZigbeeOption {
  name: string;
  type: string;
  description?: string;
  access?: number;
  unit?: string;
}

export interface ZigbeeDefinition {
  source?: string;
  model?: string;
  vendor?: string;
  description?: string;
  supports_ota?: boolean;
  exposes: ZigbeeExposeFeature[];
  options: ZigbeeOption[];
}

export interface ZigbeeCluster {
  input?: string[];
  output?: string[];
}

export interface ZigbeeEndpoint {
  bindings?: Record<string, string>[];
  clusters?: ZigbeeCluster;
}

export interface ZigbeeDevice {
  friendly_name: string;
  ieee_address: string;
  type: string;
  definition?: ZigbeeDefinition;
  endpoints: Record<string, ZigbeeEndpoint>;

  manufacturer?: string;
  model_id?: string;
  network_address?: number;
  power_source?: string;
  supported?: boolean;
  interview_completed?: boolean;
  software_build_id?: string;
  date_code?: string;
}
