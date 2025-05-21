export type ItemType = {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
};

export type ItemTypesResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: ItemType[];
};

export type SingleItemTypeResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: ItemType;
};
