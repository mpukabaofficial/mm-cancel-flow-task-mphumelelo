import { supabaseAdmin } from "@/lib/supabase";
import {
  updateCancellationSchema,
  uuidSchema,
  validateRequestBody,
} from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  handleDatabaseError,
  validateRouteParams,
  withErrorHandling,
} from "./requests";

const paramsSchema = z.object({
  id: uuidSchema,
});

// Route Handlers
export const GET = withErrorHandling(async (request, { params }) => {
  const paramValidation = await validateRouteParams(params, paramsSchema);
  if ("error" in paramValidation) return paramValidation.error;

  const { data, error } = await supabaseAdmin
    .from("cancellations")
    .select("*")
    .eq("id", paramValidation.data.id)
    .single();

  if (error) return handleDatabaseError(error);
  return NextResponse.json(data);
});

export const PATCH = withErrorHandling(async (request, { params }) => {
  const paramValidation = await validateRouteParams(params, paramsSchema);
  if ("error" in paramValidation) return paramValidation.error;

  // Validate request body
  const rawBody = await request.json();
  const bodyValidation = validateRequestBody(updateCancellationSchema, rawBody);

  if (!bodyValidation.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: bodyValidation.error,
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("cancellations")
    .update(bodyValidation.data)
    .eq("id", paramValidation.data.id)
    .select()
    .single();

  if (error) return handleDatabaseError(error);
  return NextResponse.json(data);
});

export const DELETE = withErrorHandling(async (request, { params }) => {
  const paramValidation = await validateRouteParams(params, paramsSchema);
  if ("error" in paramValidation) return paramValidation.error;

  const { error } = await supabaseAdmin
    .from("cancellations")
    .delete()
    .eq("id", paramValidation.data.id);

  if (error) return handleDatabaseError(error);
  return NextResponse.json({ message: "Cancellation deleted successfully" });
});
