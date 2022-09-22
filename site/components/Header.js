import React, { useEffect, useState } from "react";

import styles from '../styles/Header.module.css';

export default function Header() {

    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    const verifyAdmin = async () => {
        setToken(await localStorage.getItem('@token'));

        await fetch('http://192.168.15.152:8080/isAdmin', {
            method: 'get',
            headers: {
                'x-access-token': token 
            }
        })
        .then(response => response.json())
        .then(async data => {
            if(data.auth == true) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        })
    }

    const clear = async () => {

        await localStorage.removeItem('@token');
        await localStorage.removeItem('@admin');

        window.location.reload(false);

    }

    useEffect(() => {
        verifyAdmin();
    })

    return (
        <div className={styles.menu}>
            <a href="./"> Inicio </a>
            
            {isAdmin==true &&
                
                <a href="./publicacao"> Publicar Artigo </a>
                
            }

            {isAdmin==true &&
                
                <a onClick={clear}> Sair </a>
                
            }

            {isAdmin==false &&
                
                <a href="./login"> Login </a>
                
            }
            
        </div>
    )
}