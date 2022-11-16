import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [ auth, setAuth ] = useState({});
    const [ cargando, setCargando ] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        //vemos si hay un token en local storage
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');

            if ( !token ) {
                setCargando(false)
                return
            }

            //para autenticar se necesita enviar el token de autorizacion y eso se hace con una configuracion
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                //con esto mantenemos al usuario en la pagina personal
                /* navigate('/proyectos') */
            } catch (error) {
                setAuth({})
            }

            setCargando(false)

        }

        autenticarUsuario();
    }, [])

    //cerrar sesion
    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
    <AuthContext.Provider
        value={{
            auth,
            setAuth,
            cargando,
            cerrarSesionAuth
        }}
    >
        {children}
    </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;