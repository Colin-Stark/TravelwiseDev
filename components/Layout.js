import { Container, Row } from 'react-bootstrap';
import MainNavbar from './MainNavbar';
import { useContext } from 'react';
import { ThemeContext } from '@/pages/_app';

export default function Layout(props) {   
    const {theme} = useContext(ThemeContext);
    
    return (
        <>
            <MainNavbar/>
            <div className='m-0' style={{ height: '60px' }}></div>
            <Row className={"main-container m-0 p-0 "+theme} data-bs-theme={theme}>
                {props.children}
            </Row>
        </>
    );
}
