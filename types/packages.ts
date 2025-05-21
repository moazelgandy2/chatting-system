export type PackageItemData = {
  id: number;
  package_id: number;
  type_id: number;
  status: string;
  notes: string | null;
  created_by: number;
  created_at: string | null;
  updated_at: string | null;
};

export type PackageData = {
  id: number;
  name: string;
  src: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  items?: PackageItemData[]; // Optional array of items
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
