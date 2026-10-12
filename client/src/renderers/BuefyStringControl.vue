<script setup>
import { computed } from 'vue'
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue'

const props = defineProps(rendererProps())
const { control, handleChange } = useJsonFormsControl(props)

const label = computed(() =>
  control.value.required ? `${control.value.label} *` : control.value.label
)
const message = computed(() => control.value.errors || control.value.description || '')
const fieldType = computed(() => (control.value.errors ? 'is-danger' : ''))
const multiline = computed(() => Boolean(control.value.uischema.options?.multi))

function onInput(value) {
  handleChange(control.value.path, value === '' || value == null ? undefined : value)
}
</script>

<template>
  <b-field
    v-if="control.visible"
    :label="label"
    :label-for="control.id"
    :message="message"
    :type="fieldType"
  >
    <b-input
      :id="control.id"
      :model-value="control.data ?? ''"
      :type="multiline ? 'textarea' : 'text'"
      :disabled="!control.enabled"
      expanded
      @update:model-value="onInput"
    />
  </b-field>
</template>
