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

console.log("\nLesson 04: The useForm Hook\n");

runGates(root);

const form = normalize(read("src/components/ProfileForm/ProfileForm.tsx"));
const hook = normalize(read("src/hooks/useForm.ts"));
const formAst = parseFileContent(join(root, "src/components/ProfileForm/ProfileForm.tsx"));
const hookAst = parseFileContent(join(root, "src/hooks/useForm.ts"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("useForm.ts exists", () => {
  assert(hook !== null, "src/hooks/useForm.ts not found");
});

test("ProfileForm imports useForm", () => {
  const el = findQuerySelector(
    formAst,
    "ImportDeclaration:has(ImportSpecifier[imported.name='useForm'])",
  );
  assert(el.length > 0, 'ProfileForm.tsx does not import "useForm"');
});

test("ProfileForm calls useForm with default values", () => {
  const el = findQuerySelector(formAst, "CallExpression[callee.name='useForm']");
  const props =
    el?.[0]?.arguments?.[0]?.properties?.map((p) => p.key?.name).filter(Boolean) ??
    [];
  assert(
    el.length > 0 && props.includes("name") && props.includes("email"),
    "ProfileForm.tsx does not call useForm() — replace the manual state with a useForm call",
  );
});

test("ProfileForm destructures values from useForm", () => {
  const el = findQuerySelector(
    formAst,
    "VariableDeclarator[id.type='ObjectPattern'][init.callee.name='useForm']:has(ObjectProperty[key.name='values'])",
  );
  assert(el.length > 0, "ProfileForm.tsx does not destructure values from useForm");
});

test("ProfileForm uses values.name for the name input", () => {
  const el = findQuerySelector(
    formAst,
    "JSXAttribute[name.name='value']:has(JSXExpressionContainer MemberExpression[object.name='values'][property.name='name'])",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not use values.name for the name input's value prop",
  );
});

test("ProfileForm uses values.email for the email input", () => {
  const el = findQuerySelector(
    formAst,
    "JSXAttribute[name.name='value']:has(JSXExpressionContainer MemberExpression[object.name='values'][property.name='email'])",
  );
  assert(
    el.length > 0,
    "ProfileForm.tsx does not use values.email for the email input's value prop",
  );
});

test("useForm exports a handleChange that uses e.target.name", () => {
  const handleChange =
    findQuerySelector(hookAst, "FunctionDeclaration[id.name='handleChange']")?.[0] ??
    findQuerySelector(hookAst, "VariableDeclarator[id.name='handleChange']")?.[0]
      ?.init;

  // Direct: event.target.name (variable name doesn't matter)
  const usesTargetName = findQuerySelector(
    handleChange,
    "MemberExpression[object.property.name='target'][property.name='name']",
  );

  // Or destructuring: const { name, value } = event.target;
  const usesDestructuring = findQuerySelector(
    handleChange,
    "VariableDeclarator ObjectPattern Property[key.name='name']",
  );

  // Or computed key: setValues({ ...values, [name]: value })
  const usesComputedName = findQuerySelector(
    handleChange,
    "ObjectProperty[computed=true][key.name='name']",
  );

  assert(
    usesTargetName.length > 0 || usesDestructuring.length > 0 || usesComputedName.length > 0,
    "useForm.ts handleChange does not read e.target.name",
  );
});

test("Both fields update correctly after refactoring to useForm", () => {
  const result = checkBehavior(root, "tests/lib/lesson-04.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-04.behavior.test.tsx` for details");
});

summary("ZmN2eG9xa3Y=");
