export function getErrorMessage(error) {
  if (error?.data?.errors && error.data.errors.length > 0) {
    return error.data.errors[0].message;
  }

  return error?.data?.message || "Something went wrong.";
}
