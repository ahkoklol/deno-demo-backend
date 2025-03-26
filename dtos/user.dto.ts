// DTO stands for Data Transfer Object.
// It’s just a TypeScript interface (or class) that defines the shape of data being sent or received
// especially over the network (e.g. via an HTTP API).
// Think of it as: "What does a request or response look like?"

// represents the user table in the database
export interface UserDTO {
    name: string;
  }
  