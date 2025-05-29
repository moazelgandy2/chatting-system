// Types for the actual API response structure

export type NewItemType = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type NewItemTypesResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: NewItemType[];
};

// This is the actual package item structure from the API
export type NewPackageItem = {
  id: number;
  package_id: number;
  type_id: number; // This maps to the item type ID
  status: string;
  notes: string | null;
  delivered_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
};

// This is the client package item structure from the API
export type ClientPackageItem = {
  id: number;
  client_package_id: number;
  item_type: string; // The item type name as a string
  package_item_id: number | null; // Reference to the package item
  content: string;
  media_url: string | null;
  status: string;
  client_note: string | null;
  handled_by: number | null;
  created_at: string;
  updated_at: string;
};

// Client limits structure
export type ClientLimit = {
  id: number;
  client_id: number;
  client_package_id: number;
  item_type: string;
  edit_limit: number;
  decline_limit: number;
  created_at: string;
  updated_at: string;
};

// Package structure from the API
export type PackageData = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  photo: string | null;
  package_items: NewPackageItem[];
};

export type NewClientPackageData = {
  id: number;
  client_id: number;
  package_id: number;
  chat_id: number;
  start_date: string | null;
  end_date: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  client_package_items: ClientPackageItem[];
  client_limits: ClientLimit[];
  package: PackageData;
};

export type NewClientPackageResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: NewClientPackageData;
};

// Enhanced package item with mapped item type name
export type EnhancedPackageItem = NewPackageItem & {
  item_type_name: string; // Mapped from type_id to item type name
};
