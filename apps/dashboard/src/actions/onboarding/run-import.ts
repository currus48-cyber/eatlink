"use server";

import { runImportEngine } from "@/lib/import-engine";
import { ImportEngineError, type RestaurantImportData } from "@/lib/import-engine/types";
import type { ActionState } from "@/lib/action-state";

export type ImportActionState = ActionState<"url"> & {
  data?: RestaurantImportData;
  url?: string;
};

export async function runImportAction(
  _prevState: ImportActionState,
  formData: FormData,
): Promise<ImportActionState> {
  const url = formData.get("url");

  if (typeof url !== "string" || !url.trim()) {
    return {
      status: "error",
      message: "Merci de coller une URL.",
      fieldErrors: { url: ["L'URL est requise."] },
    };
  }

  try {
    const data = await runImportEngine(url);
    return { status: "success", data, url: data.websiteUrl.value ?? url };
  } catch (error) {
    if (error instanceof ImportEngineError) {
      return { status: "error", message: error.message };
    }
    console.error("[onboarding] import failed", error);
    return {
      status: "error",
      message: "Une erreur inattendue est survenue pendant l'analyse.",
    };
  }
}
