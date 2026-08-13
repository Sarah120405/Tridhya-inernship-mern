export function validate(schema, source = "body") {
  return (req, res, next) => {
    const data = source === "params" ? req.params : req.body;
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    if (source === "params") {
      req.params = result.data;
    } else {
      req.body = result.data;
    }
    next();
  };
}
