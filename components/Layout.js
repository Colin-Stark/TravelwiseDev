import MainNavbar from './MainNavbar';

export default function Layout({ children }) {
    return (
        <>
            <MainNavbar />
            <main style={{ padding: '2rem 0' }}>{children}</main>
        </>
    );
}
