// import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useAuth, db } from '../firebase'
import { useNavigate } from 'react-router-dom';
import { uid } from 'uid';
import { ref, set, onValue, remove } from 'firebase/database';


// storage
import { getDownloadURL, getStorage, ref as stRef, uploadBytesResumable } from 'firebase/storage';

import { v4 } from 'uuid';

// icons
import { FaPlus } from 'react-icons/fa';

// Toast
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

    

const Home = () => {
    const navigate = useNavigate();
    const currentUser = useAuth();

    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [tag, setTag] = useState();
    const [date, setDate] = useState();
    const [file, setFile] = useState();
    const [url, setUrl] = useState();
    const [dataUrl, setDataUrl] = useState();

    // progress state's
    const [displayProgress, setDisplayProgress] = useState()
    const [isUploading, setIsUploading] = useState(false);


    const [displayList, setDisplayList] = useState([])

    // storage variables
    const storage = getStorage();
    
    if(currentUser){
        
    }
    else{
        navigate('/')
    }
      
    

    // a different note space for every user
    const addNote = () => {
        if(!title || !desc || !tag || !date){
            toast.warning("Please fill all the required fields")
        }
        else{
            const uidd = uid();
            set(ref(db, `/${currentUser.uid}/${uidd}`),
                {
                    title: title,
                    desc: desc,
                    tag: tag,
                    date: date,
                    img: dataUrl,
                    uidd: uidd,
                    
                }
            )
            setTitle("");
            setDesc("")
            setTag("")
            setDate("")
            toast.success("Note Added successfully")
        }
    }

    const deleteNote = (uid) => {
        remove(ref(db, `${currentUser.uid}/${uid}`))
        toast.error("Note deleted!")
    }

    

    const handleChange = (e) => {
        e.preventDefault();
        if(e.target.files){
            setFile(e.target.files[0]);
        }
    }


    // 

    const upload = e => {
        console.log("upload event called");
        
        if(!file){
            return;
        }
        else{
            const metadata = {
                contentType: file.type,
            };

            const storageRef = stRef(storage, 'images/' + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                
                setIsUploading(true);
                setDisplayProgress(progress)

                console.log("upload is " + progress + "% done");
                switch (snapshot.state) {
                    
                    case 'paused':
                        console.log("upload paused");
                        break;

                    case 'running':
                        console.log("upload is in progress");
                        break;

                    case 'completed':
                        toast.success("Image uploaded!")
                }
                if(progress == 100){
                    toast.success("Image uploaded!", {
                        autoClose: 500,
                        position: "top-right",
                        closeButton: false
                    })
                }
            }, (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log("non access permission!")
                        break;

                    case 'storage/canceled':
                        console.log("upload canceled");
                        break;
                }
            } , () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log("file available at: ", downloadURL);
                    setUrl(downloadURL);
                    setDataUrl(downloadURL)
                    setIsUploading(false)
                    
                });
                
            });
        }
        
        
        




    };
   


    useEffect(() => {
        if(currentUser){
          onValue(ref(db, `/${currentUser.uid}`), snapshot => {
              setDisplayList([]);
              const data = snapshot.val();
              if(data !== null){
                Object.values(data).map(todo => {
                    setDisplayList((oldArray) => [...oldArray, todo])
                })
              }
          })
        }
    }, [currentUser])



  return (
    <>
    
    {/* Add Note Function */}
    <div className='text-center '>
        <p className='text-2xl py-2 font-semibold'  style={{fontFamily:'Major Mono Display'}}>
            AddNote
        </p>

        <div className='py-1'>
            <input className='px-2 py-1 border w-9/12' type="text" placeholder='Enter note title' value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div className='py-1'>
            <textarea className='px-2 py-1 border w-9/12' rows="" cols="" placeholder='Enter note Description' value={desc} onChange={e => setDesc(e.target.value)}></textarea>
        </div>
        <div className='py-1'>
            <input className='px-2 py-1 border w-9/12' type="text" placeholder='Enter note tag' value={tag} onChange={e => setTag(e.target.value)}/>
        </div>
        <div className='py-1'>
            <input className='px-2 py-1 border w-9/12' type="date" value={date} onChange={e => setDate(e.target.value)}/>
        </div>
        <div className='py-1 border w-9/12 ml-[12.5%]'>

            <input className='px-2 py-1  w-9/12' type="file" onChange={handleChange} /> 
            <button className='px-3 py-2 border rounded-full' onClick={upload}><FaPlus /></button> <br />

        </div>
        {/* showing progress according to upload status */}
        {
            isUploading && (
                <div>
                    Image upload status: {displayProgress} %
                </div>
            )
        }
        

        <div className='py-1'>
            <button className='px-2 py-1 border w-9/12 bg-black text-white rounded-xl'  style={{fontFamily:'Montserrat'}} onClick={() => addNote()}>Add Note</button>
        </div>
    </div>

    {/* Display all notes */}
    <div>
        
        <p className='font-bold text-center underline underline-offset-4 py-10 text-xl' style={{fontFamily:'Major Mono Display'}}>
            Your Notes 
        </p>

        <div className='sm:flex px-4'>
        {
            displayList.map(note => (
                <>
                        <div key={note.uidd} className="border-gray-300 sm:w-1/5 border-x-2 border-y-2 rounded-lg hover:shadow-xl mx-3 my-4 px-3 py-3 ">
                            <p className='font-mono '> 
                                <span className='font-semibold '  style={{fontFamily:'Montserrat'}} >Title:</span> {note.title} <br />
                                <span className='font-semibold '  style={{fontFamily:'Montserrat'}} >Description:</span> {note.desc} <br />
                                <span className='font-semibold '  style={{fontFamily:'Montserrat'}} >Tag:</span> {note.tag} <br />
                                <span className='font-semibold '  style={{fontFamily:'Montserrat'}} >Date:</span> {note.date} <br />
                                {/* Image name: {note.img?.name} */}<br/>
                                <img className='rounded-md' id='imgTag' src={note.img} alt="" style={{height:"auto", width:"100%"}}/> 
                                <button  className='px-2 py-1 pt-2 w-full mt-1 border text-lg rounded-md bg-red-500 text-white' onClick={() => deleteNote(note.uidd)}><span className="material-symbols-outlined" >delete</span></button> <br/>
                            </p>
                        </div>
                </>
            ))
        }
        </div>
    </div>
    <ToastContainer />
    </>

  )
}

export default Home