import React from 'react'
import './Nav.css'
import hcbgImage from '../../../src/images/boy.jpg'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"
import Login from '../Login'
import UpdateProfile from './Profile/UpdateProfile'

import { Navbar, Nav, NavDropdown, Container, Alert, Modal, Form, Button, FormControl } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { TabTitle } from '../../utils/GeneralFunction'
import { useNews } from '../../contexts/NewsContext'
import { doc, query, collection, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db, storage } from '../../Firebase'

export default function Header() {
    TabTitle("Aadhikhola home")
    const [screenpositon, changescreenpositon] = useState(false)
    const { currentUser } = useAuth()
    const { logout } = useAuth()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [error, setError] = useState('');
    const [sahayogurl, setSahayogurl] = useState(null);

    async function hanldeconsole() {

    }

    async function handlepdfurl() {

        window.open(sahayogurl, '_blank')
    }

    async function loadsahayogurl() {
        try {
            const ref = doc(db, "sahayog", "pdffile");
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                //and the pdf url is 
                setSahayogurl(docSnap.data()['pdfurl']);
            } else {
                setSahayogurl("No such document!");
            }
        }
        catch (e) {
            console.log(e.message)
        }
    }

    useEffect(
        () => {
            loadsahayogurl()

        }, []
    )

    async function handlelogout() {
        setError('')
        try {
            handleClose();
            setError("Please wait...")
            await logout()
            // history('/login')
            localStorage.setItem('role', 'user')
            window.location.reload(false);
        }
        catch (e) {
            setError('Failed to Logout');
        }
    }


    const changeBackground = () => {
        console.log(window.scrollY)
        if (window.scrollY >= 80) {
            changescreenpositon(true)
        } else {
            changescreenpositon(false)
        }
    }
    const handleResize = (e) => {
        console.log(window.innerWidth)
        if (window.innerWidth <= 1000) {

            changescreenpositon(true)
        } else {
            changescreenpositon(false)
        }

    };
    useEffect(() => {
        if (window.innerWidth <= 1000) {
            changescreenpositon(true)
        } else {
            changescreenpositon(false)
        }
        //lets load the 


    }, []);

    window.addEventListener('scroll', changeBackground);
    window.addEventListener('resize', handleResize)



    return (
        <div  >
            <header>
                <Navbar className={screenpositon ? "navsolidheader " : "navheader "} expand="lg">
                    <Container >

                        <Navbar.Brand href="#" ><span className="navtitle">Aadhikhola</span></Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="ml-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                                <Nav.Link href="#">Home</Nav.Link>
                                <Nav.Link href='/About'>

                                    About


                                </Nav.Link>
                                <Nav.Link href="/Contact">Contact</Nav.Link>
                                <Nav.Link href={sahayogurl}>

                                    Donors

                                </Nav.Link>
                                {/* <Nav.Link href="/sds" target="_blank" >Donation</Nav.Link> */}

                                {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">
                                Something else here
                            </NavDropdown.Item>
                        </NavDropdown> */}
                                <Nav.Link href="#" >

                                    {currentUser && currentUser.email ?
                                        <strong onClick={handleShow} className='log-out-btn'>
                                            Logout
                                        </strong> :

                                        <span>

                                        </span>

                                    } </Nav.Link>
                            </Nav>
                            {/* <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form> */}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>

            <section className="banner" style={{

                backgroundImage: `url(${hcbgImage})`,
                backgroundSize: "cover",
                height: "100vh",
                color: "#f5f5f5"

            }}>

                <div className='container'>

                    <div class="col-md-6">

                        <div className='banner_desc'>
                            <h1 class="title">
                                आधिखोला क्लवमा यहाँलाई स्वागत छ

                            </h1>
                            <p className='desc'>
                                आधिखोला क्लवको सान, कृषि रोजगार खेलकुद संस्कृतिको प्रवर्द्धन ।
                            </p>
                            {
                                error && <Alert variant="danger">
                                    {error}
                                </Alert>
                            }
                            {/* <a href="#" className='btn btn-color'>
                                Read More
                            </a> */}


                            {currentUser && currentUser.email ?
                                <Link to='/UpdateProfile'> <span className='btn btn-trans'>
                                    {currentUser.email} </span>
                                </Link>
                                :
                                <Link to='/Login'> <span className='btn btn-trans'>
                                    Join</span>
                                </Link>
                            }


                        </div>

                    </div>

                </div>


            </section >
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Are your sure  you want to logout?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlelogout}>
                        Log out
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >

    )
}
