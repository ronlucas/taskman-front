import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

  // URL base de tu API Spring Boot
  const API_URL = 'http://localhost:8080/taskman/tasks';

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      toast.error('Error al cargar las tareas');
      console.error('Error fetching tasks:', error);
    }
  };

  // Agregar una nueva tarea
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', dueDate: '' }); // Limpiar formulario
      toast.success('Tarea creada con éxito');
    } catch (error) {
      toast.error('Error al crear la tarea');
      console.error('Error adding task:', error);
    }
  };

  // Eliminar una tarea
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Tarea eliminada');
    } catch (error) {
      toast.error('Error al eliminar la tarea');
      console.error('Error deleting task:', error);
    }
  };

  // Marcar tarea como completada
  const handleToggleComplete = async (task) => {
    const updatedTask = { ...task, status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING' };
    try {
      const response = await axios.put(`${API_URL}/${task.id}`, updatedTask);
      setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
      toast.success(`Tarea marcada como ${updatedTask.status === 'COMPLETED' ? 'completada' : 'pendiente'}`);
    } catch (error) {
      toast.error('Error al actualizar la tarea');
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Task Manager</h1>

        {/* Formulario para agregar tareas */}
        <form onSubmit={handleAddTask} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Título"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full sm:col-span-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              Agregar Tarea
            </button>
          </div>
        </form>

        {/* Lista de tareas */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">No hay tareas aún.</p>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <div>
                  <h3
                    className={`text-lg font-medium ${
                      task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600">{task.description || 'Sin descripción'}</p>
                  <p className="text-sm text-gray-500">Vence: {task.dueDate || 'Sin fecha'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      task.status === 'PENDING'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {task.status === 'PENDING' ? 'Completar' : 'Desmarcar'}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    {/* Contenedor para las notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;