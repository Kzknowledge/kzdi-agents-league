/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Request Validation Middleware
 * ----------------------------------------------------------------------------
 * File: src/middleware/validation.ts
 *
 * Responsibilities
 * - Validate incoming request payloads
 * - Enforce Zod schemas
 * - Normalize validation errors
 * - Protect service layer
 * ============================================================================
 */

import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  ZodSchema,
  ZodError
} from "zod";

import {
  ValidationError
} from "./errorHandler";

import {
  createLogger
} from "../config/logger";


const logger =
  createLogger("ValidationMiddleware");


/**
 * Validation target
 */
export type ValidationTarget =
  | "body"
  | "query"
  | "params";


/**
 * Validate request using Zod schema
 */
export function validateRequest(

  schema: ZodSchema,

  target: ValidationTarget = "body"

) {

  return (

    req: Request,

    _res: Response,

    next: NextFunction

  ) => {

    try {

      const data =
        req[target];


      const result =
        schema.parse(data);


      /**
       * Replace original data
       * with validated/transformed data
       */
      req[target] = result;


      next();

    }

    catch(error) {


      if(error instanceof ZodError) {


        logger.warn(

          "Request validation failed",

          {

            metadata: {

              path:
                req.originalUrl,

              errors:
                error.errors

            }

          }

        );


        return next(

          new ValidationError(

            error.errors
              .map(
                issue =>
                  `${issue.path.join(".")}: ${issue.message}`
              )
              .join(", ")

          )

        );

      }


      next(error);

    }

  };

}
