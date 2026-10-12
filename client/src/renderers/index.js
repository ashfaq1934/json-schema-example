import { and, isEnumControl, isLayout, isStringControl, rankWith, uiTypeIs } from '@jsonforms/core'
import BuefyEnumControl from './BuefyEnumControl.vue'
import BuefyStringControl from './BuefyStringControl.vue'
import BuefyVerticalLayout from './BuefyVerticalLayout.vue'

export const buefyRenderers = [
  {
    renderer: BuefyStringControl,
    tester: rankWith(10, isStringControl),
  },
  {
    renderer: BuefyEnumControl,
    tester: rankWith(11, isEnumControl),
  },
  {
    renderer: BuefyVerticalLayout,
    tester: rankWith(3, and(isLayout, uiTypeIs('VerticalLayout'))),
  },
]
