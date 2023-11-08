import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Toaster, toast } from 'react-hot-toast';
import moment from 'moment';

function App() {
  const [tareas, setTareas] = useState([]);

  const task = useFormik({
    initialValues: {
      descripcion: "",
      estado: "NUEVA",
      fechaVencimiento: ""
    }
  });

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = () => {
    axios.get('http://localhost:8080/tareas')
      .then(resp => {
        setTareas(resp.data);
      })
      .catch(error => {
        toast.error("No se ha podido obtener el listado de tareas");
      })
  }

  const addNewTask = (data) => {
    if(task.values.descripcion !== "" && task.values.fechaVencimiento !== "") {
      axios.post('http://localhost:8080/tareas', data)
      .then(res => {
        toast.success("Tarea agregada exitosamente");
        task.resetForm();
        getAllTasks();
      })
      .catch(error => {
        toast.error("No se ha podido agregar la tarea, intente más tarde");
      })
    } else {
      toast.error("Debe llenar los campos obligatorios");
    }
  }

  const finishTask = (id) => {
    axios.put('http://localhost:8080/tareas/' + id)
      .then(res => {
        toast.success("Se ha finalizado la tarea exitosamente");
        getAllTasks();
      })
      .catch(error => {
        toast.error("No se ha podido finalizar la tarea, intente más tarde");
      })
  }

  const deleteTask = (id) => {
    axios.delete('http://localhost:8080/tareas/' + id)
      .then(res => {
        toast.success("Se ha eliminado la tarea exitosamente");
        getAllTasks();
      })
      .catch(error => {
        toast.error("No se ha podido eliminar la tarea, intente más tarde");
      })
  }

  const getFecha = (fecha) => {
    let date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    moment.locale('es');

    return moment(date).format('DD/MM/YY');
  }

  return (
    <>
      <div className="grid place-items-center font-serif">
        <h1 className='text-3xl'>To Do List</h1>
        <div><Toaster position='top-center' reverseOrder={false}/></div>
        <br />

        <form id="taskRegisterForm" name='taskForm' className='w-full max-w-sm'>
          <div className='md:flex md:items-center mb-6'>
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                Tarea
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="inline-descripcion"
                name='descripcion' 
                type="text"
                placeholder='Descripción de la tarea'
                value={task.values.descripcion}
                onChange={task.handleChange}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                Vencimiento
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="inline-fecha"
                name='fechaVencimiento'
                type="date"
                value={task.values.fechaVencimiento}
                onChange={task.handleChange}
              />
            </div>
          </div>

          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button type="button" onClick={(e) => addNewTask(task.values) } className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </form>
        <hr />

        <div className='relative overflow-x-auto'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className="px-6 py-3">Descripción</th>
                <th scope='col' className="px-6 py-3">Estatus</th>
                <th scope='col' className="px-6 py-3">Vencimiento</th>
                <th scope='col' className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea, key) => {
                return (
                  <tr key={key} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ tarea.descripcion }</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ tarea.estado }</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ getFecha(tarea.fechaVencimiento) }</td>
                    <td>
                      <button type="button" onClick={ () => finishTask(tarea.tareaId) } className="text-white bg-[#108c0a] hover:bg-[#3ccb35]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2">
                        <i className="fa-solid fa-check-to-slot"></i>
                      </button>
                      <button type="button" onClick={ () => deleteTask(tarea.tareaId) } className="text-white bg-[#a70c05] hover:bg-[#f0271e]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
