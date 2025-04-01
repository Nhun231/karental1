import axios from "axios";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return authContext;
};


const AuthProvider = ({children}) =>{
    //const nav = useNavigate();
    const [code,setCode] = useState();
    // fetch the access token from cookie
    //const [cookies, setCookie, removeCookies] = useCookies(['karental-jwt']);
    //const [cookiesRefresh, setCookieRefresh, removeCookiesRefresh] = useCookies(['karental-jwt-refresh']);
    // useEffect (()=>{
    //     const fetchMe = async ()=>{
    //         try{  
    //             const response = axios.get('')
    //         }catch{
    //             setToken(null);
    //         }

    //     }
    //     fetchMe();
    // },[]);
    // useLayoutEffect ensures the interceptor is set up synchronously before the next render.
    // useLayoutEffect(()=>{
    //     const authInterceptor = axios.interceptors.request.use((config)=>{
    //         console.log('run through this to check if there is token')
    //         config.headers.Authorization =
    //             !config._retry && token 
    //             // if header does not contain token
    //             ?  `Bearer ${token}`
    //             // if it does, just return that before token
    //             :config.headers.Authorization
    //         return config;
    //     });
    //     return () => {
    //         // remove the interceptor no longer needed to prevent duplication
    //         axios.interceptors.request.eject(authInterceptor)
    //     }
    // },[token]);
    const nav = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const alertShownRef = useRef(false);
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    // Get CSRF token from cookies
    const [cookies] = useCookies(["karental-jwt-csrf"]);
    // Attach CSRF token to all requests
    useLayoutEffect(() => {
        const csrfInterceptor = axios.interceptors.request.use((config) => {
            const csrfToken = cookies["karental-jwt-csrf"];
            console.log("Setting CSRF Token:", csrfToken);
            if (csrfToken) {
                config.headers["X-CSRF-TOKEN"] = csrfToken;
            } else {
                console.warn("No CSRF token found in cookies!");
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(csrfInterceptor);
        };
    }, [cookies]);
    useLayoutEffect(()=>{
        const refreshInterceptor = axios.interceptors.response.use(
            (response) => response,
            async(error)=>{
                // save error.config(as a configuration object) to retry request later
                const originalRequest = error.config;
                if (originalRequest._retry) {
                    return Promise.reject(error);
                }
                if(error.response?.status === 401 && error.response?.message===4003){
                    if(isRefreshing){
                        return Promise.reject(error)
                    }
                    setIsRefreshing(true);
                    originalRequest._retry=true;
                    try{
                        // call to refresh Refresh token
                        await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/refresh-token`,{
                            withCredentials: true,
                        });
                        console.log('Through cookie refresh')
                        //marked as retried
                        setIsRefreshing(false);
                        //retry failed request
                        return axios(originalRequest);
                    }catch(refreshError){
                        setIsRefreshing(false);
                        console.log("Request refresh token failed: ",refreshError);
                        if (!alertShownRef.current) { // Show alert only once
                            alertShownRef.current = true;
                            alert("This account is offline too long! Please try to login again.");
                            setTimeout(() => {
                                alertShownRef.current = false; // Reset after navigation
                                nav("/");
                            }, 0);
                        }
                        return Promise.reject(refreshError)
                    }

                }
                // if not 401, reject error
                return Promise.reject(error)
            }
        )
        return ()=>{
            axios.interceptors.response.eject(refreshInterceptor);
        }
    },[nav, isRefreshing]);
    return (
        <AuthContext.Provider >
            {children}
        </AuthContext.Provider>
    )
};
export default AuthProvider;
