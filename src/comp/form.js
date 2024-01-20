import React, { useState } from 'react';
import CheckUserForm from '../verification/verifier';
import './form.css';

const Form = ({ toggleTable }) => {
    const [user, setUser] = useState({
        Name: '',
        Email: '',
        Number: '',
        cin: '',
        Status: ''
    });

    const data = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUser({ ...user, [name]: value });
    };

    const getdata = async (e) => {
        e.preventDefault();

        if (!user.Name || !user.Email || !user.Number || !user.cin || !user.Status) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Name: user.Name,
                Email: user.Email,
                Number: user.Number,
                cin: user.cin,
                Status: user.Status 
            })
        };

        const res = await fetch('https://first-project-d9cea-default-rtdb.firebaseio.com/userData.json', options);
        
        if (res.ok) {
            alert("Utilisateur ajouté avec succès");
        } else {
            alert("Erreur lors de l'envoi du message");
        }

        setUser({
            Name: '',
            Email: '',
            Number: '',
            cin: '',
            Status: '' 
        });

        toggleTable();
    };

    const handleVerifyClick = () => {
        console.log("Vérification de l'utilisateur");
    };

    return (
        <>
            <div className='form'>
                <div className='container'>
                    <form method='POST'>
                    <input type='text' name='Name' placeholder='Your Name' value={user.Name} autoComplete='off' required onChange={data}></input>
                        <input type='email' name='Email' placeholder='Email' value={user.Email} autoComplete='off' required onChange={data}></input>
                        <input type='text' name='Number' placeholder='Phone Number' value={user.Number} autoComplete='off' required onChange={data}></input>
                        <input type='text' name='cin' placeholder='cin' value={user.cin} autoComplete='off' required onChange={data}></input>
                        <input type='text' name='Status' placeholder='Status (active/inactive)' value={user.Status} autoComplete='off' required onChange={data}></input>
                        <div className="buttons">
                            <button onClick={getdata}>submit</button>
                            <button type="button" onClick={toggleTable}>afficher</button>
                           
                        </div>
                    </form>
                </div>
            </div>
            <CheckUserForm />
        </>
    );
};

export default Form;