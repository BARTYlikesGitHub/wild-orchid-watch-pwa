// Our chunk-vendors JS is pretty big (TODO see if we can optimise it to get it
// smaller). This number needs to be bigger than the size of our vendor JS to
// make sure it is included in the precache otherwise the app will break (white
// screen on load) after every new deploy.
const largeEnoughToIncludeOurMassiveVendorsChunk = 20 * 1000 * 1000

module.exports = {
  swSrc: 'dist/sw-needsinjecting.js',
  swDest: 'dist/service-worker.js',
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{css,woff,woff2,ttf,eot,svg,jpg,png,xml,ico,json,webapp,html,js,txt,thmx}',
  ],
  globIgnores: ['sw*', 'stats.json', 'service-worker.js'],
  maximumFileSizeToCacheInBytes: largeEnoughToIncludeOurMassiveVendorsChunk,
}
