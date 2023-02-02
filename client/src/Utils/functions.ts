import { Register } from "../types/type";

export const moveFoword = (
  index: number,
  props: Register,
  setCurrentStep: any
) => {
  if (index == 2) {
    if (props.fName.length > 0 && props.lName.length > 0) {
      setCurrentStep(index);
    }
  } else if (index == 3) {
    if (props.email.length > 0 && props.password.length > 0) {
      setCurrentStep(index);
    }
  } else if (index == 4) {
    if (props.role != -1 && props.location.length > 0) {
      setCurrentStep(index);
    }
  } else {
    setCurrentStep(1);
  }
};
export const check = (number: number): boolean => {
  document.querySelectorAll(".errorMessage").forEach((one) => {
    one.remove();
  });
  let inputs: HTMLInputElement[] = Array.from(
    document.querySelectorAll(`.input${number}`)
  );
  let ok = true;
  inputs.forEach((one: HTMLInputElement, index) => {
    const span = one.nextSibling;
    if (!one.checkValidity()) {
      one.classList.add("errorField");
      ok = false;
      if (!span || span.nodeName !== "SPAN") {
        const div = document.createElement("div");
        div.classList.add("errorMessage");
        div.style.textAlign = "left";
        div.innerHTML = `invalid ${one.name}`;
        one?.parentNode?.insertBefore(div, one.nextSibling);
      }
    } else {
      one.classList.remove("errorField");
      if (span && span.nodeName === "SPAN") {
        span.remove();
      }
    }
  });
  return ok;
};
