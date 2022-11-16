import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";

const NuevoPassword = () => {

  const [ tokenValido, setTokenValido ] = useState(false);
  const [ alerta, setAlerta ] = useState({});
  const [ password, setPassword ] = useState('');

  const [ passwordModificado, setPasswordModificado ] = useState(false);

  const params = useParams();

  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {

      try {

        await clienteAxios(`/usuarios/olvide-password/${token}`)

          setTokenValido(true)

      } catch (error) {
         setAlerta({
          msg: error.response.data.msg,
          error: true,
         })
      }
    }
    comprobarToken();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
      if (password.length < 6 ) {
        setAlerta({
          msg: "El password debe contener al menos 6 caracteres",
          error: true
        })
        return
      }

    try {
      const url = `/usuarios/olvide-password/${token}`
      await clienteAxios.post(url, {password})
      setAlerta({
        msg: "Nuevo password registrado correctamente",
        error: false
      })
      setPassword('')
      setPasswordModificado(true)

      setTimeout(() => {
        setAlerta({})
      }, 2000);

    } catch (error) {
      setAlerta({
        msg: data.response.data.msg,
        error: true
      })
    }
  }

   const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl">Reestablece tu password y no pierdas acceso a
          <span className="text-slate-700 uppercase">{' '} tus proyectos</span></h1>

        { msg && <Alerta alerta={alerta} />}

        {tokenValido && (
          <form
            className="my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
          >
              <div className="my-5">
                  <label
                      className="uppercase text-gray-600 block text-xl font-bold"
                      htmlFor="password"
                  >Nuevo password</label>
                  <input
                      id="password"
                      type="password"
                      placeholder="Ingresa tu nuevo password"
                      className="w-full mt-3 p-3 border rounded-xl bg-gray-100"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                  />
              </div>

              <input
                  type="submit"
                  value="Guardar nuevo password"
                  className="py-3 mb-5 uppercase font-bold hover:cursor-pointer bg-sky-700 hover:bg-white w-full rounded-lg text-white hover:text-sky-700 hover:border transition-colors"
              />
          </form>
        )}
        {passwordModificado && (
          <nav className="lg:flex lg:justify-between">
          <Link
              className="block text-center my-5 text-slate-500 text-sm"
              to="/"
          >Ya puedes <span className="uppercase text-sky-700 hover:font-bold">Iniciar sesión</span></Link>
      </nav>
        )}
    </>
  )
}

export default NuevoPassword