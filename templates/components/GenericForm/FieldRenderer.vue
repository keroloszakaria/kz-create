<template>
  <v-col
    v-if="iShowField(field)"
    :lg="field?.cols?.lg"
    :md="field?.cols?.md"
    :class="field?.colClassList"
    :cols="field?.cols?.sm"
  >
    <div
      v-if="isGroupType(field)"
      :class="[{ group_ui: field.type === 'groupUI' }, field.classList, 'field-group']"
    >
      <div class="group-header">
        <h3 :class="field.headerClass" v-if="field.label">{{ $t(field.label) }}</h3>
        <Button
          v-if="field.button"
          :icon="field?.button?.icon"
          :type="field?.button?.classList"
          :iconPosition="field?.button?.iconPosition"
          :title="field?.button.label"
          :disabled="field?.button?.disabled"
          @click="field?.button?.click(fieldIndex, field)"
        />
      </div>
      <span
        v-if="field?.sideIcon"
        :class="['heading-icon', field?.sideIconClass]"
        v-html="field.sideIcon"
      ></span>

      <v-row class="content-start">
        <template v-for="(child, childIndex) in field.children" :key="childIndex">
          <FieldRenderer
            v-if="isGroupType(child)"
            :field="child"
            :fieldIndex="childIndex"
            :nestingLevel="nestingLevel + 1"
            @update:value="
              (event, childField, parent, index) =>
                $emit('update:value', event, childField, parent || field, index)
            "
          />

          <!-- Standard field handling -->
          <v-col
            v-else-if="iShowField(child)"
            :class="child.colClassList"
            :lg="child?.cols?.lg"
            :md="child?.cols?.md"
            :cols="child?.cols?.sm"
          >
            <slot v-if="child.type == 'slot'" :field="child" :name="child.key"></slot>
            <Button
              v-if="child.type == 'button'"
              :icon="child.icon"
              :type="child.classList"
              :iconPosition="child?.iconPosition"
              :title="child?.label"
              :disabled="child?.disabled"
              @click="child.click(childIndex, fieldIndex, child, field)"
            />
            <component
              v-else
              :is="getFieldComponent(child.type)"
              v-bind="{ ...child }"
              :classList="child.classList"
              v-model="child.value"
              @update:modelValue="(event) => handleValueUpdate(event, child, field, childIndex)"
              @onEnter="child.onEnter ? child.onEnter($event, child, field) : ''"
              @customSearch="child.customSearch ? child.customSearch($event, child, field) : ''"
              @addingData="child.addingData ? child.addingData($event, child, field) : ''"
              @itemClick="child.itemClick ? child.itemClick($event) : ''"
              @handleAdvancedSelect="
                child.handleAdvancedSelect ? child.handleAdvancedSelect($event) : ''
              "
            />

            <div v-if="child?.errorMessages && child.errorMessages.length" class="error-messages">
              <p v-for="error in child.errorMessages" :key="error" class="text-danger">
                {{ error }}
              </p>
            </div>
          </v-col>
        </template>
      </v-row>
    </div>
    <!-- Non-group fields -->
    <Button
      v-else-if="field.type === 'button'"
      :icon="field?.icon"
      :type="field?.classList"
      :iconPosition="field?.iconPosition"
      :title="field?.label"
      :disabled="field?.disabled"
      @click="field.click(fieldIndex, field)"
    />
    <slot v-else-if="field.type == 'slot'" :field="field" :name="field.key"></slot>

    <component
      v-else
      :is="getFieldComponent(field.type)"
      v-bind="{ ...field }"
      :classList="field.classList"
      v-model="field.value"
      @update:modelValue="(event) => handleValueUpdate(event, field)"
      @customSearch="field.customSearch ? field.customSearch($event, field) : ''"
      @onEnter="field.onEnter ? field.onEnter($event, field) : ''"
      @addingData="field.addingData ? field.addingData($event, field) : ''"
      @itemClick="field.itemClick ? field.itemClick($event) : ''"
      @checkedHandler="field.checkedHandler ? field.checkedHandler($event) : ''"
      @handleAdvancedSelect="field.handleAdvancedSelect ? field.handleAdvancedSelect($event) : ''"
    />

    <div v-if="field?.errorMessages && field.errorMessages.length" class="error-messages">
      <p v-for="error in field.errorMessages" :key="error" class="text-danger">
        {{ error }}
      </p>
    </div>
  </v-col>
</template>

<script setup>
import { inject, computed } from 'vue'
import Button from '@/components/common/Button.vue'

const props = defineProps({
  field: { type: Object, required: true },
  fieldIndex: { type: Number, required: true },
  parentField: { type: Object, default: null },
  nestingLevel: { type: Number, default: 0 }
})

const emit = defineEmits(['update:value'])

const getFieldComponent = inject('getFieldComponent')

const isGroupType = (field) => field.type === 'group' || field.type === 'groupUI'

const iShowField = (field) => {
  if (field?.hide) return false
  return true
}

const handleValueUpdate = (event, field, parent = null, fieldIndex = null) =>
  emit('update:value', event, field, parent, fieldIndex)
</script>

<style lang="scss" scoped></style>
