// DTO stands for Data Transfer Object.
// It’s just a TypeScript interface (or class) that defines the shape of data being sent or received
// especially over the network (e.g. via an HTTP API).
// Think of it as: "What does a request or response look like?"

// represents the record table in the database
export interface RecordDTO {
    user_id: number;
    exercise: string;
    weight_kg: number;
    date_achieved: string; // ISO format string (e.g. "2025-03-26")
  }
  