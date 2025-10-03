import MovieCard from "./components/MovieCard";
import Search from "./components/search";
import Spinner from "./components/Spinner";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const App = () => {
  //states
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query.trim())}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to Fetch Movies");
      } else {
        const data = await response.json();
        if (data.Response === "False") {
          setErrorMessage(data.Error || "Failed to Fetch Movies");
          setMovieList([]);
          return;
        }
        setMovieList(data.results || []);
      }
    } catch (error) {
      console.log(`Error Fetching Movies ${error}`);
      setErrorMessage("Error fetching movies please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  useDebounce(() => setDebouncedQuery(searchTerm), 500, [searchTerm]);
  useEffect(() => {
    fetchMovies(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <p className="text-white">
              <Spinner />
            </p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
