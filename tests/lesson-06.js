import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkCompiles, checkBuilds, checkBehavior, normalize } from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(relPath) {
  try {
    return readFileSync(join(root, relPath), "utf8");
  } catch {
    return null;
  }
}

let pass = 0;
let fail = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    console.log(`❌ ${label} — ${err.message}`);
    fail++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log("\nLesson 05: The useFormWithValidation Hook\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log("❌ TypeScript compilation failed — fix all type errors before running tests\n");
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors");

const built = checkBuilds(root);
if (!built.ok) {
  console.log("❌ Vite build failed — the app does not run without errors\n");
  console.log(built.output);
  process.exit(1);
}
console.log("✅ App builds and runs without errors\n");

const form = normalize(read("src/components/ProfileForm/ProfileForm.tsx"));
const hook = normalize(read("src/hooks/useFormWithValidation.ts"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
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

test("Save button is disabled initially and enabled once all fields are valid", () => {
  const result = checkBehavior(root, "tests/lib/lesson-05.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-05.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
