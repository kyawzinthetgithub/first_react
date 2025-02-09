import Search from "@/components/Search"
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrandingMovies, updateSearchCount } from "./appwrite";

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
  const [debounceSearchTrem, setDebounceSearchTrem] = useState('');
  const [trandingMovies,setTrandingMovies] = useState([]);

  useDebounce(()=>setDebounceSearchTrem(searchTerm),800,[searchTerm]);

  const fetchMovies = async (query) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const endpoint = query ? `${BASE_API_URL}//search/movie?query=${encodeURIComponent(query)}` : `${BASE_API_URL}/discover/movie?sort_by=popularity.desc`;
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

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Pleace try later!')
    }finally{
      setLoading(false);
    }
  }

  const loadingTrandingMovies=  async () => {
    try{
      const movies = await getTrandingMovies();

      setTrandingMovies(movies);

    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTrem)
  },[debounceSearchTrem]);

  useEffect(() => {
    loadingTrandingMovies();
  },[]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" className="max-w-1/4 aspect-[1/1]" />
          <h1>Find <span className="text-gradient">Movies</span>  You&apos;ll Enjoy Without the Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trandingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending</h2>
            <ul>
              {trandingMovies.map((movie,index) => (
                <li key={movie.$id}>
                  <p>{index + 1} </p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

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
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  )
}

export default App