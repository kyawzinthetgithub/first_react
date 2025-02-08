import Search from "@/components/Search"
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const BASE_API_URL = 'https://api.themoviedb.org/3';
const API_KRY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KRY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const endpoint = `${BASE_API_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTIONS); 
      
      if(!response.ok){
        throw Error('Failed to fetch movies!');
      }

      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies!');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Pleace try later!')
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies()
  },[]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-1.png" alt="Hero Banner" className="max-w-1/4 aspect-[1/1]" />
          <h1>Find <span className="text-gradient">Movies</span>  You&apos;ll Enjoy Without the Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h1>All Movies</h1>

          {loading ? (
            <div className="text-white flex justify-center items-center text-3xl">
              <Icon icon="eos-icons:bubble-loading" />
            </div>
          ): errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="text-white">
              {movieList.map((movie) => (
                <p className="text-white" key={movie.id}>{movie.title}</p>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  )
}

export default App