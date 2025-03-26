import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  patchRecord,
  deleteRecord,
} from "../controllers/recordController.ts";

export const recordRoutes = (router: Router) => {
  router
    .get("/records", getAllRecords)
    .get("/records/:id", getRecordById)
    .post("/records", createRecord)
    .put("/records/:id", updateRecord)
    .patch("/records/:id", patchRecord)
    .delete("/records/:id", deleteRecord);
};
