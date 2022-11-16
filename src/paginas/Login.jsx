import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";

const Login = () => {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ alerta, setAlerta ] = useState({});



    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        if([ email, password ].includes('') ) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            });
            return
        }
        if( password.length < 6 ) {
            setAlerta({
                msg: 'El password debe contener al menos 6 caracteres',
                error: true
            });
            return
        }



        try {
            const { data } = await clienteAxios.post('/usuarios/login', { email, password });
            setAlerta({})
            localStorage.setItem('token', data.token);
            setAuth(data)
            navigate('/proyectos')
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta;

  return (
    <>
        <h1 className="text-sky-600 font-black text-5xl">Inicia sesión y administra
          <span className="text-slate-700 uppercase">{' '}tus proyectos</span></h1>

          { msg && <Alerta alerta={alerta} />}

        <form
            className="my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
        >
            <div className="my-5">
                <label
                    className="uppercase text-gray-600 block text-xl font-bold"
                    htmlFor="email"
                >Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu email"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-100"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="my-5">
                <label
                    className="uppercase text-gray-600 block text-xl font-bold"
                    htmlFor="password"
                >Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu password"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-100"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <input
                type="submit"
                value="Iniciar Sesión"
                className="py-3 mb-5 uppercase font-bold hover:cursor-pointer bg-sky-700 hover:bg-white w-full rounded-lg text-white hover:text-sky-700 hover:border transition-colors"
            />
        </form>

        <nav className="lg:flex lg:justify-between">
            <Link
                className="block text-center my-5 text-slate-500 text-sm"
                to="/registrar"
            >¿No tiene una cuenta? <span className="uppercase text-sky-700 hover:font-bold">Regístrate</span></Link>

            <Link
                className="block text-center my-5 text-sky-700 uppercase text-sm hover:font-bold"
                to="/olvide-password"
            >Olvide mi password </Link>
        </nav>
    </>
  )
}

export default Login