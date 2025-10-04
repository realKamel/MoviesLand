import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);
console.log(supabase);
export const updateMovieCount = async (searchTerm, movie) => {
  try {
    //perform search call
    const { data, error } = await supabase
      .from("Metrics")
      .select()
      .eq("search_term", searchTerm);

    if (error) {
      console.log(error);
    }

    if (data?.length === 0) {
      const { error } = await supabase.from("Metrics").insert({
        movie_id: movie.id,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        search_term: searchTerm,
      });
      if (error) {
        console.log(error);
      }
    } else {
      // if searchTerm exits and increase it
      const item = data[0];
      item.count += 1;

      const { newObj, error } = await supabase
        .from("Metrics")
        .update({ count: item.count })
        .eq("search_term", searchTerm)
        .select();

      console.log(newObj);
      if (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const data = await supabase
      .from("Metrics")
      .select()
      .order("count", { ascending: false })
      .limit(5);
    console.log("Trending data", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
