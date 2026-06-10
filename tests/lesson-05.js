import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  runGates,
  test,
  assert,
  summary,
  checkBehavior,
  normalize,
} from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(relPath) {
  try {
    return readFileSync(join(root, relPath), "utf8");
  } catch {
    return null;
  }
}

console.log("\nLesson 05: The useFormWithValidation Hook\n");

runGates(root);

const form = normalize(read("src/components/ProfileForm/ProfileForm.tsx"));
const hook = normalize(read("src/hooks/useFormWithValidation.ts"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("Name input has the required attribute", () => {
  assert(
    form.includes("required"),
    "ProfileForm.tsx does not include the required attribute on the name input"
  );
});

test("Name input has minLength set to 2", () => {
  assert(
    form.includes("minLength={2}") || form.includes('minLength="2"'),
    "The name input does not have minLength={2}"
  );
});

test("Name input has maxLength set to 40", () => {
  assert(
    form.includes("maxLength={40}") || form.includes('maxLength="40"'),
    "The name input does not have maxLength={40}"
  );
});

test("Email input has type='email'", () => {
  assert(
    form.includes('type="email"'),
    'The email input does not have type="email"'
  );
});

test("useFormWithValidation.ts exists", () => {
  assert(hook !== null, "src/hooks/useFormWithValidation.ts not found");
});

test("ProfileForm imports useFormWithValidation", () => {
  assert(
    form.includes("useFormWithValidation"),
    'ProfileForm.tsx does not import "useFormWithValidation"'
  );
});

test("ProfileForm destructures errors from the hook", () => {
  assert(
    form.includes("errors"),
    "ProfileForm.tsx does not destructure errors from useFormWithValidation"
  );
});

test("ProfileForm destructures isValid from the hook", () => {
  assert(
    form.includes("isValid"),
    "ProfileForm.tsx does not destructure isValid from useFormWithValidation"
  );
});

test("ProfileForm renders an error span for the name field", () => {
  assert(
    form.includes("errors.name"),
    "ProfileForm.tsx does not conditionally render errors.name below the name input"
  );
});

test("ProfileForm renders an error span for the email field", () => {
  assert(
    form.includes("errors.email"),
    "ProfileForm.tsx does not conditionally render errors.email below the email input"
  );
});

test("Save button has disabled={!isValid}", () => {
  assert(
    form.includes("!isValid"),
    "The Save button does not use !isValid in its disabled prop"
  );
});

test("useFormWithValidation reads validationMessage from the input", () => {
  assert(
    hook.includes("validationMessage"),
    "useFormWithValidation.ts does not read validationMessage — it should store the browser's validation message in errors"
  );
});

test("useFormWithValidation calls checkValidity on the form", () => {
  assert(
    hook.includes("checkValidity"),
    "useFormWithValidation.ts does not call checkValidity() — it needs this to set isValid correctly"
  );
});

test("Validation attributes and hook wiring are correct", () => {
  const result = checkBehavior(root, "tests/lib/lesson-05.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-05.behavior.test.tsx` for details");
});

summary("MmM3M21pa3k=");
