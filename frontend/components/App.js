import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/')
  }
  const redirectToArticles = () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      navigate('/')
    } else {
      navigate('/articles')
    }
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    navigate('/')
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)

    try {
      const response = await axios.post(loginUrl, { username, password });

      localStorage.setItem('token', response.data.token);

      setMessage(response.data.message);

      navigate('/articles')
    }
    catch (err) {
      setMessage(`Login failed: ${err.response ? err.response.error : err.message}`)
    }
    finally {
      setSpinnerOn(false)
    }
  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)

    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(articlesUrl, { headers: { Authorization: token } });

      setArticles(response.data.articles);

      setMessage(response.data.message)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/');
      } else {
        setMessage(`Failed to fetch articles: ${err.message}`);
      }
    } finally {
      setSpinnerOn(false);
    }
  }

  const postArticle = async (article, onSuccess) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('');
    setSpinnerOn(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token };

      const response = await axios.post(articlesUrl, article, { headers });
      
      setArticles(previousArticles => [...previousArticles, response.data.article]);
      setMessage(response.data.message);
      onSuccess()
    } catch (err) {
      setMessage(err.response ? err.response.data.message : err.message);
    } finally {
      setSpinnerOn(false);
    }
};
  

  const updateArticle = async (article_id, article) => {
    setMessage('');
    setSpinnerOn(true);
  
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token };
      const url = `${articlesUrl}/${article_id}`; 
  
      const response = await axios.put(url, article, { headers });
  
      if (response.status === 200) {
        // Update the article in the state
        setArticles(previousArticles => previousArticles.map(art => 
          art.article_id === article_id ? { ...art, ...response.data.article } : art
        ));
        setMessage(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage(err.message);
      }
    } finally {
      setSpinnerOn(false);
    }
  };

  const deleteArticle =  async (article_id) => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token }

      console.log('Token:', token);
      console.log('Headers:', headers);

      const url = `${articlesUrl}/${article_id}`


      const response = await axios.delete(url, { headers })

      if (response.status === 200) {
        setArticles(previousArticles => previousArticles.filter(article => article.article_id !== article_id))
      }
      setMessage(response.data.message)

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage(err.message);
      }
    } finally {
      setSpinnerOn(false);
    }
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                articles={articles}
              />
              <Articles 
              articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
