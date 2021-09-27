import React from 'react'
import { useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { db, storage } from './firebase';
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}) {
    const filepickerRef = useRef(null);
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
      };
      const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progresse ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100 
                );
                setProgress(progress);
            },
            (error) => {
                //error function
                console.log(error);
                alert(error.message);

            },
            () => {
                // complete function
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post img db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
            }
        )
    };

    const removeImage = () => {
        setImage(null);
    }

    return (
        <div >
            <div className="imageupload">
            {image && 
                <progress className="imageupload_progress" value={progress} max="100" />
            } 
            {image && 
                <p className="imageupload_remove" onClick={removeImage} >remove</p>
            }
            </div>     
            <div className="imageupload">    
                <div onClick={() => filepickerRef.current.click()} className="inputIcon">
                        <PhotoLibraryIcon className="imageupload_icon"/>
                        <input ref={filepickerRef} onChange={handleChange} type="file" hidden />
                    </div>
                    <input className="imageupload_input" type="text" placeholder='  Your caption goes here' onChange={ event => setCaption(event.target.value)} value={caption} />
                    {/*<input type="file" onChange={handleChange} />*/}
                <div className="imageupload_button" onClick={handleUpload} >
                    Upload
                </div>
            </div>  
        </div>
    )
}

export default ImageUpload
