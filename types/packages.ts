export type ItemType = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type AllowedItem = {
  id: number;
  package_item_id: number;
  allowed_count: number;
  created_at: string;
  updated_at: string;
};

export type PackageItemData = {
  id: number;
  package_id: number;
  type_id: number;
  status: string;
  notes: string | null;
  delivered_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  item_type: ItemType;
  allowed_item: AllowedItem | null; // Updated based on the API response
  type_name?: string; // Made optional as it's not present in the API response
};

export type PackageData = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  package_items: PackageItemData[]; // Updated to match API response
};

export type PackageResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: PackageData[];
};

export type SinglePackageResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: PackageData;
};

export type CreatePackageItemData = {
  type_id: number;
  status: string;
  notes: string | null;
};

export type CreatePackageData = {
  name: string;
  description: string;
  items?: CreatePackageItemData[];
};

export type AssignedPackageData = {
  id: number;
  client_id: number;
  package_id: number;
  chat_id: number;
  start_date: string | null;
  end_date: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  package?: PackageData; // Optional - might be included in expanded responses
};

export type AssignedPackageResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: AssignedPackageData;
};

export type AssignedPackagesListResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: AssignedPackageData[];
};
