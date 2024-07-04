"use client"
import React from 'react'
import './addworkout.css'
import { toast } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';



interface Workout{
    name: string;
    description: string;
    durationInMinutes: number;
    exercises: Exercise[];
    imageURL: string,
    imageFile: File | null;
}
interface Exercise{
    name: string;
    description: string;
    sets: number;
    reps: number;
    imageURL: string,
    imageFile: File | null;
}

const page = () => {
    const [workout, setWorkout] = React.useState<Workout>({
        name: '',
        description: '',
        durationInMinutes: 0,
        exercises: [],
        imageURL: '',
        imageFile: null
    });

    const [exercise, setExercise] = React.useState<Exercise>({
        name: '',
        description: '',
        sets: 0,
        reps: 0,
        imageURL: '',
        imageFile: null
    });

    const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        setWorkout({
            ...workout, 
            [e.target.name]: e.target.value
         });
    }

    const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement >) => {
        setExercise({
           ...exercise,
            [e.target.name]: e.target.value 
        });
    }

    const addExerciseToWorkout = (e?: React.MouseEvent<HTMLButtonElement>) =>{
        console.log(exercise);

        if(exercise.name == '' || exercise.description == '' || exercise.sets == 0 || exercise.reps == 0 || exercise.imageFile == null){
            toast.error('Please fill all fields ',{
              position: 'top-center',
            });
            return;
        }
      
      setWorkout({
         ...workout, 
          exercises: [...workout.exercises, exercise]
      })
      // setExercise({
      //   name: '',
      //   description: '',
      //   sets: 0,
      //   reps: 0,
      //   imageURL: '',
      //   imageFile: null
      // })
      
    }
    const deleteExerciseFromWorkout = (index: number) =>{
      setWorkout({
         ...workout, 
          exercises: workout.exercises.filter((exercise, i)=> i!==index)
      })
    }
    const uploadImage = async (image:File) =>{
      const formData = new FormData();
      formData.append('myimage', image);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadimage`, {
        method: 'POST',
        body: formData
      });
     if(response.ok){
      const data = await response.json();
      console.log('Image Uploaded Successfully',data);
      return data.imageUrl;
     }else{
      console.error('Failed to upload image');
      return null;
     }

    }
    const checkLogin = async () =>{
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/admin/checklogin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if(response.ok){
        console.log('Admin is authenticated');
        
      }else{
        console.error('Admin is not authenticated');
        window.location.href = '/adminauth/login';
      }
    }

    const saveWorkout = async () =>{
      await checkLogin();
      console.log(workout)

      if(workout.name == '' || workout.description == '' || workout.durationInMinutes == 0 || workout.exercises.length == 0|| workout.imageFile == null){
        toast.error('Please fill all fields ',{
          position: 'top-center',
        });
        return;
      }
      if(workout.imageFile){
        const imageUrl = await uploadImage(workout.imageFile);
        if(imageUrl){
          setWorkout({
            ...workout,
             imageURL: imageUrl
          })
        }else{
          toast.error('Failed to upload image');
          return;
        }
      }
      for(let i =0;i<workout.exercises.length;i++){
        let tempimg = workout.exercises[i].imageFile;
        if(tempimg){
          let imgURL = await uploadImage(tempimg);
          workout.exercises[i].imageURL = imgURL;
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
        credentials: 'include'
      });
      
      if(response.ok){
        const data = await response.json();
        console.log('Workout created successfully',data);
        toast.success('Workout created successfully',{
          position: 'top-center',
        });
        
      }else{
        console.error('Failed to create workout', response.statusText);

        toast.error('Failed to create workout',{
          position: 'top-center',
        });
      }
      
     


    }

  return (
    <div className="formpage">
        <h1 className='title'>Add Workout</h1>
      <input
        type="text"
        name="name"
        placeholder="Workout Name"
        value={workout.name}
        onChange={handleWorkoutChange}
      />
      <br />

      <textarea
        // type="text"
        name="Description"
        placeholder="Workout Description"
        value={workout.description}
        onChange={(e)=>{
            setWorkout({
             ...workout,
              description: e.target.value
            })
  
        }}
        rows={5}
        cols = {50}
      />
      <label htmlFor="durationInMinutes">Duration In Minutes</label>
      <input 
        type="number"
        placeholder='Workout Duration'
        name='durationInMinutes'
        value={workout.durationInMinutes}
        onChange={handleWorkoutChange} 
      />

      <br />
      
      <input
        type="file"
        placeholder='Workout Image'
        name='workoutImage'
        //accept="image/*"
        onChange={(e)=>
            setWorkout({
             ...workout,
              imageFile: e.target.files![0]
    
        })
        
    }
      />
      <div  
       style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // width: '100%',
        // height: '100%',
        // background: 'url('+workout.imageURL+')',
       }}
      >
        <h2 className='title'>Add Exercise to workout</h2>
        <input
          type="text"
          name="name"
          placeholder="Exercise Name"
          value={exercise.name}
          onChange={handleExerciseChange}
          />
        <textarea 
            //type="text" 
            placeholder="Exercise Description"
            name='description'
            value={exercise.description}
            onChange={(e)=>{
                setExercise({
                 ...exercise,
                  description: e.target.value
                })
      
            }}
            rows={5}
            cols = {50}
        />
        <label htmlFor="sets">Sets</label>
        <input
            type="number"
            placeholder='Sets'
            name='sets'
            value={exercise.sets}
            onChange={handleExerciseChange}
         />
         <label htmlFor="reps">Reps</label>
         <input
            type="number"
            placeholder='Reps'
            name='reps'
            value={exercise.reps}
            onChange={handleExerciseChange}
        />
        <input
            type="file"
            placeholder='Exercise Image'
            name='exerciseImage'
            //accept="image/*"
            onChange={(e)=> {
                setExercise({
                 ...exercise,
                  imageFile: e.target.files![0]
                })

            }}
        />
        <button
      onClick={(e) => 
        {
            addExerciseToWorkout(e)
        }}
      >Add Exercise</button>
      </div>

      <div className='exercises'>
      <h1 className='title'>Exercises</h1>
        {
          
        workout.exercises.map((exercise, index)=> (
            
                <div key={index} className='exercise'>
                   
                   
                        <h2>{exercise.name}</h2>
                        <p>{exercise.description}</p>
                        <p>Sets: {exercise.sets}</p>
                        <p>Reps: {exercise.reps}</p>
                        <img src={exercise.imageFile ? 
                          URL.createObjectURL(exercise.imageFile) : 
                          exercise.imageURL
                         }
                         
                        alt={exercise.name} />

                         <button onClick={()=> 
                          deleteExerciseFromWorkout(index)}>
                          Delete</button>
                </div>
        )
            
        )}

      </div>
        <button
          onClick={(e) =>
            saveWorkout()

          }
          >Add Workout</button>

    </div>
  )
}

export default page