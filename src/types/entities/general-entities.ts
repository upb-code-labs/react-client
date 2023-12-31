export type Course = {
  uuid: string;
  name: string;
  color: string;
};

export type EnrolledStudent = {
  uuid: string;
  institutional_id: string;
  full_name: string;
  is_active: boolean;
};

export type Student = {
  uuid: string;
  institutional_id: string;
  full_name: string;
};

export type Language = {
  uuid: string;
  name: string;
};
