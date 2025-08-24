import { NextRequest, NextResponse } from "next/server";
import { validateParams } from "@/lib/validations";
import { z } from "zod";

// Types
export type RouteParams = { params: Promise<{ id: string }> };
export type ApiHandler = (
  request: NextRequest,
  context: RouteParams
) => Promise<NextResponse>;

// Helper: Validate params and return standardized error
export async function validateRouteParams(
  params: Promise<{ id: string }>,
  schema: z.ZodSchema
) {
  const resolvedParams = await params;
  const validation = validateParams(resolvedParams, schema);

  if (!validation.success) {
    return {
      error: NextResponse.json(
        {
          error: "Invalid parameters",
          details: validation.error,
        },
        { status: 400 }
      ),
    };
  }

  return { data: resolvedParams };
}

// Helper: Standardized error responses
export function createErrorResponse(
  error: unknown,
  defaultMessage = "Internal server error"
) {
  console.error(error);
  return NextResponse.json({ error: defaultMessage }, { status: 500 });
}

// Helper: Database error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleDatabaseError(error: any) {
  const statusCode = error.code === "PGRST116" ? 404 : 400;
  return NextResponse.json({ error: error.message }, { status: statusCode });
}

// Wrapper for consistent error handling
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}
