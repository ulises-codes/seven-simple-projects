import 'regenerator-runtime/runtime'

const userLocationElement = document.getElementById('user-location')
const dateElements = document.querySelectorAll('.date')

const dayTempElements = document.querySelectorAll('.day-temp')
const nightTempElements = document.querySelectorAll('.night-temp')

const shortForecastElements = document.querySelectorAll('.short-forecast')
const weatherIconElements = document.querySelectorAll('.weather-icon')

const windElements = document.querySelectorAll('.wind-speed')

const endpoint = 'https://api.weather.gov/points'

const today = new Date()

const lookupIP = async () => {
  const res = await fetch(`https://ipapi.co/json`)

  const { longitude, latitude, city, region_code } = await res.json()

  getForecast({ latitude, longitude })

  userLocationElement.textContent = `${city}, ${region_code}`
}

window.addEventListener('load', lookupIP)

// Populate each day of the week
dateElements.forEach((el, i) => {
  const forecastDay = new Date(today)

  forecastDay.setDate(forecastDay.getDate() + i)

  const weekday = forecastDay.toLocaleDateString(undefined, {
    weekday: 'short',
  })

  const day = forecastDay.toLocaleDateString(undefined, { day: '2-digit' })

  el.textContent = `${weekday} ${day}`
})

const getForecast = async ({ latitude, longitude }) => {
  const res = await fetch(
    `${endpoint}/${latitude.toFixed(4)},${longitude.toFixed(4)}`
  )

  const doc = await res.json()

  const forecastRes = await fetch(doc.properties.forecast)
  const forecast = await forecastRes.json()

  displayForecast(forecast.properties.periods)
}

const mapForecast = forecast => {
  const forecastMap = forecast.reduce((map, period) => {
    const startDate = new Date(period.startTime)

    const periodId = startDate.toLocaleDateString()

    const timeOfDay = period.isDaytime ? 'day' : 'night'

    if (map.length > 0 && map[map.length - 1].date === periodId) {
      map[map.length - 1] = {
        ...map[map.length - 1],
        [timeOfDay]: period,
      }

      return map
    }

    map.push({ [timeOfDay]: period, date: periodId })

    return map
  }, [])

  return forecastMap
}

const displayForecast = forecast => {
  mapForecast(forecast).forEach(({ day, night }, i) => {
    if (i > 6) return

    const { icon, shortForecast, windSpeed, windDirection } = day ?? night

    nightTempElements.item(i).textContent = night.temperature
    weatherIconElements.item(i).src = icon

    shortForecastElements.item(i).textContent = shortForecast
    windElements.item(i).textContent = `${windSpeed} ${windDirection}`

    if (!day) return nightTempElements.item(i).classList.add('active')

    dayTempElements.item(i).textContent = day.temperature
    dayTempElements.forEach(el => el.classList.add('active'))
  })
}
