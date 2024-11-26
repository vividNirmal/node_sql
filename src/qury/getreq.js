const Database = process.env.AZURE_SQL_DATABASE;

const getAllUsersQuery = `SELECT * FROM ${Database}.dbo.AuthTable`;
export const checkuserQuery = (data) => {
  return `SELECT * FROM ${Database}.dbo.AuthTable WHERE email = '${data.email}'`;
};
