export type ActionState<TFields extends string = string> = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<TFields, string[]>>;
};

export const initialActionState: ActionState = { status: "idle" };
