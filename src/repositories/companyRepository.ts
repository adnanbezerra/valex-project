import { connection } from "../database.js";

export interface Company {
  id: number;
  name: string;
  apiKey?: string;
  rows: object[]
}

export async function findByApiKey(apiKey: string | string[]) {
  const result = await connection.query<Company, [string | string[]]>(
    `SELECT * FROM companies WHERE "apiKey"=$1`,
    [apiKey]
  );

  return result.rows[0];
}
