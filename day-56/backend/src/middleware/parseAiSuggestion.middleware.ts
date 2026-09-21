import type { Request, Response, NextFunction } from "express";

const parseAiSuggestion = (req: Request, res: Response, next: NextFunction) => {
  if (typeof req.body.aiSuggestion === "string") {
    try {
      req.body.aiSuggestion = JSON.parse(req.body.aiSuggestion);
    } catch {
      return res.status(400).json({
        message: "Invalid aiSuggestion JSON.",
      });
    }
  }

  next();
};

export default parseAiSuggestion;
