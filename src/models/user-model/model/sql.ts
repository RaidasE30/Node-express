const SELECT = `
  SELECT id, first_name, last_name, email, password, role
  FROM users
`;

const SQL = {
  SELECT,
};

export default SQL;
