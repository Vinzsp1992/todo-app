import {  useEffect, useRef, useState } from 'react';
import bg_mobile_dark from '../assets/images/bg-mobile-dark.jpg'
import bg_mobile_light from '../assets/images/bg-mobile-light.jpg'
import bg_desktop_dark from '../assets/images/bg-desktop-dark.jpg'
import bg_desktop_light from '../assets/images/bg-desktop-light.jpg'
import moon from '../assets/images/icon-moon.svg'
import sun from '../assets/images/icon-sun.svg'
import check from '../assets/images/icon-check.svg'
import cross from '../assets/images/icon-cross.svg';


interface Task {
    id: string;
    description: string;
    completed: boolean;
  }

const Todo: React.FC<Task> = () =>{
    const [task, setTask] = useState<Task[]>([]);
    const [toggleTheme , setToggleTheme] = useState<boolean>(true);
    const [newTask, setNewTask] = useState<string>("");
    const [activeTasks, setActiveTasks] = useState<Task[]>([]);

    //for changing text color if active state the value will be true then false.
    const [allTasks, _setAllTasks] = useState<boolean>(false);
    const [completedTasks, _setCompletedTasks] = useState<boolean>(false);
    const [activeTaskState, _setActiveTasksState] = useState<boolean>(false);
   

    const addTask = () => {
       
        if (newTask.trim() !== "") {
            setTask((prevTasks) => [
                ...prevTasks,
                { id: Math.random().toString(), description: newTask, completed: false },
                
            ]);
           
            setNewTask("");
            
        }
    };
    const deleteTask = (index: number) => {
        const updateTask = activeTasks.filter((_, i) => i !== index);
        
        setActiveTasks(updateTask);
    
    }
   
    const deleteCheckedTask = () =>{
        const updatedTasks = task.filter(task => task.completed === false);
        setTask(updatedTasks);  
    }
    const activeTask = () => {
        const active = task.filter(task=> !task.completed);
        setActiveTasks(active);
        _setAllTasks(false);
        _setCompletedTasks(false);
        _setActiveTasksState(true);
    };
    const allTask = () => {
        setActiveTasks(task);
        _setAllTasks(true);
        _setCompletedTasks(false);
        _setActiveTasksState(false);
    };
    const allCompleted = () =>{
        const completed = task.filter(task => task.completed === true);
        setActiveTasks(completed);
        _setAllTasks(false);
        _setCompletedTasks(true);
        _setActiveTasksState(false);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        
        if (event.key === "Enter") { 
            addTask();
           
        }
        
    };
    
        const toggle = () =>{
            setToggleTheme(!toggleTheme);
        }
        const toggleChk = (index: number) =>{
            setTask(prevTasks => {
                const updatedTasks = [...prevTasks];
                updatedTasks[index] = { ...updatedTasks[index], completed: !updatedTasks[index].completed };
               
                return updatedTasks;
            });
            
        }
        //Drag and Drop method/function..

        const dragItems = useRef<number>(0);
        const draggedOverItems = useRef<number>(0);

        const handleDragStart = (index: number) => {
            dragItems.current = index;
          };
          
          const handleDragEnter = (index: number) => {
            draggedOverItems.current = index;
          };
          
        const handleSort = () =>{
            const taskClone = [...task];
            const temp = taskClone[dragItems.current];
            taskClone[dragItems.current] = taskClone[draggedOverItems.current];
            taskClone[draggedOverItems.current] = temp;
            setTask(taskClone);
        }
        useEffect(() => {
        allTask();
    }, [task]);

        return(
    <div
     className={`h-[120dvh] ${toggleTheme ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <div className='relative'>
        <img src={toggleTheme ? bg_mobile_dark : bg_mobile_light} className='w-[100%] lg:hidden' />
        <img src={toggleTheme ? bg_desktop_dark : bg_desktop_light} className='w-[100%] hidden lg:block' />
        <main className='absolute top-9 left-0 right-0'>

            <div className='top-9 mx-5 flex items-center justify-between lg:justify-evenly'>
                <h1 className='text-white text-3xl font-bold'>T O D O</h1>

                <button className='' onClick={toggle}>
                {toggleTheme ?  <img src={moon}  /> : <img src={sun}   />}
                </button>
                
            </div>
           
            <div className='flex justify-center mt-10 mx-5'>
          
            <input type='text'
            value={newTask}
            className={`px-5 w-[100%] h-[60px] mb-5 lg:w-[50%] rounded-md
            
            ${toggleTheme ? 'bg-slate-800 text-white' :
            'bg-slate-50 text-black'}`}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown} />
            </div>
            <div
             className='lg:flex lg:flex-col lg:justify-center lg:items-center'>
                
                {activeTasks.map((task, index) =>
                    //Dragging functionality..
                    
                <li  draggable="true"
                    onTouchStart={() => handleDragStart(index)}
                    onTouchMove={() => handleDragEnter(index)}
                     onTouchEnd={handleSort}
                     onTouchMoveCapture={(e) => e.preventDefault}
                     onDragStart={()=> {dragItems.current = index}}
                     onDragEnter={()=>{draggedOverItems.current = index}}
                     onDragEnd={handleSort}
                     onDragOver={(e) => e.preventDefault()}
                 
                  key={index} className={`
                ${toggleTheme ? "bg-slate-800 text-white" : "bg-slate-50 text-black"}
                shadow-xl rounded-lg
                p-5 font-bold flex justify-between mx-5 gap-2 items-center
                border border-b-2 border-b-gray-400 border-t-0 border-l-0 border-r-0 lg:w-[50%]`}>

                    <button onClick={() => toggleChk(index)} 
                    className={`border border-slate-600 rounded-full w-[20px] h-[20px]`}>
                    {task.completed ?
                     <img src={check}
                    className={`${task.completed ?
                    "bg-gradient-to-r from-sky-600 to-violet-600" : "bg-violet-600"}
                    w-[22px] h-[18px]  border border-1 rounded-full`} />
                    : null}
                    </button>

                    <span
                      className={`relative
                    ${toggleTheme ? "bg-slate-800 text-white" : "bg-slate-50 text-black"}
                    ${task.completed ? 'line-through text-gray-300' : ''}`}>{task.description}</span>
                    <img src={cross} className='w-[10px] h-[10px] cursor-pointer
                    hover:text-sky-800' onClick={()=>deleteTask(index)}/>
                </li>
                
                )}
               
                <div className={`${toggleTheme ? "bg-slate-800" : "bg-slate-50"}
                mx-5 flex justify-between  shadow-xl p-5 lg:w-[50%] mb-5 lg:hidden`}>
                
            {activeTasks && <span className='text-sm text-gray-500'>{activeTasks.length} items left</span> }                
                <span className='text-sm text-gray-500 lg:hidden hover:text-sky-600 cursor-pointer'>
                    <a onClick={deleteCheckedTask}>Clear completed</a>
                </span>
                
                </div>

            <div className={`${toggleTheme ? "bg-slate-800" : "bg-slate-50"}
                mx-5 flex justify-evenly lg:justify-between relative  shadow-xl p-5 lg:w-[50%] text-sm text-gray-500`}>
    
    {activeTasks && <span className='text-sm text-gray-500'>{activeTasks.length} items left</span> }

                <div className=' flex lg:gap-5 gap-10 justify-center items-center'>
             <span><a onClick={allTask} className={`hover:text-sky-600 cursor-pointer
             ${allTasks ? "text-sky-600" : ""}`}>All</a></span>
               
                <span><a onClick={activeTask} className={`hover:text-sky-600  cursor-pointer
                ${activeTaskState ? "text-sky-600" : ""}`}>Active</a></span>

                <span><a onClick={allCompleted} className={`hover:text-sky-600  cursor-pointer
                ${completedTasks ? "text-sky-600" : ""}`}>Completed</a></span>
                </div>

                <span className='text-sm text-gray-500 hidden lg:block hover:text-sky-600 cursor-pointer
                '><a onClick={deleteCheckedTask}>Clear completed</a></span>

                </div>
            </div>
            <div className='flex justify-center mt-10'>
            <span className='text-gray-500 text-sm'>
             Drag and drop to reorder list
            </span>
            </div>           
        </main>
        </div>
        
    </div>
    )
}
export default Todo