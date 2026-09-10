import express from "express";
export function validate(schema: any, source = "body") {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const data = source === "params" ? req.params : req.body;
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        throw { status: 400, message: "Validation failed", details: errors };
      }
      if (source === "params") {
        req.params = result.data;
      } else {
        req.body = result.data;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
