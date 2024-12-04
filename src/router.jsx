import { createBrowserRouter } from 'react-router-dom';

// import Layout from './views/layout';
import * as Weather from './views/weather';

const router = createBrowserRouter([
    {
        path: '/weather',
        element: <Weather.Component />
    }
]);

export default router;
