/* eslint-disable react/prop-types */
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AirIcon from '@mui/icons-material/Air';
import StormIcon from '@mui/icons-material/Storm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import UmbrellaIcon from '@mui/icons-material/Umbrella';

export default function WeatherStyle({ weather }) {
    let IconComponent;

    switch (true) {
        case (weather?.id >= 200 && weather?.id <= 232):
            IconComponent = ThunderstormIcon;
            break;
        case (weather?.id >= 300 && weather?.id <= 321):
            IconComponent = CloudIcon;
            break;
        case (weather?.id >= 500 && weather?.id <= 531):
            IconComponent = UmbrellaIcon;
            break;
        case (weather?.id >= 600 && weather?.id <= 622):
            IconComponent = AcUnitIcon;
            break;
        case (weather?.id >= 701 && weather?.id <= 781):
            IconComponent = AirIcon;
            break;
        case (weather?.id === 800):
            IconComponent = WbSunnyIcon;
            break;
        case (weather?.id >= 801 && weather?.id <= 804):
            IconComponent = CloudIcon;
            break;
        default:
            IconComponent = StormIcon;
            break;
    }

    return (
        <div>
            <IconComponent />
        </div>
    );
}