import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/userController.ts";

export const userRoutes = (router: Router) => {
  router
    .get("/users", getAllUsers)
    .get("/users/:id", getUserById)
    .post("/users", createUser)
    .put("/users/:id", updateUser)
    .patch("/users/:id", patchUser)
    .delete("/users/:id", deleteUser);
};
