// Individual fields structure
export interface Fields {
  Name: string;
  Tags: string[];
  yourScore?: string | number;
  yourCompiteiter1?: string | number;
  yourCompiteiter2?: string | number;
  [key: string]: any; // For additional dynamic fields
}

// Single record structure
export interface ApiRecord {
  id: string;
  createdTime: string;
  fields: Fields;
}

// Main API response structure
export interface ApiResponse {
  records: ApiRecord[];
}

export interface GroupedData {
  [category: string]: ApiRecord[];
}
