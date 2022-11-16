import { useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";


const OlvidePassword = () => {

    const [email, setEmail ] = useState('')
    const [alerta, setAlerta ] = useState({})

    const handleSubmit = async e => {
        e.preventDefault();

        if (email === '' || email.length < 6 ) {
            setAlerta({
                msg: 'El email es obligatorio',
                error: true
            });
            return
        }

        try {

            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {email})

            setAlerta({
                msg: data.msg,
                error: false,
            })
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            })
        }
    }

    const { msg } = alerta;
  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl">Recupera tu acceso y no pierdas
          <span className="text-slate-700 uppercase">{' '} tus proyectos</span></h1>

        {msg && <Alerta alerta={alerta} />}

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

            <input
                type="submit"
                value="Enviar instrucciones"
                className="py-3 mb-5 uppercase font-bold hover:cursor-pointer bg-sky-700 hover:bg-white w-full rounded-lg text-white hover:text-sky-700 hover:border transition-colors"
            />
        </form>

        <nav className="lg:flex lg:justify-between">
            <Link
                className="block text-center my-5 text-slate-500 text-sm"
                to="/"
            >¿Ya tienea una cuenta? <span className="uppercase text-sky-700 hover:font-bold">Inicia sesión</span></Link>

            <Link
                className="block text-center my-5 text-slate-500 text-sm"
                to="/registrar"
            >¿No tiene una cuenta? <span className="uppercase text-sky-700 hover:font-bold">Regístrate</span></Link>
        </nav>
    </>
  )
}

export default OlvidePassword
