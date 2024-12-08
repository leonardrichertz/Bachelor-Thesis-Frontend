import { createBrowserRouter } from 'react-router-dom';

import * as Weather from './views/authenticated/weather';
import * as Authenticated from './views/authenticated';

import * as Login from './views/login';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login.Component />,
        action: Login.action
    },
    {
        path: '/weather',
        element: <Weather.Component />,
        loader: Authenticated.loader,
    }
]);

export default router;
