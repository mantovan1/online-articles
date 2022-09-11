import React, { useEffect, useState } from "react"

import Header from '../components/Header.js';

import styles from '../styles/Index.module.css';

import Link from "next/link";

import { useRouter } from 'next/router';

export default function Home() {

    const [articles, setArticles] = useState();

    useEffect(() => {
  
      loadArticles();
     
    }, [])

    const loadArticles = async () => {

      try{
        await fetch('http://192.168.15.152:8080/get-articles', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(async data => {
            try {
                setArticles(data);
            } catch (e) {
                // saving error
            }
        })
        
    }catch(err){
        //
    } 
    }

    const router = useRouter();

    return (
        <div>
            <Header />

            <div className={styles.news_head}>

              <h1>Artigos Recentes</h1>

            </div>

            <div className={styles.article_column}>

            {articles && articles.map( (article) => {

              const photo_path = 'http://192.168.15.152:8080/' + article.folder_path + '/0.jpeg';

              return(

                  <div onClick={(e) => {router.push({pathname: '/article', query: {id: article.id}})}} className={styles.articles}>

                    <img className={styles.articles_image} src={photo_path} />
                    
                    <div className={styles.headline}>
                      <h2>{article.title}</h2>
                    </div>
                  
                  </div>
              )
                
              

              })}

            </div>

            
        </div>
    )
}
