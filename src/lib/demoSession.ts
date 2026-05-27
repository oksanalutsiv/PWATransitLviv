/**
 * Simulates a pre-filled ticket context: the route and vehicle the user
 * just validated their ticket on. Values are fixed for the lifetime of
 * the page session so all three feedback forms show the same entry.
 */

const ROUTE_NUMBERS = ['2А', '5', '6А', '8', '9', '15', '25', '27', '33', '55А']
const VEHICLE_PREFIXES = ['Авт.', 'Авт.', 'Авт.', 'Трм.', 'Трл.']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const routeNum   = pick(ROUTE_NUMBERS)
const vehicleNum = String(1000 + Math.floor(Math.random() * 8000))
const prefix     = pick(VEHICLE_PREFIXES)

/** e.g. "25 · Авт. 4312" */
export const demoRoute = `${routeNum} · ${prefix} ${vehicleNum}`
