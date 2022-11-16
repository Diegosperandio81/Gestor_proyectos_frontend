import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Alerta from "./Alerta";
import useProyectos from "../hooks/useProyectos";

const FormularioProyecto = () => {

  const [ id, setId ] = useState(null);
  const [ nombre, setNombre ] = useState('');
  const [ descripcion, setDescripcion ] = useState('');
  const [ fechaEntrega, setFechaEntrega ] = useState('');
  const [ cliente, setCliente ] = useState('');

  const params = useParams();

  const { mostrarAlerta, alerta, submitProyecto, proyecto, setAlerta } = useProyectos();


  useEffect(() => {
    if (params.id ) {
      setId(proyecto._id)
      setNombre(proyecto.nombre)
      setDescripcion(proyecto.descripcion)
      setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]) //forma de seleccionar el año-mes-dia que necesita para completar
      setCliente(proyecto.cliente)
    } else {
      console.log('Nuevo proyecto ...')
    }

  }, [params])


  const handleSubmit = async e => {
    e.preventDefault();

    if ( [nombre, descripcion, fechaEntrega, cliente ].includes('') ){
        mostrarAlerta({
          msg: 'Todos los campos son obligatorios',
          error: true
        })
        return
    }

    //pasar los datos hacia el provider
    await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente});
    setId(null)
    setNombre('')
    setDescripcion('')
    setFechaEntrega('')
    setCliente('')
  }

  const { msg } = alerta;

  return (
    <form
      className="bg-white py-10 px-10 md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >

      { msg && <Alerta alerta={alerta} />}

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm "
          htmlFor="nombre"
        >Nombre proyecto</label>

        <input
          id="nombre"
          type="text"
          className="w-full p-2 mt-2 placeholder-gray-400 rounded-md border"
          placeholder="Nombre del proyecto"
          value={nombre}
          onChange={ e => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm "
          htmlFor="descripcion"
        >Descripción</label>

        <textarea
          id="descripcion"
          className="w-full p-2 mt-2 placeholder-gray-400 rounded-md border"
          placeholder="Descripcion del proyecto"
          value={descripcion}
          onChange={ e => setDescripcion(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm "
          htmlFor="fecha-entrega"
        >Fecha de entrega</label>

        <input
          id="fecha-entrega"
          type="date"
          className="w-full p-2 mt-2 placeholder-gray-400 rounded-md border"
          value={fechaEntrega}
          onChange={ e => setFechaEntrega(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm "
          htmlFor="cliente"
        >Nombre del cliente</label>

        <input
          id="cliente"
          type="text"
          className="w-full p-2 mt-2 placeholder-gray-400 rounded-md border"
          placeholder="Nombre del cliente"
          value={cliente}
          onChange={ e => setCliente(e.target.value)}
        />
      </div>

      <input
        type="submit"
        value={ id ? "Guardar cambios" : "Crear proyecto"}
        className="bg-sky-600 text-white mt-1 p-2 rounded uppercase font-bold hover:bg-sky-800 w-full cursor-pointer transition-colors"
      />
    </form>
  )
}

export default FormularioProyecto


