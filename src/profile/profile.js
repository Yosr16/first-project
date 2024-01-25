
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import Forme from '../comp/form'; 

function Profile() {
    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);

    const submitForm = (user) => {

        console.log('Formulaire soumis:', user);
    };

    return (
        <div>
            <Button className='btn mt-3' style={{ backgroundColor: "#0b3629", color: "white", maxWidth:70,maxHeight:30,padding:0 }} onClick={toggleModal}>
                add
            </Button>

            <Modal
                size='0g'
                isOpen={modal}
                toggle={toggleModal}
            >
        <ModalHeader toggle={toggleModal}  style={{ backgroundColor: '#31b0c9', color: '#ffffff' }}>
           <h4 class=" w-100 font-weight-bold">Add users</h4>
         </ModalHeader>


                <ModalBody>
                    
                    <Forme toggleModal={toggleModal} submitForm={submitForm} />
                </ModalBody>
            </Modal>
        </div>
    );
}

export default Profile;
