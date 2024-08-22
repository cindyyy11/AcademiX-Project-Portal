import axios from 'axios';
import React, {useState} from 'react';
import styles from './App.module.css';



const AuthPage = (props) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };



    const onSubmit = (e) => {
        e.preventDefault();
        const { username, secret } = e.target.elements;
        const userData = { username: username.value, secret: secret.value };

        axios.post('http://localhost:3001/authenticate', userData)
            .then(r => {
                props.onAuth({ ...r.data, secret: userData.secret });
            })
            .catch(e => {
                setErrorMessage(e.response.data.message || 'Authentication failed');
            });
    };

    return ( <div className={styles.background}>
             <form onSubmit={onSubmit} className={styles.formCard}>
        <div className={styles.formTitle}>
          Welcome to
          <img
            className={styles.welcomeImg}
            src="/inboxImage/AcademiX_Logo.png"
          ></img>
        </div>
        <div className={styles.formTitle2}>Live Messaging System</div>
        <div className={styles.formSubtitle}>
          <b>Create Account</b> or <b>Log In</b> to get started.{" "}
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <div className={styles.auth}>
          <div className={styles.authWrapper}>
            <div className={styles.authLabel}>Username</div>
            <input className={styles.authInput} name="username" required />
          </div>

          <div className={styles.authWrapper}>
            <div className={styles.authLabel2}>Password</div>


              <input
                className={styles.authInput2}
                type={passwordVisible ? "text" : "password"}
                name="secret"
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={togglePasswordVisibility}
              >
                <img
                  src={
                    passwordVisible
                      ? "/inboxImage/OpenEye.png"
                      : "/inboxImage/ClosedEye.png"
                  }
                  alt={passwordVisible ? "Hide" : "Show"}
                />
              </button>
          </div>

          <button className={styles.authButton} type="submit">
            Enter
          </button>
        </div>
      </form>
            
           
           
            
        </div>
        

        
        );
    
    };
    
export default AuthPage;