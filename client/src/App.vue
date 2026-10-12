<script setup>
import { computed, ref } from 'vue'
import { createAjv } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/vue'
import { vanillaRenderers } from '@jsonforms/vue-vanilla'
import schema from './form/schema.json'
import uischema from './form/uischema.json'
import initialData from './form/data.json'
import { buefyRenderers } from './renderers'

const renderers = Object.freeze([...buefyRenderers, ...vanillaRenderers])
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
  <section class="section">
    <div class="page">
      <h1 class="title is-3">Access request</h1>
      <p class="subtitle is-6">
        Rendered by JSON Forms with Buefy controls from the local schema, UI schema, and data.
      </p>

      <div class="box">
        <JsonForms
          :ajv="ajv"
          :data="data"
          :schema="schema"
          :uischema="uischema"
          :renderers="renderers"
          @change="onChange"
        />
      </div>

      <b-message
        :type="errors.length === 0 ? 'is-success' : 'is-danger'"
        :title="errors.length === 0 ? 'Valid' : 'Validation'"
      >
        <p v-if="errors.length === 0">The current data matches the schema.</p>
        <ul v-else>
          <li v-for="(error, index) in errors" :key="index">
            {{ error.instancePath || '/' }}: {{ error.message }}
          </li>
        </ul>
      </b-message>

      <div class="box">
        <h2 class="title is-6">Data</h2>
        <pre>{{ dataText }}</pre>
      </div>
    </div>
  </section>
</template>
