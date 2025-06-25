<template>
  <div class="scrollbar-thin flex h-screen overflow-y-auto p-8 ph:p-4">
    <div class="m-auto flex w-full max-w-sm flex-col items-center gap-4">
      <p class="text-sm text-gray-500">
        {{ __('pruvious-dashboard', "The page you're looking for doesn't exist.") }}
      </p>

      <NuxtLink :to="`/${runtimeConfig.public.pruvious.dashboardPrefix}`" class="button button-white">
        {{ __('pruvious-dashboard', 'Go to dashboard') }}
      </NuxtLink>
    </div>
  </div>

  <PruviousGlobals />
</template>

<script lang="ts" setup>
import { navigateTo, useRoute, useRuntimeConfig } from '#imports'
import { dashboardMiscComponent } from '#pruvious/dashboard'
import { useEventListener } from '@vueuse/core'
import '../../assets/style.css'
import { __, loadTranslatableStrings } from '../../composables/translatable-strings'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const PruviousGlobals = dashboardMiscComponent.Globals()

await loadTranslatableStrings()

useEventListener(window, 'focus', async () => {
  if (route.query.from) {
    await navigateTo(route.query.from.toString())
  }
})
</script>

<style>
@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:400;src:url(../../assets/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:400;src:url(../../assets/KFOkCnqEu92Fr1Mu51xIIzIXKMny.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:500;src:url(../../assets/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:500;src:url(../../assets/KFOjCnqEu92Fr1Mu51S7ACc6CsTYl4BO.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}
</style>
