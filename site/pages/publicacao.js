import React, {useRef, useState} from "react";

import Header from '../components/Header.js';

import styles from '../styles/Publicacao.module.css';

export default function Publicacao() {

    /////////////////////////////////////////////////////////////////////////////

    const [title, setTitle] = useState('');

    const [paragraphs, setParagraphs] = useState([]);

    const [numberParagraphs, setNumberParagraphs] = useState(1);

    const [images, setImages] = useState([]);

    const [imagesURL, setImagesURL] = useState([]);

    const [currentImage, setCurrentImage] = useState(0);

    /////////////////////////////////////////////////////////////////////////////

    const publicar = async () => {

        const token = await localStorage.getItem('@token');

        const formData = new FormData();

        formData.append('title', title);

        paragraphs.map((e, i) => {
            formData.append('paragraphs', e)
        })

        images.map((e, i) => {
            formData.append('images', e)
        })

        //console.log('images');

        try{
            await fetch('http://192.168.15.152:8080/publish', {
                method: 'post',
                headers: {
                    'x-access-token': token 
                },
                body: formData
            })
            .then(response => response.text())
            .then(async data => {
                if(data.auth == false) {
                    window.alert('É preciso estar logado para fazer uma publicação');
                }
            })
    
        } catch(err) {
            window.alert('É preciso estar logado para fazer uma publicação');
        }

    }

    /////////////////////////////////////////////////////////////////////////////

    const addText = async (text, index) => {

        paragraphs[index] = text;

    }

    const addParagraph = async (e) => {
        e.preventDefault;

        setNumberParagraphs(numberParagraphs+1);
        setParagraphs([...paragraphs, null]);

    }

    const addImage = async (e) => {
        e.preventDefault;

        setNumberImages(numberImages+1);
    }

    const changeCurrentImage = async(index) => {
        setCurrentImage(index);
    }
    
    return (

        <div className={styles.container}>
            
            <Header />

            <textarea onChangeCapture={(e) => {setTitle(e.target.value)}} placeholder="Título" className={styles.textFieldTitle} />

            <div className={styles.imageContainer}>

                {imagesURL && 

                    <>

                        <img src={imagesURL[currentImage]} className={styles.image}></img>

                    </>    
                }

            </div>

            <div className={styles.baseline_imageContainer}>
               {[...Array(imagesURL.length)]
                    .map((e, i) => 
                       <div onClick={(e) => changeCurrentImage(i)} className={i==currentImage?styles.selected:styles.selectImages} />
                    )
                }
            </div>

            <input onChangeCapture={
                (e) => {

                    if(imagesURL.length > 0) {
                        setImages([...images, e.target.files[0]] );
                        setImagesURL([...imagesURL, URL.createObjectURL(e.target.files[0])] )
                        
                    } else {
                        setImages([e.target.files[0]] );
                        setImagesURL([URL.createObjectURL(e.target.files[0])] )
                    }
                }
            }
            className={styles.imagePicker} type={"file"} alt="Escolha uma imagem" accept=".jpg" />

            {[...Array(numberParagraphs)]
                .map((e, i) => 
                    <textarea onChangeCapture={(event) => addText(event.target.value, i)} placeholder="..." className={styles.textField}/>
                )
            }

            <button onClick={(e) => {addParagraph(e)}} className={styles.btnAddParagraph}>{'Adicionar paragráfo'}</button>

            <button className={styles.btnPublish} onClick={publicar}>{'Publicar'}</button>

        </div>
    )

}