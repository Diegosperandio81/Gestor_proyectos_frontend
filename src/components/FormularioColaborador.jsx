import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";


const FormularioColaborador = () => {

    const { mostrarAlerta, alerta, submitColaborador } = useProyectos();

    const [ email, setEmail ] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        if( email === '' ){
            mostrarAlerta({
                msg: 'El email es obligatorio',
                error: true
            })
            return
        }

        submitColaborador(email);

    }

    const { msg } = alerta;

  return (
    <>
    <form
      className="bg-white py-10 px-10 w-full md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}

    >
        { msg && <Alerta alerta={alerta} />}

        <div className="mb-5">
            <label
            className="text-gray-700 uppercase font-bold text-sm "
            htmlFor="email"
            >Email colaborador/a</label>

            <input
            id="email"
            type="email"
            className="w-full p-2 mt-2 placeholder-gray-400 rounded-md border"
            placeholder="Ingresa el email del colaborador/a"
            value={email}
            onChange={ e => setEmail(e.target.value)}
            />
        </div>

        <input
            type="submit"
            value='buscar colaborador/a'
            className='w-full mt-3 bg-sky-600 rounded-lg p-2
                        text-white font-bold uppercase hover:bg-sky-700
                        cursor-pointer transition-colors'
        />
    </form>
    </>
  )
}

export default FormularioColaborador