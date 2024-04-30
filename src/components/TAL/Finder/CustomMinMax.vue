<template>
  <v-col cols="12" lg="12" class="pa-0">
    <v-row>
      <v-col cols="6" xs="6" lg="6" class="pl-1 pt-0 pl-0 pr-0">
        <v-text-field
          v-model="value1"
          v-input-mask="{
            alias: fieldType === 'currency' ? 'currency' : 'numeric',
            digits: fieldType === 'Number' ? '0' : '2',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: fieldType === 'Number' ? '' : '0'
          }"
          maxlength="13"
          :prefix="valuePrefix"
          :suffix="valueSuffix"
          label="From"
          :error="value1Error"
          :error-messages="value1ErrorMsg"
          @blur="assignValue"
        />
      </v-col>
      <v-col cols="6" xs="6" lg="6" class="pl-1 pt-0 pl-0 pr-0">
        <v-text-field
          v-model="value2"
          v-input-mask="{
            alias: fieldType === 'currency' ? 'currency' : 'numeric',
            digits: fieldType === 'Number' ? '0' : '2',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: fieldType === 'Number' ? '' : '0'
          }"
          maxlength="13"
          :prefix="valuePrefix"
          :suffix="valueSuffix"
          label="To  "
          :error="value2Error"
          :error-messages="value2ErrorMsg"
          @blur="assignValue"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { ref, inject, computed, getCurrentInstance, watch } from 'vue'
export default {
  props: ['fieldPrefix', 'fieldSuffix', 'fieldType', 'fieldDecimal', 'returnNumberObject', 'resetCustom', 'pageName'],
  setup(props) {
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const $event = instance.appContext.config.globalProperties.$event
    const valuePrefix = ref(props.fieldPrefix)
    const valueSuffix = ref(props.fieldSuffix)
    const numberValue1 = ref(0)
    const numberValue2 = ref(0)
    const value1Error = ref(false)
    const value1ErrorMsg = ref('')
    const value2Error = ref(false)
    const value2ErrorMsg = ref('')
    const value1 = computed({
      get: () => {
        return numberValue1.value
      },
      set: (newValue) => {
        if (newValue === '') {
          return (numberValue1.value = 0)
        }
        if (newValue === '.') {
          value1Error.value = true
          value1ErrorMsg.value = 'Enter valid number'
          return (numberValue1.value = 0)
        }
        if (parseFloat(newValue) === 0) {
          value1Error.value = true
          value1ErrorMsg.value = 'Value should be greater than zero'
          return (numberValue1.value = 0)
        }
        if (props.fieldType === 'Decimal') {
          if (parseFloat(newValue) > 100) {
            value1Error.value = true
            value1ErrorMsg.value = 'Value cannot be greater then 100%'
            return (numberValue1.value = 0)
          }
        }
        if (newValue && parseFloat(newValue) > 0) {
          value1Error.value = false
          value1ErrorMsg.value = ''
          return (numberValue1.value = Number(newValue))
        }
      }
    })
    const value2 = computed({
      get: () => {
        return numberValue2.value
      },
      set: (newValue) => {
        if (parseFloat(value1.value) === 0) {
          value1Error.value = true
          value1ErrorMsg.value = 'Value should be greater than zero'
          if (props.pageName === 'LivePlans') return (numberValue2.value = Number(newValue))
          else return (numberValue1.value = 0)
        }
        if (newValue === '') {
          return (numberValue2.value = 0)
        }
        if (newValue === '.') {
          value2Error.value = true
          value2ErrorMsg.value = 'Enter valid number'
          return (numberValue2.value = 0)
        }
        if (parseFloat(newValue) === 0) {
          value2Error.value = true
          value2ErrorMsg.value = 'Value should be greater than zero'
          return (numberValue2.value = 0)
        }
        if (parseFloat(newValue) <= parseFloat(value1.value)) {
          value2Error.value = true
          value2ErrorMsg.value = 'Value should be greater than From value'
          return (numberValue2.value = 0)
        }
        if (props.fieldType === 'Decimal') {
          if (parseFloat(newValue) > 100) {
            value2Error.value = true
            value2ErrorMsg.value = 'Value cannot be greater then 100%'
            return (numberValue2.value = 0)
          }
        }
        if (newValue && Number(newValue) > 0) {
          value2Error.value = false
          value2ErrorMsg.value = ''
          return (numberValue2.value = Number(newValue))
        }
      }
    })
    const callBackFunction = () => {
      eventBus.emit('returnCallFunction')
    }
    const assignValue = () => {
      var returnObject
      if (props.pageName === 'LivePlans') {
        if (value1Error.value === false && value2Error.value === false && numberValue1.value > 0 && numberValue2.value >= 0) {
          returnObject = {
            item1: numberValue1.value,
            item2: numberValue2.value,
            text: props.returnNumberObject.text,
            type: props.returnNumberObject.type
          }
          eventBus.emit('returnCallFunction', returnObject)
        }
      } else {
        if (value1Error.value === false && value2Error.value === false && numberValue1.value > 0 && numberValue2.value > 0) {
          returnObject = {
            item1: numberValue1.value,
            item2: numberValue2.value,
            text: props.returnNumberObject.text,
            type: props.returnNumberObject.type
          }
          eventBus.emit('returnCallFunction', returnObject)
        }
      }
    }
    const onlyNumber = ($event) => {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (props.fieldType === 'Number') {
        if (keyCode < 48 || keyCode > 57) {
          $event.preventDefault()
        }
      } else {
        if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
          // 46 is dot
          $event.preventDefault()
        }
      }
    }
    watch(
      () => props.returnNumberObject,
      (val) => {
        if (val) {
          numberValue1.value = val.item1
          numberValue2.value = val.item2
        }
      },
      { immediate: true }
    )
    watch(
      () => props.resetCustom,
      () => {
        value1Error.value = false
        value2Error.value = false
        value1ErrorMsg.value = ''
        value2ErrorMsg.value = ''
        numberValue1.value = 0
        numberValue2.value = 0
      }
    )
    return {
      value1,
      value1Error,
      value1ErrorMsg,
      value2,
      value2Error,
      value2ErrorMsg,
      numberValue1,
      numberValue2,
      valuePrefix,
      valueSuffix,
      $event,
      assignValue,
      callBackFunction,
      onlyNumber
    }
  }
}
</script>

<style>
.box_field_xl .v-text-field input {
  padding-bottom: 6px !important;
}
.box_field_lgAndDown .v-text-field input {
  padding-bottom: 5px !important;
}
</style>
