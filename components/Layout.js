import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main style={{ padding: '2rem 0' }}>{children}</main>
        </>
    );
}
