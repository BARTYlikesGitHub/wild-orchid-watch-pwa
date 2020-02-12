import Vue from 'vue'

// FIXME when linked issue in Onboarder is fixed, we can change all
// of these to local imports in the components they're used in.

import CarouselDots from '@/partials/CarouselDots'
import CustomToolbar from '@/partials/CustomToolbar'
import GoogleMap from '@/components/googleMap'
import Help from '@/partials/Help'
import ObsList from '@/partials/ObsList'
import PhotoPreviewModal from '@/partials/PhotoPreviewModal'
import RelativeTabbar from '@/partials/RelativeTabbar'
import WowAutocomplete from '@/partials/WowAutocomplete'
import WowHeader from '@/partials/WowHeader'
import WowInputStatus from '@/partials/WowInputStatus'

Vue.component('carousel-dots', CarouselDots)
Vue.component('custom-toolbar', CustomToolbar)
Vue.component('google-map', GoogleMap)
Vue.component('obs-list', ObsList)
Vue.component('relative-tabbar', RelativeTabbar)
Vue.component('wow-autocomplete', WowAutocomplete)
Vue.component('wow-header', WowHeader)
Vue.component('wow-help', Help)
Vue.component('wow-input-status', WowInputStatus)
Vue.component('wow-photo-preview', PhotoPreviewModal)
