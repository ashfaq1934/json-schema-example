# JSON Schema example

A Vue 3 access-request form rendered by [JSON Forms](https://jsonforms.io/) with [Buefy](https://buefy.org/) controls. There is no API and no translator. The schema, the layout, and the initial values are three documents that the page imports and hands to JSON Forms.

## How it works

```text
schema.json ──┐
uischema.json ┼──► App.vue ──► JsonForms ──► inputs, errors, live data
data.json ────┘
```

1. [`client/src/form/schema.json`](client/src/form/schema.json) is a JSON Schema draft 2020-12 document. It describes the access-request object and the validation rules.
2. [`client/src/form/uischema.json`](client/src/form/uischema.json) is a JSON Forms UI schema. It chooses the field order, labels, and which controls are visible.
3. [`client/src/form/data.json`](client/src/form/data.json) is the initial form value.
4. [`client/src/App.vue`](client/src/App.vue) imports those three files and passes them to `<JsonForms>`. Custom renderers in [`client/src/renderers/`](client/src/renderers/) draw each control with Buefy: `b-input` for text and the justification textarea, `b-select` for enums, and `b-field` for the label and error. A Buefy vertical layout stacks the fields. Each change updates the data on the page, and a `b-message` lists Ajv errors.

JSON Forms draws the inputs from the UI schema and checks the data against the JSON Schema. The page does not fetch a schema and it does not post the result anywhere.

### Validation rules

- `requestType` and `fullName` are always required.
- When `requestType` is `business`, `companyName` and `vatNumber` become required. The VAT number must be two letters followed by 2 to 12 letters or digits.
- When `priority` is `urgent`, `justification` becomes required.

Those conditional requirements are `if` / `then` clauses in the JSON Schema.

### Visibility

Company name and VAT number stay hidden until the request type is business. That is a JSON Forms `SHOW` rule on those controls, not a change to the schema. Switching back to personal hides the fields again. Values already entered stay in the data object.

### Ajv

JSON Forms validates with Ajv. The copy it ships does not include the draft 2020-12 meta-schema, so `App.vue` builds Ajv with `createAjv({ validateSchema: false })`. The document is still draft 2020-12. Turning off the meta-schema lookup lets that Ajv compile it. Field checks such as `required`, `minLength`, `pattern`, and `if` / `then` still run.

## Components

- **Vue 3** mounts the page from [`client/src/main.js`](client/src/main.js) and registers Buefy.
- **Buefy** supplies `b-input`, `b-select`, `b-field`, and `b-message`, styled with Bulma.
- **`@jsonforms/vue`** provides the `<JsonForms>` component and the control bindings the Buefy renderers use.
- **`@jsonforms/vue-vanilla`** stays registered as a fallback for control types this form does not customize.
- **`@jsonforms/core`** supplies `createAjv` and the rule engine the renderers use.
- **The three JSON documents** are the only description of the form. Changing a label, a required field, or a show rule means editing JSON, not the Vue template.

The page also prints the current data and any validation messages under the form, so you can see what JSON Forms is holding.

## Run locally

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints. Change the request type to business to reveal the company fields, and set priority to urgent to require a justification.

## Run with Docker

From the repository root:

```bash
docker compose up --build
```

Open http://localhost:8080. Compose builds the Vue app in a Node image, then nginx serves the static files on port 80 inside the container, published as port 8080 on the host.
