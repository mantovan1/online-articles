import React, {useEffect, useState} from "react";

import Header from '../components/Header.js';

import styles from '../styles/Article.module.css';

export default function Article({id}) {

    /////////////////////////////////////////////////////////////////////////////

    const [title, setTitle] = useState('');

    const [paragraphs, setParagraphs] = useState([]);

    const [images, setImages] = useState([]);

    const [currentImage, setCurrentImage] = useState(0);

    const [folder_path, setFolderPath] = useState();

    useEffect(() => {
        loadArticle();
    }, [])

    /////////////////////////////////////////////////////////////////////////////

    const loadArticle = async () => {
        try{
            await fetch('http://192.168.15.152:8080/get-article/' + id, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async data => {
                try {
                    //setArticle(data);
                    setTitle(data.title);
                    setParagraphs(data.paragraphs);
                    setImages(data.images);

                    setFolderPath(data.folder_path);
                } catch (e) {
                    // saving error
                }
            })
            
        }catch(err){
            //
        } 
    }

    /////////////////////////////////////////////////////////////////////////////

    const changeCurrentImage = async(index) => {
        setCurrentImage(index);
    }
    
    return (

        <div className={styles.container}>
            
            <Header />

            <a className={styles.textFieldTitle}>{title}</a>

            <div className={styles.imageContainer}>

                {images && 

                    <>

                        <img src={'http://192.168.15.152:8080/' + folder_path + '/' + images[currentImage]} className={styles.image}></img>

                    </>    
                }

            </div>

            <div className={styles.baseline_imageContainer}>
               {[...Array(images.length)]
                    .map((e, i) => 
                       <div onClick={(e) => changeCurrentImage(i)} className={i==currentImage?styles.selected:styles.selectImages} />
                    )
                }
            </div>

            {paragraphs
                .map((e, i) => 
                    <a className={styles.textField}>{e}</a>
                )
            }

        </div>
    )

}

Article.getInitialProps = async ({ query }) => {
    const {id} = query
  
    return {id}
}