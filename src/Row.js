import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css"
import movieTrailer from 'movie-trailer'
import YouTube from 'react-youtube'



const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([])
  const [trailerUrl, setTrailerUrl] = useState("")

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl)
      setMovies(request.data.results)
      console.log(request.data.results)
      return request
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: '600',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('')
    } else {
      movieTrailer(movie?.title || "").then(url => {
        const urlParams = new URLSearchParams(new URL(url).search)
        setTrailerUrl(urlParams.get('v'))
      }).catch((err) => console.log(err))
    }
  }


  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map(movie => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name} />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opt={opts} />}

    </div>
  );
}

export default Row;
