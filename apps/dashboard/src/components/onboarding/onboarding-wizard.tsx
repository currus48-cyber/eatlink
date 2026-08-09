"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createAccountAndRestaurantAction } from "@/actions/onboarding/create-account-and-restaurant";
import { runImportAction, type ImportActionState } from "@/actions/onboarding/run-import";
import { saveRestaurantAction } from "@/actions/onboarding/save-restaurant";
import { WizardProgress, type WizardStepConfig } from "@/components/forms/wizard-progress";
import type { ActionState } from "@/lib/action-state";
import type { RestaurantImportData } from "@/lib/import-engine/types";
import { toEditableFields, type EditableRestaurantFields } from "@/lib/onboarding/editable-fields";

import { AccountStep } from "./steps/account-step";
import { AnalyzingStep } from "./steps/analyzing-step";
import { PreviewStep } from "./steps/preview-step";
import { ResultStep } from "./steps/result-step";
import { UrlStep } from "./steps/url-step";
import type { WizardStep } from "./wizard-step";

const INITIAL_IMPORT_STATE: ImportActionState = { status: "idle" };

const STEPS: WizardStepConfig[] = [
  { key: "url", label: "URL" },
  { key: "analyzing", label: "Analyse" },
  { key: "result", label: "Résultat" },
  { key: "preview", label: "Aperçu" },
  { key: "account", label: "Compte" },
];

export function OnboardingWizard({
  isAuthenticated,
  initialUrl,
}: {
  isAuthenticated: boolean;
  initialUrl?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("url");
  const [importState, setImportState] = useState<ImportActionState>(INITIAL_IMPORT_STATE);
  const [importResult, setImportResult] = useState<RestaurantImportData | null>(null);
  const [editedFields, setEditedFields] = useState<EditableRestaurantFields | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");

  async function handleImportSubmit(formData: FormData) {
    setStep("analyzing");
    const result = await runImportAction(INITIAL_IMPORT_STATE, formData);
    setImportState(result);

    if (result.status === "success" && result.data) {
      setImportResult(result.data);
      setEditedFields(toEditableFields(result.data));
      setSourceUrl(result.url ?? "");
      setStep("result");
    } else {
      setStep("url");
    }
  }

  const [isSaving, startSaving] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function handlePreviewNext() {
    if (!editedFields) return;

    if (isAuthenticated) {
      // Already has an account (e.g. adding another restaurant from the
      // dashboard) — save immediately, no account step needed.
      setSaveError(null);
      startSaving(async () => {
        const result = await saveRestaurantAction(editedFields, sourceUrl);
        if (result.status === "success") {
          router.push("/dashboard");
        } else {
          setSaveError(result.message ?? "Une erreur est survenue.");
        }
      });
      return;
    }

    setStep("account");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountState, setAccountState] = useState<ActionState<"email" | "password">>({
    status: "idle",
  });
  const [isCreatingAccount, startCreatingAccount] = useTransition();

  function handleAccountSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editedFields) return;

    startCreatingAccount(async () => {
      const result = await createAccountAndRestaurantAction(editedFields, sourceUrl, {
        email,
        password,
      });
      setAccountState(result);
    });
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <WizardProgress steps={STEPS} currentKey={step} />

      {step === "url" && (
        <UrlStep action={handleImportSubmit} state={importState} defaultValue={initialUrl} />
      )}

      {step === "analyzing" && <AnalyzingStep />}

      {step === "result" && editedFields && importResult && (
        <ResultStep
          values={editedFields}
          confidence={importResult}
          onChange={setEditedFields}
          onNext={() => setStep("preview")}
          onBack={() => setStep("url")}
        />
      )}

      {step === "preview" && editedFields && (
        <>
          <PreviewStep values={editedFields} onNext={handlePreviewNext} onBack={() => setStep("result")} />
          {saveError && <p className="text-center text-sm text-destructive">{saveError}</p>}
          {isSaving && <p className="text-center text-sm text-muted-foreground">Enregistrement...</p>}
        </>
      )}

      {step === "account" && (
        <AccountStep
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleAccountSubmit}
          onBack={() => setStep("preview")}
          isSubmitting={isCreatingAccount}
          state={accountState}
        />
      )}
    </div>
  );
}
