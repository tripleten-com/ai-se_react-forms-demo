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

console.log("\nLesson 06: Form Submission\n");

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

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("ProfileForm imports saveProfile from the API", () => {
  assert(
    form.includes("saveProfile"),
    'ProfileForm.tsx does not import "saveProfile" from ../../utils/api'
  );
});

test("ProfileForm declares isSubmitting state", () => {
  assert(
    form.includes("isSubmitting"),
    "ProfileForm.tsx does not declare isSubmitting state"
  );
});

test("ProfileForm defines a handleSubmit function", () => {
  assert(
    form.includes("handleSubmit"),
    "ProfileForm.tsx does not define a handleSubmit function"
  );
});

test("handleSubmit calls e.preventDefault()", () => {
  assert(
    form.includes("preventDefault"),
    "handleSubmit does not call e.preventDefault() — without it the browser reloads on submit"
  );
});

test("The form element uses onSubmit", () => {
  assert(
    form.includes("onSubmit"),
    "The <form> element does not have an onSubmit prop — attach handleSubmit here, not to the button's onClick"
  );
});

test("Save button is disabled when isSubmitting is true", () => {
  assert(
    form.includes("isSubmitting"),
    "The Save button's disabled prop does not include isSubmitting"
  );
});

test("Button label changes while submitting", () => {
  assert(
    form.includes("Saving") || form.includes("saving"),
    "The button does not show a different label while submitting — expected something like: isSubmitting ? 'Saving…' : 'Save'"
  );
});

test("setIsSubmitting(false) is called in the finally block", () => {
  assert(
    form.includes("finally") && form.includes("setIsSubmitting(false)"),
    "handleSubmit does not call setIsSubmitting(false) in a finally block — the button will stay disabled after an error"
  );
});

test("Form submission shows loading state and success message", () => {
  const result = checkBehavior(root, "tests/lib/lesson-06.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-06.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("eTZuZGcxbTE=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
