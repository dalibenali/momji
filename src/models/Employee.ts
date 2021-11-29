export default interface Employee {
  id: Number;
  firstName: String;
  lastName: String;
  email: String;
  address: String;
  registered: Date;
  isActive: Boolean;
  team_id: Number;
  team: {
    id: Number;
    name: String;
    description: String;
    created_at: Date;
    updated_at: Date;
  };
  created_at: Date;
  updated_at: Date;
}
