import React, { useEffect, useState } from 'react'
import { logout, useAuth, db } from '../firebase'
import { useNavigate } from 'react-router-dom';
import { uid } from 'uid';
import { set, ref, onValue, remove } from 'firebase/database';
import { uploadBytes, getDownloadURL} from 'firebase/storage'; 
import { onAuthStateChanged } from 'firebase/auth';
import { storage } from '../firebase';



const Home = () => {
    const navigate = useNavigate();
    const currentUser = useAuth();

    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [tag, setTag] = useState();
    const [date, setDate] = useState();
    const [img, setImg] = useState(null);
    const [url, setUrl] = useState("https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png");

    const [displayList, setDisplayList] = useState([])


    if(currentUser){
        
    }
    else{
        navigate('/')
    }

    
    

    // a different note space for every user
    const addNote = () => {
        const uidd = uid();
        set(ref(db, `/${currentUser.uid}/${uidd}`),
            {
                title: title,
                desc: desc,
                tag: tag,
                date: date,
                img: img,
                uidd: uidd
            }
        )
        setTitle("");
        setDesc("")
        setTag("")
        setDate("")
        setImg("")
    }

    const deleteNote = (uid) => {
        remove(ref(db, `${currentUser.uid}/${uid}`))
    }

    




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


    const handleImageChange = (e) => {
        // if(e.target.files[0]){
        //     setImg(e.target.files[0])
        // }

        if (e.target.files[0]) {
            setImg(e.target.files[0])
        }

        
    }
    // console.log(img);

    // to fix
    const uploadImg = () => {
        const imgRef = ref(storage, "image");
        uploadBytes(imgRef, img)
        .then(() => {
            getDownloadURL(imgRef)
            .then((url) => {
                setUrl(url)
            })
            console.log(img)
            .catch((error) => {
                console.log(error.message, "error getting image from databse")
            });
        setImg(null)
        }).catch((error) => {
            console.log(error.message)
        })
    
    }

    
    



  return (
    <>
    {/* to be replaced with navbar  */}
        signed in as: {currentUser?.email} <br />
        <button onClick={logout}>logout</button>
    {/*  */}

    {/* Add Note Function */}
    <div>
        <br />
        <div>
            <input type="text" placeholder='Enter note title' value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div>
            <textarea rows="" cols="" placeholder='Enter note Description' value={desc} onChange={e => setDesc(e.target.value)}></textarea>
        </div>
        <div>
            <input type="text" placeholder='Enter note tag' value={tag} onChange={e => setTag(e.target.value)}/>
        </div>
        <div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}/>
        </div>
        <div>
            <input type="file" onChange={handleImageChange}/> 
            <button onClick={uploadImg}>Upload</button> <br />
            <img src={url} style={{height:"50px", width:"auto"}} alt="img here!" />
        </div>
        <div>
            <button onClick={() => addNote()}>Add Note</button>
        </div>
    </div>

    {/* Display all notes */}
    <div>
        <br />
        <br />
        <br />
        Notes :

        {
            displayList.map(note => (
                <>
                    <p> 
                        Title: {note.title} <br />
                        Description: {note.desc} <br />
                        Tag: {note.tag} <br />
                        Date: {note.date} <br />
                        Image: {note.img} <br />
                        <button onClick={() => deleteNote(note.uidd)}>delete</button> <br/>
                    </p>
                </>
            ))
        }
    </div>

    </>

  )
}

export default Home