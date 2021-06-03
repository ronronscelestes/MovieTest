import './App.css';

import React, { Component } from 'react';
import axios from 'axios';

import Button from './Components/Button';
import Card from './Components/TitleImageCard';

let interval;

export class App extends Component {

  state = {
    movie: null,
    actor: null,
    points: 0,
    winStatus: null
  }

  getMovieAndActor = () => {
    axios.get('https://api.themoviedb.org/3/movie/popular?api_key=7ea5f490261a949e52930517e1b4657c&language=en-US&page=1')
    .then(res => {
      let movieIndex = Math.floor(Math.random() * 20);
      this.setState({movie: {
        title: res.data.results[movieIndex].title, 
        poster: `https://image.tmdb.org/t/p/w500` + res.data.results[movieIndex].poster_path, 
        id: res.data.results[movieIndex].id
      }});
    })
    .then(() => {
      let randomNum = Math.floor(Math.random() * 11);
      if(randomNum >= 5) {
        axios.get(`https://api.themoviedb.org/3/movie/${this.state.movie.id}/credits?api_key=7ea5f490261a949e52930517e1b4657c&language=en-US`)
        .then(movieRes => {
          let cast = movieRes.data.cast;
          this.setState({actor: {
            name: cast[cast.length - 1].name,
            picture: `https://image.tmdb.org/t/p/w500`+ cast[cast.length - 1].profile_path,
            isInTheMovie: true
          }})
        })
      } else {
        axios.get('https://api.themoviedb.org/3/person/popular?api_key=7ea5f490261a949e52930517e1b4657c&language=en-US&page=1')
        .then(randomActor => {
          let actorIndex = Math.floor(Math.random() * 20);
          let actor = randomActor.data.results[actorIndex];
          this.setState({actor: {
            name: actor.name,
            picture: `https://image.tmdb.org/t/p/w500`+ actor.profile_path,
            isInTheMovie: false
          }})
        })
      }
  
    })
    .catch(err => console.log(err));

    this.timer();
  }

  timer = () => {
    let timer = 5;
    interval = setInterval(() => {
      timer--;
      if(timer <= 0) {
        clearInterval(interval);
        this.setState({movie: null, actor: null})
      }
    }, 1000);
  }

  isActorRes = (res) => {
    const { actor, points } = this.state;
    if(res === 'yes') {
      this.setState({points: actor.isInTheMovie ? points + 1 : points})
      this.setState({winStatus: actor.isInTheMovie ? 'win' : 'lose'})
    } else {
      this.setState({points: !actor.isInTheMovie ? points + 1 : points});
      this.setState({winStatus: !actor.isInTheMovie ? 'win' : 'lose'});
    }

    this.setState({movie: null, actor: null});
    setTimeout(() => this.setState({winStatus: null}), 1200)
    clearInterval(interval);
  }

  render() {
    const { movie, actor, points, winStatus } = this.state;

    return (
    <div className="App">
      <p>you've got {points} points</p>
      {!movie &&
        <button
            onClick={this.getMovieAndActor}
            className='button'
          >
            Click me
        </button>
      }

      <div className='movie-actor-container'>
        {movie && actor &&
          <>
            <Card type='movie' data={movie}/>
            <Card type='actor' data={actor}/>
          </>
        }
      </div>
      {movie && 
        <>
          <Button action={this.isActorRes} res='yes'/>
          <Button action={this.isActorRes} res='no'/>
        </>
      }
      {winStatus && 
        <p>You {winStatus}</p>
      }
    </div>
    )
  }
}

export default App;
