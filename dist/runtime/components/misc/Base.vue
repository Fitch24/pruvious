<template>
  <div class="flex h-screen min-w-[90rem] flex-col">
    <!-- Header -->
    <div class="relative z-40 flex h-14 shrink-0 items-center border-b bg-white pl-8 pr-6">
      <div class="flex w-full max-w-[18rem]">
        <NuxtLink
          :title="__('pruvious-dashboard', 'Go to start page')"
          :to="
            `/${runtimeConfig.public.pruvious.dashboardPrefix}` +
            (collectionLanguage !== primaryLanguage ? `?language=${collectionLanguage}` : '')
          "
        >
          <HeaderLogo />
        </NuxtLink>
      </div>

      <!-- Search -->
      <div class="flex w-full max-w-md gap-2 pr-8">
        <slot name="search" />
      </div>

      <div class="ml-auto flex items-center gap-5">
        <!-- Language switcher -->
        <slot name="language-switcher" />

        <div class="flex">
          <PruviousQuickActions />

          <button
            v-if="dashboard.isCacheActive"
            v-pruvious-tooltip="{ content: __('pruvious-dashboard', 'Clear cache'), offset: [0, 13] }"
            @click="clearCache()"
            type="button"
            class="flex h-8 w-8 transition hocus:text-primary-700"
          >
            <PruviousIconEraser class="m-auto h-4 w-4" />
          </button>

          <NuxtLink
            v-pruvious-tooltip="{ content: __('pruvious-dashboard', 'My profile'), offset: [0, 13] }"
            :to="`/${runtimeConfig.public.pruvious.dashboardPrefix}/profile`"
            class="flex h-8 w-8 transition hocus:text-primary-700"
          >
            <PruviousIconUser class="m-auto h-4 w-4" />
          </NuxtLink>

          <NuxtLink
            v-pruvious-tooltip="{ content: __('pruvious-dashboard', 'Log out'), offset: [0, 13] }"
            :to="`/${runtimeConfig.public.pruvious.dashboardPrefix}/logout`"
            class="flex h-8 w-8 transition hocus:text-red-500"
          >
            <PruviousIconLogout class="m-auto h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="flex h-full flex-1">
        <div v-if="showMenu" class="scrollbar-thin h-full w-full max-w-[18rem] overflow-y-auto p-8 pr-0">
          <ul class="flex flex-col items-start pt-0.5">
            <li v-for="{ collection, icon, label, path } of dashboard.menu" class="w-full">
              <NuxtLink
                :title="label"
                :to="
                  collection
                    ? path +
                      (dashboard.collections[collection].translatable
                        ? dashboard.collections[collection].mode === 'multi'
                          ? queryStringLanguageWhere
                          : queryStringLanguage
                        : '')
                    : `/${runtimeConfig.public.pruvious.dashboardPrefix}/${path}`
                "
                class="inline-flex items-center gap-2 py-1.5 text-[0.9375rem] text-gray-400 transition hocus:text-primary-700"
                :class="{
                  'font-medium !text-gray-700': collection
                    ? route.fullPath === path ||
                      route.fullPath.startsWith(`${path}?`) ||
                      route.fullPath.startsWith(`${path}/`)
                    : route.fullPath === `/${runtimeConfig.public.pruvious.dashboardPrefix}/${path}` ||
                      route.fullPath.startsWith(`/${runtimeConfig.public.pruvious.dashboardPrefix}/${path}?`),
                }"
              >
                <span v-html="icon" class="pointer-events-none -mt-px h-4 w-4 shrink-0"></span>
                <span class="pointer-events-none truncate">{{ label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="scrollbar-thin flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>

    <PruviousDialog />
    <PruviousDragImage />
    <PruviousMediaDirectoryPopup />
    <PruviousMediaFileInput />
    <PruviousMediaLibraryPopup />
    <PruviousMediaUploadPopup />
    <PruviousUnsavedChanges />
    <PruviousGlobals />
  </div>
</template>

<script lang="ts" setup>
import { ref, useRoute, useRuntimeConfig, watch } from '#imports'
import { primaryLanguage } from '#pruvious'
import { dashboardHeaderLogoComponent, dashboardMiscComponent } from '#pruvious/dashboard'
import '../../assets/style.css'
import { useCollectionLanguage } from '../../composables/dashboard/collection-language'
import { usePruviousDashboard } from '../../composables/dashboard/dashboard'
import { pruviousToasterShow } from '../../composables/dashboard/toaster'
import { __, loadTranslatableStrings } from '../../composables/translatable-strings'
import { pruviousFetch } from '../../utils/fetch'

defineProps({
  showMenu: {
    type: Boolean,
    default: true,
  },
})

const collectionLanguage = useCollectionLanguage()
const dashboard = usePruviousDashboard()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const queryStringLanguage = ref('')
const queryStringLanguageWhere = ref('')

const HeaderLogo = dashboardHeaderLogoComponent()
const PruviousDialog = dashboardMiscComponent.Dialog()
const PruviousDragImage = dashboardMiscComponent.DragImage()
const PruviousGlobals = dashboardMiscComponent.Globals()
const PruviousMediaDirectoryPopup = dashboardMiscComponent.MediaDirectoryPopup()
const PruviousMediaFileInput = dashboardMiscComponent.MediaFileInput()
const PruviousMediaLibraryPopup = dashboardMiscComponent.MediaLibraryPopup()
const PruviousMediaUploadPopup = dashboardMiscComponent.MediaUploadPopup()
const PruviousQuickActions = dashboardMiscComponent.QuickActions()
const PruviousUnsavedChanges = dashboardMiscComponent.UnsavedChanges()

await loadTranslatableStrings('pruvious-dashboard')

watch(
  collectionLanguage,
  () => {
    if (collectionLanguage.value !== primaryLanguage) {
      queryStringLanguage.value = `?language=${collectionLanguage.value}`
      queryStringLanguageWhere.value = `?where=language[=][${collectionLanguage.value}]`
    } else {
      queryStringLanguage.value = ''
      queryStringLanguageWhere.value = ''
    }
  },
  { immediate: true },
)

async function clearCache() {
  const response = await pruviousFetch('clear-cache.post')

  if (response.success) {
    pruviousToasterShow({ message: __('pruvious-dashboard', 'Cache cleared successfully') })
  }
}
</script>

<style>
@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:400;src:url(../../assets/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:400;src:url(../../assets/KFOkCnqEu92Fr1Mu51xIIzIXKMny.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:500;src:url(../../assets/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:500;src:url(../../assets/KFOjCnqEu92Fr1Mu51S7ACc6CsTYl4BO.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}
</style>
