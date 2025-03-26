import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { client } from "../database/database.ts";
import { UserDTO } from "../dtos/user.dto.ts";

type ContextWithParams = Context & {
  params: {
    id: string;
  };
};

export interface UserResponseDTO extends UserDTO {
    id: number;
  }

// GET /users
export const getAllUsers = async (ctx: Context) => {
  try {
    const result = await client.queryObject("SELECT * FROM users;");
    ctx.response.status = 200;
    ctx.response.body = result.rows;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error fetching users", error };
  }
};

// GET /users/:id
export const getUserById = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const result = await client.queryObject("SELECT * FROM users WHERE id = $1;", [id]);
    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }
    ctx.response.status = 200;
    ctx.response.body = result.rows[0] as UserResponseDTO;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error fetching user", error };
  }
};

// POST /users
export const createUser = async (ctx: Context) => {
  try {
    const { name } = await ctx.request.body({ type: "json" }).value as UserDTO;

    if (!name) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Missing 'name' field" };
      return;
    }

    await client.queryObject("INSERT INTO users (name) VALUES ($1);", [name]);
    ctx.response.status = 201;
    ctx.response.body = { message: "User created successfully" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error creating user", error };
  }
};

// PUT /users/:id
export const updateUser = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const { name } = await ctx.request.body({ type: "json" }).value as UserDTO;

    if (!name) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Missing 'name' field" };
      return;
    }

    await client.queryObject("UPDATE users SET name=$1 WHERE id=$2;", [name, id]);
    ctx.response.status = 200;
    ctx.response.body = { message: "User updated successfully" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error updating user", error };
  }
};

// PATCH /users/:id
export const patchUser = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const { name } = await ctx.request.body({ type: "json" }).value as Partial<UserDTO>;

    if (!name) {
      ctx.response.status = 400;
      ctx.response.body = { message: "No fields to update" };
      return;
    }

    await client.queryObject("UPDATE users SET name=$1 WHERE id=$2;", [name, id]);
    ctx.response.status = 200;
    ctx.response.body = { message: "User partially updated" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error updating user", error };
  }
};

// DELETE /users/:id
export const deleteUser = async (ctx: ContextWithParams) => {
  const id = ctx.params.id;
  try {
    const result = await client.queryObject("DELETE FROM users WHERE id=$1;", [id]);

    if (result.rowCount === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "User deleted successfully" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error deleting user", error };
  }
};
