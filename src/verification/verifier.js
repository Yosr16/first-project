import React, { useState } from 'react';
import { ref, get } from 'firebase/database';
import StartFirebase from '../firebaseConfig/index';
import './verifier.css';
const db = StartFirebase();

const CheckUserForm = () => {
  const [email, setEmail] = useState('');
  const [userExists, setUserExists] = useState(null);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const checkUserExists = async () => {
    const dbRef = ref(db, "userData");

    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();

        
        const doesUserExist = Object.values(userData).some(user => user.Email === email);

        setUserExists(doesUserExist);
      } else {
        console.log("Aucune donnée trouvée dans la base de données.");
        setUserExists(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données depuis la base de données:", error);
      setUserExists(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkUserExists();
  };

  return (
    <div>
      <form 
      style={{
        margin: "auto",
        padding: "15px",
        maxwidth: "300px",
        fontSize:"15px",
        

        alignContent: "center"
    }}
    className="modal-footer d-flex justify-content-center"
     onSubmit={handleSubmit}>
        <label>
          Email : 

           <input type="email" className="form-control"  value={email} onChange={handleEmailChange} />
        </label>
        <div className="but">
        <button type="submit"> Vérifier </button>
        </div>
      </form>

      {userExists !== null && (
        <p>
          L'utilisateur avec l'email {email} {userExists ? 'existe.' : "n'existe pas."}
        </p>
      )}
    </div>
  );
};

export default CheckUserForm;