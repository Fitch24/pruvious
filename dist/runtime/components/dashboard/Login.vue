<template>
  <div class="scrollbar-thin flex h-screen overflow-y-auto p-8 ph:p-4">
    <div class="m-auto w-full max-w-sm">
      <LoginLogo />

      <form @submit.prevent="logIn()" class="flex flex-col items-start gap-4 border bg-white p-6">
        <component
          v-model="email"
          :errors="errors"
          :is="TextField"
          :options="{ label: __('pruvious-dashboard', 'Email'), type: 'email', autocomplete: 'email' }"
          fieldKey="email"
        />

        <component
          v-model="password"
          :errors="errors"
          :is="TextField"
          :options="{ label: __('pruvious-dashboard', 'Password'), type: 'password', autocomplete: 'current-password' }"
          fieldKey="password"
        />

        <component
          v-model="remember"
          :errors="errors"
          :is="CheckboxField"
          :options="{ label: __('pruvious-dashboard', 'Remember me') }"
          fieldKey="remember"
        />

        <button type="submit" class="button w-full">
          <span>{{ __('pruvious-dashboard', 'Sign in') }}</span>
        </button>
      </form>

      <PruviousLegalLinks class="mt-4" />
    </div>
  </div>

  <PruviousGlobals />
</template>

<script lang="ts" setup>
import { ref, useRoute } from '#imports'
import {
  checkboxFieldComponent,
  dashboardLoginLogoComponent,
  dashboardMiscComponent,
  textFieldComponent,
} from '#pruvious/dashboard'
import '../../assets/style.css'
import { navigateToPruviousDashboardPath, usePruviousDashboard } from '../../composables/dashboard/dashboard'
import { setToken } from '../../composables/token'
import { __, loadTranslatableStrings } from '../../composables/translatable-strings'
import { pruviousFetch } from '../../utils/fetch'
import { isObject } from '../../utils/object'

const dashboard = usePruviousDashboard()
const route = useRoute()

const email = ref<string>('')
const password = ref<string>('')
const remember = ref<boolean>(false)
const errors = ref<Record<string, string>>({})

const CheckboxField = checkboxFieldComponent()
const LoginLogo = dashboardLoginLogoComponent()
const PruviousGlobals = dashboardMiscComponent.Globals()
const PruviousLegalLinks = dashboardMiscComponent.LegalLinks()
const TextField = textFieldComponent()

await loadTranslatableStrings('pruvious-dashboard')

async function logIn() {
  const loginResponse = await pruviousFetch('login.post', { body: { email, password, remember } })

  if (loginResponse.success) {
    setToken(loginResponse.data)
    dashboard.value.refresh = true
    navigateToPruviousDashboardPath('/', { to: route.query.to }, route)
  } else if (isObject(loginResponse.error)) {
    errors.value = loginResponse.error
  }
}
</script>

<style>
@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:400;src:url(../../assets/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:400;src:url(../../assets/KFOkCnqEu92Fr1Mu51xIIzIXKMny.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:500;src:url(../../assets/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:500;src:url(../../assets/KFOjCnqEu92Fr1Mu51S7ACc6CsTYl4BO.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}
</style>
