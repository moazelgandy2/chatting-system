export type PackageData = {
  id: number;
  name: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
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
