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
const formAst = parseFileContent(join(root, "src/components/ProfileForm/ProfileForm.tsx"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("ProfileForm imports saveProfile from the API", () => {
  const el = findQuerySelector(
    formAst,
    "ImportDeclaration:has(ImportSpecifier[imported.name='saveProfile'])",
  );
  assert(
    el.length > 0,
    'ProfileForm.tsx does not import "saveProfile" from ../../utils/api'
  );
});

test("ProfileForm declares isSubmitting state", () => {
  const el = findQuerySelector(
    formAst,
    "VariableDeclaration[declarations.0.id.elements.0.name='isSubmitting'][declarations.0.init.callee.name='useState']",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not declare isSubmitting state"
  );
});

test("ProfileForm defines a handleSubmit function", () => {
  const fnDecl = findQuerySelector(formAst, "FunctionDeclaration[id.name='handleSubmit']");
  const fnVar = findQuerySelector(formAst, "VariableDeclarator[id.name='handleSubmit']");

  assert(
    fnDecl.length > 0 || fnVar.length > 0,
    "ProfileForm.tsx does not define a handleSubmit function"
  );
});

test("handleSubmit calls e.preventDefault()", () => {
  const handleSubmit =
    findQuerySelector(formAst, "FunctionDeclaration[id.name='handleSubmit']")?.[0] ??
    findQuerySelector(formAst, "VariableDeclarator[id.name='handleSubmit']")?.[0]?.init;

  const el = findQuerySelector(handleSubmit, "CallExpression[callee.property.name='preventDefault']");
  assert(
    el.length > 0,
    "handleSubmit does not call e.preventDefault() — without it the browser reloads on submit"
  );
});

test("The form element uses onSubmit", () => {
  const el = findQuerySelector(
    formAst,
    "JSXOpeningElement[name.name='form']:has(JSXAttribute[name.name='onSubmit'])",
  );
  assert(
    el.length > 0,
    "The <form> element does not have an onSubmit prop — attach handleSubmit here, not to the button's onClick"
  );
});

test("Save button is disabled when isSubmitting is true", () => {
  const el = findQuerySelector(
    formAst,
    "JSXAttribute[name.name='disabled']:has(Identifier[name='isSubmitting'])",
  );
  assert(
    el.length > 0,
    "The Save button's disabled prop does not include isSubmitting"
  );
});

test("Button label changes while submitting", () => {
  const cond = findQuerySelector(formAst, "ConditionalExpression[test.name='isSubmitting']")?.[0];
  const label = cond?.consequent?.value ?? "";
  assert(
    /saving/i.test(label),
    "The button does not show a different label while submitting — expected something like: isSubmitting ? 'Saving…' : 'Save'"
  );
});

test("setIsSubmitting(false) is called in the finally block", () => {
  const handleSubmit =
    findQuerySelector(formAst, "FunctionDeclaration[id.name='handleSubmit']")?.[0] ??
    findQuerySelector(formAst, "VariableDeclarator[id.name='handleSubmit']")?.[0]?.init;

  const el = findQuerySelector(
    handleSubmit,
    "TryStatement:has(CallExpression[callee.name='setIsSubmitting'][arguments.0.value=false])",
  );
  assert(
    el.length > 0,
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
