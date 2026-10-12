<script setup>
import { computed } from 'vue'
import { rendererProps, useJsonFormsEnumControl } from '@jsonforms/vue'

const props = defineProps(rendererProps())
const { control, handleChange } = useJsonFormsEnumControl(props)

const label = computed(() =>
  control.value.required ? `${control.value.label} *` : control.value.label
)
const message = computed(() => control.value.errors || control.value.description || '')
const fieldType = computed(() => (control.value.errors ? 'is-danger' : ''))

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
    <b-select
      :id="control.id"
      :model-value="control.data ?? null"
      :disabled="!control.enabled"
      expanded
      placeholder="Select"
      @update:model-value="onInput"
    >
      <option
        v-for="option in control.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </b-select>
  </b-field>
</template>
