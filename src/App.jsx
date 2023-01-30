import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import Loader from './components/Loader'
import WeatherCard from './components/WeatherCard'

const API_KEY = 'a8b73ddc7f2942c5c6b1538dda0ff8f7'

function App() {

  const [coords, setCoords] = useState()
  const [weather, setWeather] = useState()
  const [temps, setTemps] = useState()
  const [isCelsius, setIsCelsius] = useState(true)
  const [nameCity, setNameCity] = useState()

  const success = (e) => {
    const newCoords = {
      lat: e.coords.latitude,
      lon: e.coords.longitude
    }

    setCoords(newCoords)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameCity(e.target.nameCity.value)
    console.log("handleSubmit", e.target.nameCity.value)
    //getCoords(nameCity)
  }

  const getCoords = async(nameCity) => {
    console.log("getCoords", nameCity)
    const end_point = `http://api.openweathermap.org/geo/1.0/direct?q=${nameCity}&limit=5&appid=${API_KEY}`
    axios.get(end_point)
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err))
  }

  const changeUnitTemp = () => setIsCelsius(!isCelsius)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success)
  }, [])

  useEffect(() => {
    if(coords) {
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`
    axios.get(URL)
    .then(res => {
      setTimeout(() => {
        setWeather(res.data);
      const celsius = (res.data.main.temp - 273.15).toFixed(2);
      const fahrenheit = (celsius * (9/5) + 32).toFixed(2);
      const newTemps = {
        celsius,
        fahrenheit
      }
      setTemps(newTemps)
      }, 1000)
      
    })
    .catch(err => console.log(err))
    }

    if(nameCity) {
      getCoords(nameCity);
    }
  }, [coords, nameCity])
  
  return (
    <div className="App">
      {
        weather ? (
          <>
          <WeatherCard 
            weather={weather} 
            temps={temps} 
            isCelsius={isCelsius} 
            changeUnitTemp={changeUnitTemp} 
            API_KEY={API_KEY}
            setCoords={setCoords}/>
            </>
        ) : <Loader />
      }
    </div>
  )
}

export default App
