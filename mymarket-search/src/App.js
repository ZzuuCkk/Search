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
  const [keyWords,setKeyWord] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTxt , setSearchTxt] = useState('');
  const searchValue = keyWords.length;
  const [productValueError,setProductValueError] = useState('');
  const [productvalue, setProductValue] = useState()
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

  },[accesToken])




  const handleSearch = async (e) => {

    try {
      e.preventDefault() 
      setSearchTxt('')

      if(searchValue <= 5){
        setSearchTxt('Product must contain 5 or more symbol')
        return
      }
      const responses = await axios.post(
        `https://api2.mymarket.ge/api/ka/products`,
        {
           Keyword: keyWords,
           Limit:16,
           Page:4
           
        
        }
      );
      
      setSearchResults(responses.data?.data.Prs);
      const total = responses.data.data.totalCount
      setProductValue(total)
 
      if(total === 0){
       setProductValueError("სასურველი პროდუქტი ვერ მოიძებნა")
     }

    } catch (searchTxt) {
      console.error('ERROR');
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
                value={keyWords}
                onChange={(e) => setKeyWord(e.target.value)}
                />
                <br></br>
                <button onClick={handleSearch} className='searchbtn'> <img src ={searchL}  className='searchL' alt='searchlogo'/></button>
          </div>
          <br></br>
          <p>{searchTxt}</p>
          <p>{productValueError}</p>
          <br></br>
                  
          <div className='result'>
                {
                  searchResults?.map((result) => {

                    return(

                     
                        <div className='card'>
                          <div className='cardTxt'>
                            <h2>{result.title}ashdasld</h2>
                            {/* <p className='price'>{result.lang_data.stripped_descr}</p> */}
                            <p className='price'>ფასი : {result.price}</p>
                          </div>
                            <img className='productImg' src={result.photos[0].thumbs} className='cardImg' alt='product image' />
                            
                                
                            
                        </div>
                         
                      )}
                      
                      )
                  
                }
                <>
                         <p className='error'>{error}</p>
                      </>
          </div>
          
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
