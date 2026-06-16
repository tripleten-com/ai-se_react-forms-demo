import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  checkCompiles,
  checkBuilds,
  checkBehavior,
  normalize,
  parseFileContent,
  findQuerySelector,
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

console.log("\nLesson 07: Pre-Filling Fields from Data\n");

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
const formAst = parseFileContent(join(root, "src/components/ProfileForm/ProfileForm.tsx"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("ProfileForm imports getProfile from the API", () => {
  const el = findQuerySelector(
    formAst,
    "ImportDeclaration:has(ImportSpecifier[imported.name='getProfile'])",
  );
  assert(
    el.length > 0,
    'ProfileForm.tsx does not import "getProfile" from ../../utils/api'
  );
});

test("ProfileForm imports useEffect", () => {
  const el = findQuerySelector(
    formAst,
    "ImportDeclaration[source.value='react']:has(ImportSpecifier[imported.name='useEffect'])",
  );
  assert(
    el.length > 0,
    'ProfileForm.tsx does not import "useEffect" from React'
  );
});

test("ProfileForm has a useEffect call", () => {
  const el = findQuerySelector(formAst, "CallExpression[callee.name='useEffect']");
  assert(
    el.length > 0,
    "ProfileForm.tsx does not call useEffect"
  );
});

test("The useEffect calls getProfile", () => {
  const useEffectCall = findQuerySelector(formAst, "CallExpression[callee.name='useEffect']")?.[0];
  const el = findQuerySelector(useEffectCall, "CallExpression[callee.name='getProfile']");
  assert(
    el.length > 0,
    "The useEffect does not call getProfile() — this is how the stored profile is read on mount"
  );
});

test("The useEffect calls setValues with the profile data", () => {
  const useEffectCall = findQuerySelector(formAst, "CallExpression[callee.name='useEffect']")?.[0];
  const el = findQuerySelector(useEffectCall, "CallExpression[callee.name='setValues']");
  assert(
    el.length > 0,
    "The useEffect does not call setValues() — call it with the result of getProfile() to pre-fill the form"
  );
});

test("ProfileForm declares an isLoadingProfile state variable", () => {
  const isLoadingProfile = findQuerySelector(
    formAst,
    "VariableDeclaration[declarations.0.id.elements.0.name='isLoadingProfile'][declarations.0.init.callee.name='useState']",
  );
  const isLoading = findQuerySelector(
    formAst,
    "VariableDeclaration[declarations.0.id.elements.0.name='isLoading'][declarations.0.init.callee.name='useState']",
  );
  assert(
    isLoadingProfile.length > 0 || isLoading.length > 0,
    "ProfileForm.tsx does not declare an isLoadingProfile state variable"
  );
});

test("ProfileForm shows a loading state while the profile is being fetched", () => {
  const result = checkBehavior(root, "tests/lib/lesson-07.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-07.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("ZjJsZWxhcng=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
