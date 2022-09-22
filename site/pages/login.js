import React, { useState } from "react";
import Header from '../components/Header';

import Router from 'next/router'

import styles from '../styles/Login.module.css';

export default function Login() {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [message, setMessage] = useState(null);


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await fetch('http://192.168.15.152:8080/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                .then(response => response.json())
                .then(async data => {
                    try {
                        setMessage(data.message);
                        await localStorage.setItem('@token', data.token);
                        await localStorage.setItem('@admin', data.result);

                        Router.push('/');
                    } catch (e) {
                        // saving error
                    }
                })

        } catch (err) {
            //
        }

    }

    return (
        <div className={styles.container}>
            <Header />

            <form className={styles.loginBox} onSubmit={(e) => handleLogin(e)}>
                <a> Login </a>
                <input type={"text"} onChange={(e) => { setUsername(e.target.value) }} placeholder="username..." />
                <input type={"text"} onChange={(e) => { setPassword(e.target.value) }} placeholder="password..." />
                <input className={styles.btn} type={"submit"} placeholder="Login" />
            </form>

            <a>
                {message}
            </a>

        </div>
    )
}