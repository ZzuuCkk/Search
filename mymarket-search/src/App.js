import './App.css'
import { useEffect, useState,useMemo, useRef} from 'react';
import axios from 'axios'
import searchL from './search.svg';
function App() {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [user,setUser] = useState(null)
  const [accesToken,setAccessToken] = useState('')
  const [address,setAddres] = useState()
  const [disabled,setDisabled] = useState(false)
  const [keyWord,setKeyWord] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const handleClick = async (e) => {
    try {
        e.preventDefault() // prevent make request
        setError('')

        if(!email ||!password){
          setError('please fill your information')
          return
        }


        const response = await axios.post(
            'https://accounts.tnet.ge/api/ka/user/auth',
            {
              Email: email,
              Password : password
            }
          )

        const token = response?.data?.data?.access_token
        const userInfo = response?.data?.data?.Data

        setUser(userInfo)
        setAccessToken(token)
        localStorage.setItem('token',token)
        localStorage.setItem('user',JSON.stringify(userInfo))
    }catch (e){
        setError(e.response.data.message.error_data._error[0])
    } 
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setAccessToken(null)
  }

  const getAddress = async () => {
    const response = await axios.get(
      'https://api2.mymarket.ge/api/ka/user/getaddresses',
      {
        headers: {
            Authorization: accesToken
        }
      }

    )

    setAddres(response?.data?.data[0])
  }

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = JSON.parse(localStorage.getItem('user'))

    if(u){
      setUser(u)
    }

    if(t){
      setAccessToken(t)
    }

    // if(accesToken){
    //   getAddress()
    // }
  },[accesToken])


  useEffect(() => {

    // if(email && password){
    //   if(password.length > 10){
    //     setDisabled(false)
    //   }else{
    //     setDisabled(true)
    //   }

    // }else{
    //   setDisabled(true)
    // }

  },[email,password])

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        `
        http://api2.mymarket.ge/api/ka/products=${keyWord}`,
        {
          headers: {
            Authorization: accesToken,
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
         },
        }
      );
      setSearchResults(response.data.Prs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <>
        {user? 
        <>
        <div className='user'>

            <div className='logged'>USER :  {user.user_name} {user.user_surname}</div>
            {/* your address is {address?.address}
            <button onClick={() => getAddress()}>get address</button> */}
            <button onClick={() => logout()} className='logout'>logout</button>
        </div>
          <div className='search'>

              <input
              className='searchinput'
                type="text"
                placeholder="   Search"
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
                />
                <br></br>
                <button onClick={handleSearch} className='searchbtn'> <img src ={searchL}  classname='searchL' alt='searchlogo'/></button>
          </div>
          <br></br>
          {searchResults &&
            searchResults.map((result) => (
              <div  className='result'>
                <h2>{searchResults[0].lang_data.title}</h2>
                <p>{searchResults[0].lang_data.descr}</p>
                {/* <img src={result.image} alt={result.name} /> */}
              </div>
  ))}
          
        </>
        :
        <form onSubmit={handleClick}>
            <br/>
            <div className='auth'>

            <h1 className='title'>ავტორიზაცია</h1>
            <input type="text" placeholder="   ელფოსტა" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <br></br>
            <input type="password" placeholder="   პაროლი" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <br></br>
            <button disabled={disabled} type="submit" className='btn'>Submit</button>
            <br/>
            <p className='error'>{error}</p>
            </div>
        </form>
      }
      </>
  );





}



export default App;
