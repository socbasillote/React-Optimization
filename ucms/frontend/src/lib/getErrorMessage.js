export function getErrorMessage(error) {
  if (!error) return "Something went wrong.";

  if (typeof error === "string") {
    return error;
  }

  if (error.data?.errors?.length) {
    return error.data.errors[0].message;
  }

  if (error.data?.message) {
    return error.data.message;
  }

  if (error.error) {
    return error.error;
  }

  if (error.message) {
    return error.message;
  }

  return "Something went wrong.";
}
