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
const formAst = parseFileContent(join(root, "src/components/ProfileForm/ProfileForm.tsx"));
const hookAst = parseFileContent(join(root, "src/hooks/useFormWithValidation.ts"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("Name input has the required attribute", () => {
  const el = findQuerySelector(
    formAst,
    "JSXOpeningElement[name.name='input']:has(JSXAttribute[name.name='name'][value.value='name']):has(JSXAttribute[name.name='required'])",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not include the required attribute on the name input"
  );
});

test("Name input has minLength set to 2", () => {
  const el = findQuerySelector(
    formAst,
    "JSXOpeningElement[name.name='input']:has(JSXAttribute[name.name='name'][value.value='name'])",
  );
  const attr = el?.[0]?.attributes?.find((a) => a.name?.name === "minLength");
  const ok =
    attr?.value?.expression?.value === 2 ||
    attr?.value?.value === "2" ||
    attr?.value?.value === 2;
  assert(
    ok,
    "The name input does not have minLength={2}"
  );
});

test("Name input has maxLength set to 40", () => {
  const el = findQuerySelector(
    formAst,
    "JSXOpeningElement[name.name='input']:has(JSXAttribute[name.name='name'][value.value='name'])",
  );
  const attr = el?.[0]?.attributes?.find((a) => a.name?.name === "maxLength");
  const ok =
    attr?.value?.expression?.value === 40 ||
    attr?.value?.value === "40" ||
    attr?.value?.value === 40;
  assert(
    ok,
    "The name input does not have maxLength={40}"
  );
});

test("Email input has type='email'", () => {
  const el = findQuerySelector(
    formAst,
    "JSXOpeningElement[name.name='input']:has(JSXAttribute[name.name='type'][value.value='email'])",
  );
  assert(
    el.length > 0,
    'The email input does not have type="email"'
  );
});

test("useFormWithValidation.ts exists", () => {
  assert(hook !== null, "src/hooks/useFormWithValidation.ts not found");
});

test("ProfileForm imports useFormWithValidation", () => {
  const el = findQuerySelector(
    formAst,
    "ImportDeclaration:has(ImportSpecifier[imported.name='useFormWithValidation'])",
  );
  assert(
    el.length > 0,
    'ProfileForm.tsx does not import "useFormWithValidation"'
  );
});

test("ProfileForm destructures errors from the hook", () => {
  const el = findQuerySelector(
    formAst,
    "VariableDeclarator[id.type='ObjectPattern'][init.callee.name='useFormWithValidation']:has(ObjectProperty[key.name='errors'])",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not destructure errors from useFormWithValidation"
  );
});

test("ProfileForm destructures isValid from the hook", () => {
  const el = findQuerySelector(
    formAst,
    "VariableDeclarator[id.type='ObjectPattern'][init.callee.name='useFormWithValidation']:has(ObjectProperty[key.name='isValid'])",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not destructure isValid from useFormWithValidation"
  );
});

test("ProfileForm renders an error span for the name field", () => {
  const el = findQuerySelector(
    formAst,
    "JSXExpressionContainer:has(LogicalExpression[operator='&&'][left.object.name='errors'][left.property.name='name'])",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not conditionally render errors.name below the name input"
  );
});

test("ProfileForm renders an error span for the email field", () => {
  const el = findQuerySelector(
    formAst,
    "JSXExpressionContainer:has(LogicalExpression[operator='&&'][left.object.name='errors'][left.property.name='email'])",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not conditionally render errors.email below the email input"
  );
});

test("Save button has disabled={!isValid}", () => {
  const el = findQuerySelector(
    formAst,
    "JSXAttribute[name.name='disabled']:has(JSXExpressionContainer UnaryExpression[operator='!'][argument.name='isValid'])",
  );
  assert(
    el.length > 0,
    "The Save button does not use !isValid in its disabled prop"
  );
});

test("useFormWithValidation reads validationMessage from the input", () => {
  const el = findQuerySelector(
    hookAst,
    "MemberExpression[property.name='validationMessage']",
  );
  assert(
    el.length > 0,
    "useFormWithValidation.ts does not read validationMessage — it should store the browser's validation message in errors"
  );
});

test("useFormWithValidation calls checkValidity on the form", () => {
  const el = findQuerySelector(
    hookAst,
    "CallExpression[callee.property.name='checkValidity']",
  );
  assert(
    el.length > 0,
    "useFormWithValidation.ts does not call checkValidity() — it needs this to set isValid correctly"
  );
});

test("Validation attributes and hook wiring are correct", () => {
  const result = checkBehavior(root, "tests/lib/lesson-05.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-05.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("MmM3M21pa3k=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
