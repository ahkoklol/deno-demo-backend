import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { client } from "../database/database.ts";
import { RecordDTO } from "../dtos/record.dto.ts";

type ContextWithParams = Context & {
  params: {
    id: string;
  };
};

export interface RecordResponseDTO extends RecordDTO {
  id: number;
}

// GET /records
export const getAllRecords = async (ctx: Context) => {
  try {
    const result = await client.queryObject("SELECT * FROM personal_records;");
    ctx.response.status = 200;
    ctx.response.body = result.rows;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error fetching records", error };
  }
};

// GET /records/:id
export const getRecordById = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const result = await client.queryObject("SELECT * FROM personal_records WHERE id = $1;", [id]);
    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Record not found" };
      return;
    }
    ctx.response.status = 200;
    ctx.response.body = result.rows[0] as RecordResponseDTO;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error fetching record", error };
  }
};

// POST /records
export const createRecord = async (ctx: Context) => {
  try {
    const { user_id, exercise, weight_kg, date_achieved } = await ctx.request.body({ type: "json" }).value as RecordDTO;

    if (!user_id || !exercise || !weight_kg || !date_achieved) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Missing required fields" };
      return;
    }

    await client.queryObject(
      "INSERT INTO personal_records (user_id, exercise, weight_kg, date_achieved) VALUES ($1, $2, $3, $4);",
      [user_id, exercise, weight_kg, date_achieved]
    );

    ctx.response.status = 201;
    ctx.response.body = { message: "Record created successfully" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error creating record", error };
  }
};

// PUT /records/:id
export const updateRecord = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const { user_id, exercise, weight_kg, date_achieved } = await ctx.request.body({ type: "json" }).value as RecordDTO;

    if (!user_id || !exercise || !weight_kg || !date_achieved) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Missing required fields" };
      return;
    }

    await client.queryObject(
      "UPDATE personal_records SET user_id=$1, exercise=$2, weight_kg=$3, date_achieved=$4 WHERE id=$5;",
      [user_id, exercise, weight_kg, date_achieved, id]
    );

    ctx.response.status = 200;
    ctx.response.body = { message: "Record updated successfully" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error updating record", error };
  }
};

// PATCH /records/:id
export const patchRecord = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const record = await ctx.request.body({ type: "json" }).value as Partial<RecordDTO>;

    const fields: string[] = [];
    const values: unknown[] = [];

    let i = 1;
    for (const [key, value] of Object.entries(record)) {
      fields.push(`${key}=$${i}`);
      values.push(value);
      i++;
    }

    if (fields.length === 0) {
      ctx.response.status = 400;
      ctx.response.body = { message: "No fields provided for update" };
      return;
    }

    const query = `UPDATE personal_records SET ${fields.join(", ")} WHERE id=$${i};`;
    values.push(id);

    await client.queryObject(query, values);

    ctx.response.status = 200;
    ctx.response.body = { message: "Record partially updated" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error updating record", error };
  }
};

// DELETE /records/:id
export const deleteRecord = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const result = await client.queryObject("DELETE FROM personal_records WHERE id=$1;", [id]);

    if (result.rowCount === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Record not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Record deleted successfully" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error deleting record", error };
  }
};
