<script setup>
import { computed, ref } from 'vue'
import { createAjv } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/vue'
import { vanillaRenderers } from '@jsonforms/vue-vanilla'
import schema from './form/schema.json'
import uischema from './form/uischema.json'
import initialData from './form/data.json'

const renderers = Object.freeze(vanillaRenderers)
// JSON Forms ships Ajv without the 2020-12 meta-schema. The document is still
// draft 2020-12; skipping meta-schema lookup lets that Ajv compile it.
const ajv = createAjv({ validateSchema: false })
const data = ref(structuredClone(initialData))
const errors = ref([])

const dataText = computed(() => JSON.stringify(data.value, null, 2))

function onChange(event) {
  data.value = event.data
  errors.value = event.errors ?? []
}
</script>

<template>
  <header>
    <h1>Access request</h1>
    <p class="lede">
      Rendered by JSON Forms from the local schema, UI schema, and data.
    </p>
  </header>

  <section class="panel">
    <JsonForms
      :ajv="ajv"
      :data="data"
      :schema="schema"
      :uischema="uischema"
      :renderers="renderers"
      @change="onChange"
    />
  </section>

  <section class="errors">
    <h2>Validation</h2>
    <p v-if="errors.length === 0" class="ok">The current data matches the schema.</p>
    <ul v-else class="error-list">
      <li v-for="(error, index) in errors" :key="index">
        {{ error.instancePath || '/' }}: {{ error.message }}
      </li>
    </ul>
  </section>

  <section class="payload">
    <h2>Data</h2>
    <pre>{{ dataText }}</pre>
  </section>
</template>
