import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  checkCompiles,
  checkBuilds,
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

console.log("\nLesson 04: The useForm Hook\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log(
    "❌ TypeScript compilation failed — fix all type errors before running tests\n",
  );
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
const hook = normalize(read("src/hooks/useForm.ts"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("useForm.ts exists", () => {
  assert(hook !== null, "src/hooks/useForm.ts not found");
});

test("ProfileForm imports useForm", () => {
  assert(form.includes("useForm"), 'ProfileForm.tsx does not import "useForm"');
});

test("ProfileForm calls useForm with default values", () => {
  assert(
    form.includes("useForm("),
    "ProfileForm.tsx does not call useForm() — replace the manual state with a useForm call",
  );
});

test("ProfileForm destructures values from useForm", () => {
  assert(
    form.includes("values"),
    "ProfileForm.tsx does not destructure values from useForm",
  );
});

test("ProfileForm uses values.name for the name input", () => {
  assert(
    form.includes("values.name"),
    "ProfileForm.tsx does not use values.name for the name input's value prop",
  );
});

test("ProfileForm uses values.email for the email input", () => {
  assert(
    form.includes("values.email"),
    "ProfileForm.tsx does not use values.email for the email input's value prop",
  );
});

test("useForm exports a handleChange that uses e.target.name", () => {
  assert(
    hook.includes("e.target.name") ||
      hook.includes("target.name") ||
      hook.includes("{ name, value } = event.target"),
    "useForm.ts handleChange does not read e.target.name",
  );
});

test("Both fields update correctly after refactoring to useForm", () => {
  const result = checkBehavior(root, "tests/lib/lesson-04.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-04.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("ZmN2eG9xa3Y=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
