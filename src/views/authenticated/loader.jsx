import { redirect } from 'react-router-dom';

export default async function loader() {
    const access_token = localStorage.getItem('access_token');

    if (!access_token) {
        redirect('/login');
    }

    return null;
}