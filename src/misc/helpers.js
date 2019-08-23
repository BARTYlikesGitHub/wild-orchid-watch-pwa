import * as Sentry from '@sentry/browser' // piggybacks on the config done in src/main.js
import { isNil } from 'lodash'

const commonHeaders = {
  Accept: 'application/json',
}

const jsonHeaders = {
  'Content-Type': 'application/json',
  ...commonHeaders,
}

// Prefer to dispatch('flagGlobalError') as that will inform the UI and call
// this eventually
export function wowErrorHandler(msg, err) {
  console.error(msg, err || '(no error object passed')
  const processedError = chainedError(msg, err)
  Sentry.captureException(processedError)
}

export function wowWarnHandler(msg, err) {
  console.warn(msg, err || '(no error object passed)')
  Sentry.withScope(scope => {
    scope.setLevel('warning')
    Sentry.captureException(chainedError(msg, err))
  })
}

export function postJson(url, data = {}) {
  const authHeaderValue = null
  return postJsonWithAuth(url, data, authHeaderValue)
}

export function postJsonWithAuth(url, data = {}, authHeaderValue) {
  // TODO consider using https://github.com/sindresorhus/ky instead of fetch()
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      ...jsonHeaders,
      Authorization: authHeaderValue,
    },
    body: JSON.stringify(data),
  }).then(handleJsonResp)
}

export function putJsonWithAuth(url, data = {}, authHeaderValue) {
  return fetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      ...jsonHeaders,
      Authorization: authHeaderValue,
    },
    body: JSON.stringify(data),
  }).then(handleJsonResp)
}

export function postFormDataWithAuth(
  url,
  populateFormDataCallback,
  authHeaderValue,
) {
  const formData = new FormData()
  populateFormDataCallback(formData)
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      ...commonHeaders,
      Authorization: authHeaderValue,
    },
    body: formData,
  }).then(handleJsonResp)
}

export function getJson(url) {
  const authHeader = null
  return getJsonWithAuth(url, authHeader)
}

export function getJsonWithAuth(url, authHeaderValue) {
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store', // TODO is this correct? Can we assume that SW will cache for us so if we're making a request, we want it fresh?
    headers: {
      ...jsonHeaders,
      Authorization: authHeaderValue,
    },
  }).then(handleJsonResp)
}

export function deleteWithAuth(url, authHeaderValue) {
  return fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-store',
    headers: {
      ...jsonHeaders,
      Authorization: authHeaderValue,
    },
  }).then(handleJsonResp)
}

async function handleJsonResp(resp) {
  const isJson = isRespJson(resp)
  const isRespOk = resp.ok
  try {
    if (isRespOk && isJson) {
      return resp.json()
    }
  } catch (err) {
    throw chainedError('Failed while parsing JSON response', err)
  }
  // resp either NOT ok or NOT JSON, prep nice error msg
  const bodyAccessor = isJson ? 'json' : 'text'
  const bodyPromise = resp.bodyUsed
    ? Promise.resolve('(body already used)')
    : resp[bodyAccessor]()
  const body = await bodyPromise
  const trimmedBody = typeof body === 'string' ? body.substr(0, 300) : body
  let msg = `\n  Resp ok=${isRespOk},\n`
  msg += `  Resp is JSON=${isJson}\n`
  msg += `  status=${resp.status}\n`
  msg += `  statusText=${resp.statusText}\n`
  msg += `  headers=${JSON.stringify(resp.headers)}\n`
  msg += `  url=${resp.url}\n`
  msg += `  body first 300 chars='${trimmedBody}'`
  throw new Error(msg)
}

/**
 * Assert that the record matches our schema.
 *
 * Using a verifier seems more maintainable than a mapper function. A mapper
 * would have a growing list of either unnamed params or named params which
 * would already be the result object. A verifier lets your freehand map the
 * object but it still shows linkage between all the locations we do mapping
 * (hopefully not many).
 */
export function verifyWowDomainPhoto(photo) {
  let msg = ''
  assertFieldPresent('id')
  assertFieldPresent('url')
  assertFieldPresent('licenseCode')
  assertFieldPresent('attribution')
  if (msg) {
    throw new Error(msg)
  }
  return
  function assertFieldPresent(fieldName) {
    photo[fieldName] ||
      (msg += `Invalid photo record, ${fieldName}='${
        photo[fieldName]
      }' is missing. `)
  }
}

function isRespJson(resp) {
  const mimeStr = resp.headers.get('Content-Type') || ''
  return /application\/(\w+(\.\w+)*\+)?json/.test(mimeStr)
}

export function chainedError(msg, err) {
  if (!err) {
    return new Error(
      `${msg}\nWARNING: chainedError` + ` was called without an error to chain`,
    )
  }
  err.message = `${msg}\nCaused by: ${err.message}`
  return err
}

export function now() {
  return new Date().getTime()
}

export function formatMetricDistance(metres) {
  if (!metres) {
    return metres
  } else if (metres < 1000) {
    return `${metres}m`
  }
  const kmVal = (metres / 1000).toFixed(1)
  return `${kmVal}km`
}

export function buildUrlSuffix(path, params = {}) {
  const querystring = Object.keys(params).reduce((accum, currKey) => {
    const value = params[currKey]
    if (isNil(value)) {
      return accum
    }
    return `${accum}${currKey}=${value}&`
  }, '')
  const qsSep = querystring ? '?' : ''
  return `${path}${qsSep}${querystring.replace(/&$/, '')}`
}

/**
 * Returns a function that can be used as a vuex getter to check if the
 * specified timestamp field has expired, so the corresponding field is
 * considered stale.
 */
export function buildStaleCheckerFn(stateKey, staleThresholdMinutes) {
  return function(state) {
    const lastUpdatedMs = state[stateKey]
    return (
      !lastUpdatedMs ||
      lastUpdatedMs < now() - staleThresholdMinutes * 60 * 1000
    )
  }
}

/**
 * Takes an array of valid values and returns a validator function. The
 * validator function takes a single param and returns it as-is if valid,
 * otherwise throws an error.
 */
export function makeEnumValidator(array) {
  if (array.constructor !== Array || !array.length) {
    throw new Error('Input must be a non-empty array!')
  }
  return function(enumItem) {
    const isValid = array.includes(enumItem)
    if (!isValid) {
      throw new Error(
        `Invalid enum value='${enumItem}' is not in valid values=[${array}]`,
      )
    }
    return enumItem
  }
}

export const _testonly = {
  buildUrlSuffix,
  formatMetricDistance,
  isRespJson,
  makeEnumValidator,
  verifyWowDomainPhoto,
}
