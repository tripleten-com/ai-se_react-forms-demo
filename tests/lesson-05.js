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

console.log("\nLesson 04: HTML5 Validation Attributes\n");

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

test("Validation attributes are present in the rendered DOM", () => {
  const result = checkBehavior(root, "tests/lib/lesson-04.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
