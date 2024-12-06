import { createBrowserRouter } from 'react-router-dom';

import * as Weather from './views/weather';

import * as Login from './views/login';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login.Component />,
        action: Login.action
    },
    {
        path: '/weather',
        element: <Weather.Component />
    }
]);

export default router;
